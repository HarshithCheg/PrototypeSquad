import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { uploadedFilesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  GetFileParams,
  DeleteFileParams,
  ListFilesQueryParams,
} from "@workspace/api-zod";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

const router = Router();

router.get("/files", async (req, res) => {
  const parseResult = ListFilesQueryParams.safeParse(req.query);
  const section = parseResult.success ? parseResult.data.section : undefined;

  const files = await db
    .select()
    .from(uploadedFilesTable)
    .where(section ? eq(uploadedFilesTable.section, section) : undefined)
    .orderBy(uploadedFilesTable.uploadedAt);

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const result = files.map((f) => ({
    id: f.id,
    filename: f.filename,
    originalName: f.originalName,
    mimeType: f.mimeType,
    section: f.section,
    fileSize: f.fileSize,
    url: `${baseUrl}/api/files/${f.id}/download`,
    uploadedAt: f.uploadedAt.toISOString(),
  }));

  res.json(result);
});

router.get("/files/sections", async (_req, res) => {
  const rows = await db
    .select({
      section: uploadedFilesTable.section,
      count: sql<number>`count(*)::int`,
    })
    .from(uploadedFilesTable)
    .groupBy(uploadedFilesTable.section);

  res.json(rows.map((r) => ({ section: r.section, count: r.count })));
});

router.post("/files/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const section = (req.body.section as string) || "general";

  const [inserted] = await db
    .insert(uploadedFilesTable)
    .values({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      section,
      fileSize: req.file.size,
      filePath: req.file.path,
    })
    .returning();

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.status(201).json({
    id: inserted.id,
    filename: inserted.filename,
    originalName: inserted.originalName,
    mimeType: inserted.mimeType,
    section: inserted.section,
    fileSize: inserted.fileSize,
    url: `${baseUrl}/api/files/${inserted.id}/download`,
    uploadedAt: inserted.uploadedAt.toISOString(),
  });
});

router.get("/files/:id/download", async (req, res) => {
  const parseResult = GetFileParams.safeParse({ id: Number(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [file] = await db
    .select()
    .from(uploadedFilesTable)
    .where(eq(uploadedFilesTable.id, parseResult.data.id))
    .limit(1);

  if (!file) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  if (!fs.existsSync(file.filePath)) {
    res.status(404).json({ error: "File not found on disk" });
    return;
  }

  res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
  res.setHeader("Content-Type", file.mimeType);
  res.sendFile(path.resolve(file.filePath));
});

router.get("/files/:id", async (req, res) => {
  const parseResult = GetFileParams.safeParse({ id: Number(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [file] = await db
    .select()
    .from(uploadedFilesTable)
    .where(eq(uploadedFilesTable.id, parseResult.data.id))
    .limit(1);

  if (!file) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json({
    id: file.id,
    filename: file.filename,
    originalName: file.originalName,
    mimeType: file.mimeType,
    section: file.section,
    fileSize: file.fileSize,
    url: `${baseUrl}/api/files/${file.id}/download`,
    uploadedAt: file.uploadedAt.toISOString(),
  });
});

router.delete("/files/:id", async (req, res) => {
  const parseResult = DeleteFileParams.safeParse({ id: Number(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [file] = await db
    .select()
    .from(uploadedFilesTable)
    .where(eq(uploadedFilesTable.id, parseResult.data.id))
    .limit(1);

  if (!file) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (fs.existsSync(file.filePath)) {
    fs.unlinkSync(file.filePath);
  }

  await db.delete(uploadedFilesTable).where(eq(uploadedFilesTable.id, parseResult.data.id));
  res.status(204).send();
});

export default router;

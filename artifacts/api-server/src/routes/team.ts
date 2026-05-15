import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { teamMembersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateTeamMemberParams, UpdateTeamMemberBody, UploadTeamMemberPhotoParams } from "@workspace/api-zod";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `photo-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const router = Router();

function serializeMember(m: typeof teamMembersTable.$inferSelect, baseUrl: string) {
  return {
    id: m.id,
    name: m.name,
    rollNumber: m.rollNumber,
    initials: m.initials,
    description: m.description,
    photoUrl: m.photoUrl ? `${baseUrl}/api/team/photos/${path.basename(m.photoUrl)}` : null,
  };
}

const DEFAULT_MEMBERS = [
  { name: "Vakadani Koushik", rollNumber: "SE24UARI069", initials: "VK", description: "Research Lead & co-designer of the Belong app experience." },
  { name: "Katkuri Saathvik", rollNumber: "SE24UARI186", initials: "KS", description: "Led ideation and synthesis across all 10 problem statements." },
  { name: "Pati Gowri Karthikeya", rollNumber: "SE24UARI185", initials: "PGK", description: "Handled data analysis and root cause mapping for the team." },
  { name: "Chegondi Harshith", rollNumber: "SE24UARI007", initials: "CH", description: "Built journey maps and empathy frameworks for all personas." },
  { name: "Katta Joshita Sai", rollNumber: "SE24UARI067", initials: "KJS", description: "Designed and executed the survey instrument and consent workflow." },
  { name: "Duggi Gnana Sloka", rollNumber: "SE24UARI162", initials: "DGS", description: "Crafted the persona documents and empathy research artifacts." },
  { name: "Kanapareddy Mounish", rollNumber: "SE24UMCS097", initials: "KM", description: "Developed and refined the final Belong concept and presentation." },
];

async function seedIfEmpty() {
  const existing = await db.select().from(teamMembersTable).limit(1);
  if (existing.length === 0) {
    await db.insert(teamMembersTable).values(DEFAULT_MEMBERS);
  }
}

router.get("/team/photos/:filename", (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.sendFile(path.resolve(filePath));
});

router.get("/team", async (req, res) => {
  await seedIfEmpty();
  const members = await db.select().from(teamMembersTable).orderBy(teamMembersTable.id);
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json(members.map((m) => serializeMember(m, baseUrl)));
});

router.patch("/team/:id", async (req, res) => {
  const paramsResult = UpdateTeamMemberParams.safeParse({ id: Number(req.params.id) });
  if (!paramsResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyResult = UpdateTeamMemberBody.safeParse(req.body);
  if (!bodyResult.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const { description } = bodyResult.data;
  if (description === undefined) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }

  const [updated] = await db
    .update(teamMembersTable)
    .set({ description })
    .where(eq(teamMembersTable.id, paramsResult.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json(serializeMember(updated, baseUrl));
});

router.post("/team/:id/photo", uploadPhoto.single("photo"), async (req, res) => {
  const paramsResult = UploadTeamMemberPhotoParams.safeParse({ id: Number(req.params.id) });
  if (!paramsResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "No photo uploaded" });
    return;
  }

  const [existing] = await db
    .select()
    .from(teamMembersTable)
    .where(eq(teamMembersTable.id, paramsResult.data.id))
    .limit(1);

  if (!existing) {
    fs.unlinkSync(req.file.path);
    res.status(404).json({ error: "Team member not found" });
    return;
  }

  if (existing.photoUrl && fs.existsSync(existing.photoUrl)) {
    fs.unlinkSync(existing.photoUrl);
  }

  const [updated] = await db
    .update(teamMembersTable)
    .set({ photoUrl: req.file.path })
    .where(eq(teamMembersTable.id, paramsResult.data.id))
    .returning();

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json(serializeMember(updated, baseUrl));
});

export default router;

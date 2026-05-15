import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, X, Loader2, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTeamMembers,
  useUpdateTeamMember,
  useUploadTeamMemberPhoto,
  getListTeamMembersQueryKey,
} from "@workspace/api-client-react";

const STATIC_TEAM = [
  { id: 1, name: "Vakadani Koushik", rollNumber: "SE24UARI069", initials: "VK", description: "Research Lead & co-designer of the Belong app experience.", photoUrl: null as string | null },
  { id: 2, name: "Katkuri Saathvik", rollNumber: "SE24UARI186", initials: "KS", description: "Led ideation and synthesis across all 10 problem statements.", photoUrl: null as string | null },
  { id: 3, name: "Pati Gowri Karthikeya", rollNumber: "SE24UARI185", initials: "PGK", description: "Handled data analysis and root cause mapping for the team.", photoUrl: null as string | null },
  { id: 4, name: "Chegondi Harshith", rollNumber: "SE24UARI007", initials: "CH", description: "Built journey maps and empathy frameworks for all personas.", photoUrl: null as string | null },
  { id: 5, name: "Katta Joshita Sai", rollNumber: "SE24UARI067", initials: "KJS", description: "Designed and executed the survey instrument and consent workflow.", photoUrl: null as string | null },
  { id: 6, name: "Duggi Gnana Sloka", rollNumber: "SE24UARI162", initials: "DGS", description: "Crafted the persona documents and empathy research artifacts.", photoUrl: null as string | null },
  { id: 7, name: "Kanapareddy Mounish", rollNumber: "SE24UMCS097", initials: "KM", description: "Developed and refined the final Belong concept and presentation.", photoUrl: null as string | null },
];

const AVATAR_COLORS = [
  "bg-blue-700",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-sky-600",
  "bg-blue-500",
  "bg-cyan-700",
  "bg-indigo-700",
];

function MemberCard({
  member,
  colorClass,
}: {
  member: { id: number; name: string; rollNumber: string; initials: string; description: string; photoUrl?: string | null };
  colorClass: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(member.description);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateMutation = useUpdateTeamMember();
  const photoMutation = useUploadTeamMemberPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(member.photoUrl ?? null);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: member.id, data: { description: draft } });
      queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
      toast({ title: "Description saved" });
      setEditing(false);
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setDraft(member.description);
    setEditing(false);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      await photoMutation.mutateAsync({ id: member.id, data: { photo: file } });
      queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
      toast({ title: "Photo updated!" });
    } catch {
      setPreviewUrl(member.photoUrl ?? null);
      toast({ title: "Photo upload failed", variant: "destructive" });
    }
    e.target.value = "";
  };

  return (
    <Card className="hover:-translate-y-1 transition-transform duration-200 border-border hover:border-primary/30 hover:shadow-md">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="relative mb-4 group/avatar">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-border"
            />
          ) : (
            <div
              className={`w-20 h-20 rounded-full ${colorClass} text-white flex items-center justify-center text-xl font-bold shadow-sm`}
            >
              {member.initials}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={photoMutation.isPending}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            title="Upload photo"
          >
            {photoMutation.isPending ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <h3 className="font-bold text-foreground text-base leading-tight">{member.name}</h3>
        <p className="text-xs text-primary font-medium mt-1 mb-3">{member.rollNumber}</p>

        {editing ? (
          <div className="w-full space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="text-sm resize-none"
              rows={3}
            />
            <div className="flex gap-2 justify-center">
              <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3 mr-1" />
                )}
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full group relative">
            <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
              {member.description || "Click the edit button to add a description."}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Team() {
  const { data: rawMembers = [], isLoading } = useListTeamMembers();
  const members = rawMembers.length > 0 ? rawMembers : STATIC_TEAM;

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Meet the <span className="text-primary">Team</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Seven students who chose to listen before they designed. Hover any avatar to upload a photo.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
            >
              <MemberCard
                member={member}
                colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

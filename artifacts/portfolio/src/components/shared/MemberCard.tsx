import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateTeamMember, getListTeamMembersQueryKey } from "@workspace/api-client-react";

const AVATAR_COLORS = [
  "bg-blue-700",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-sky-600",
  "bg-blue-500",
  "bg-cyan-700",
  "bg-indigo-700",
];

export function MemberCard({
  member,
  index,
}: {
  member: { id: number; name: string; rollNumber: string; initials: string; description: string };
  index: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(member.description);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateMutation = useUpdateTeamMember();
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

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

  return (
    <Card className="hover:-translate-y-1 transition-transform duration-200 border-border hover:border-primary/30 hover:shadow-md">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 rounded-full ${colorClass} text-white flex items-center justify-center text-xl font-bold mb-4 shadow-sm`}
          data-testid={`avatar-${member.id}`}
        >
          {member.initials}
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
              data-testid={`textarea-description-${member.id}`}
            />
            <div className="flex gap-2 justify-center">
              <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} data-testid={`button-save-${member.id}`}>
                {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} data-testid={`button-cancel-${member.id}`}>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
              {member.description || "Click edit to add a description."}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              data-testid={`button-edit-${member.id}`}
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

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Users, Mic, ClipboardList, Lightbulb, Smartphone, ChevronDown, Sun, Shield, GraduationCap, Zap, Heart, Pencil, Check, X, Loader2, Camera } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useListTeamMembers, useUpdateTeamMember, useUploadTeamMemberPhoto, getListTeamMembersQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const STATIC_TEAM = [
  { id: 1, name: "Vakadani Koushik", rollNumber: "SE24UARI069", initials: "VK", description: "Research Lead & co-designer of the Belong app experience.", photoUrl: null as string | null },
  { id: 2, name: "Katkuri Saathvik", rollNumber: "SE24UARI186", initials: "KS", description: "Led ideation and synthesis across all 10 problem statements.", photoUrl: null as string | null },
  { id: 3, name: "Pati Gowri Karthikeya", rollNumber: "SE24UARI185", initials: "PGK", description: "Handled data analysis and root cause mapping for the team.", photoUrl: null as string | null },
  { id: 4, name: "Chegondi Harshith", rollNumber: "SE24UARI007", initials: "CH", description: "Built journey maps and empathy frameworks for all personas.", photoUrl: null as string | null },
  { id: 5, name: "Katta Joshita Sai", rollNumber: "SE24UARI067", initials: "KJS", description: "Designed and executed the survey instrument and consent workflow.", photoUrl: null as string | null },
  { id: 6, name: "Duggi Gnana Sloka", rollNumber: "SE24UARI162", initials: "DGS", description: "Crafted the persona documents and empathy research artifacts.", photoUrl: null as string | null },
  { id: 7, name: "Kanapareddy Mounish", rollNumber: "SE24UMCS097", initials: "KM", description: "Developed and refined the final Belong concept and presentation.", photoUrl: null as string | null },
];

/* ─── Phase data ─── */
const PHASES = [
  { number: 1, title: "We started with what we knew", narrative: "We were 19–20 year olds with a vague sense that something was off for teenagers today. We started with our own lived experience but quickly realised that wasn't enough to design for someone else. This phase was about acknowledging our biases before we could move past them." },
  { number: 2, title: "Listening before assuming", narrative: "Each of us interviewed 3 teenagers aged 15 and above using semi-structured guides and clinical batteries — 21 interviews in total. We wanted to hear their world in their own words before we projected ours onto it. The stories were richer and more heartbreaking than we expected." },
  { number: 3, title: "Giving faces to the data", narrative: "We built individual personas from each interview, then collapsed them into 3 composite personas representing community patterns rather than individual stories. These became our north stars for every subsequent decision." },
  { number: 4, title: "Walking in their shoes", narrative: "We mapped how each persona moves through their day emotionally — where they feel seen, where they feel invisible, and where the system quietly fails them. Empathy maps forced us to go beyond behaviour into feeling." },
  { number: 5, title: "Surveying at scale", narrative: "To validate what we were hearing, we ran a formal survey with proper consent and clinical batteries. 30+ responses later, the data pointed clearly at one root: loneliness and depression." },
  { number: 6, title: "Finding the root", narrative: "We built a root-cause analysis map going 5 levels deep from the central problem. This gave us 34 problem-framing questions, from which we selected the top 10 to take forward." },
  { number: 7, title: "1,470 ideas in one session", narrative: "Using a modified brainwriting method — 7 members, 3 ideas, 5-minute rounds — we generated 1,470 raw ideas across 10 problem statements. Every single idea was scored for viability, desirability, and feasibility." },
  { number: 8, title: "Plotting the best ideas", narrative: "We took the top 20 ideas across each scoring dimension and plotted them on a Viability vs Effort matrix to find what sat in the quick-win quadrant. This gave us a clear, data-backed shortlist." },
  { number: 9, title: "Three concepts, one direction", narrative: "We developed three concepts: Belong (teen wellbeing app), The Disconnect Club (phone-free school club), and PressPause (school stress dashboard). We chose to build Belong." },
  { number: 10, title: "Building Belong", narrative: "Belong is a mobile app for teenagers feeling disconnected. Morning mood check-in, peer circles, senior mentor tips, daily micro-challenges, and a warm counsellor bridge if you need one." },
];

/* ─── Belong features ─── */
const FEATURES = [
  { icon: Sun, title: "Morning check-in", description: "A 30-second mood log that shapes your entire day. Quick, non-intrusive, and surprisingly powerful." },
  { icon: Shield, title: "Peer circles", description: "Anonymous support groups matched by shared feeling. You are not alone — you just haven't found your people yet." },
  { icon: GraduationCap, title: "Senior mentor match", description: "Paired with someone who has been through it. Real guidance, real empathy, not a chatbot." },
  { icon: Zap, title: "Micro-challenges", description: "Small daily actions that build real connection. Because connection is a skill, not a gift." },
  { icon: Heart, title: "Counsellor bridge", description: "A warm, not cold, path to school support. No cold forms, no waiting rooms — just a gentle bridge." },
];

/* ─── Data stats ─── */
const STATS = [
  { end: 21, label: "teenagers interviewed", suffix: "" },
  { end: 30, label: "survey responses analysed", suffix: "+" },
  { end: 1470, label: "ideas generated and scored", suffix: "" },
  { end: 1, label: "root cause: loneliness", suffix: "" },
];

/* ─── Reflections ─── */
const QUOTES = [
  "Designing for someone else starts with listening to them, not theorising about them.",
  "1,470 ideas sounds like chaos. Structured chaos is how breakthroughs happen.",
  "The best solution wasn't the most complex one. It was the most human one.",
];

/* ─── Animated counter ─── */
function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Avatar colors ─── */
const AVATAR_COLORS = ["bg-blue-700", "bg-blue-600", "bg-indigo-600", "bg-sky-600", "bg-blue-500", "bg-cyan-700", "bg-indigo-700"];

/* ─── Inline member card ─── */
function MemberCard({ member, index }: { member: { id: number; name: string; rollNumber: string; initials: string; description: string; photoUrl?: string | null }; index: number }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(member.description);
  const [previewUrl, setPreviewUrl] = useState<string | null>(member.photoUrl ?? null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateMutation = useUpdateTeamMember();
  const photoMutation = useUploadTeamMemberPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: member.id, data: { description: draft } });
      queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
      toast({ title: "Description saved" });
      setEditing(false);
    } catch { toast({ title: "Failed to save", variant: "destructive" }); }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
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
            <img src={previewUrl} alt={member.name} className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-border" />
          ) : (
            <div className={`w-16 h-16 rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white flex items-center justify-center text-xl font-bold shadow-sm`}>
              {member.initials}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={photoMutation.isPending}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            title="Upload photo"
          >
            {photoMutation.isPending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
        <h3 className="font-bold text-foreground text-base leading-tight">{member.name}</h3>
        <p className="text-xs text-primary font-medium mt-1 mb-3">{member.rollNumber}</p>
        {editing ? (
          <div className="w-full space-y-2">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="text-sm resize-none" rows={3} />
            <div className="flex gap-2 justify-center">
              <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setDraft(member.description); setEditing(false); }}>
                <X className="w-3 h-3 mr-1" />Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">{member.description || "Click edit to add a description."}</p>
            <button onClick={() => setEditing(true)} className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Pencil className="w-3 h-3" />Edit
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Section wrapper with fade-in ─── */
function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`scroll-mt-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const { data: rawMembers = [], isLoading: membersLoading } = useListTeamMembers();
  const members = rawMembers.length > 0 ? rawMembers : STATIC_TEAM;

  return (
    <div className="relative">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 -right-40 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-secondary/60 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 py-24 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary font-medium text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Prototype Squad · A Design Thinking Case Study
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-foreground max-w-4xl leading-[1.1] mb-6">
            How seven students tried to fix <span className="text-primary">teenage loneliness</span>.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
            A semester-long design thinking journey by Prototype Squad.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Button size="lg" className="h-13 px-8 text-base rounded-full"
              onClick={() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" })}>
              See our journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <a href="https://my-belonging-space.lovable.app" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base rounded-full bg-white hover:bg-secondary">
                Try Belong
              </Button>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Users, label: "7 Team members" },
              { icon: Mic, label: "21 Interviews" },
              { icon: ClipboardList, label: "30+ Survey responses" },
              { icon: Lightbulb, label: "1,470 Ideas generated" },
              { icon: Smartphone, label: "1 Solution built" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-5 bg-card rounded-2xl shadow-sm border border-border">
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center mb-3 text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm text-foreground text-center">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── JOURNEY ── */}
      <Section id="journey" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Our <span className="text-primary">Journey</span></h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Ten phases from assumptions to answers. Hover any phase to preview it, click to expand.</p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-3">
              {PHASES.map((phase, idx) => (
                <motion.div key={phase.number} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: idx * 0.04 }} className="relative pl-20">
                  <div className="absolute left-4 top-5 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm z-10">
                    {phase.number}
                  </div>
                  <div
                    className="relative group"
                    onMouseEnter={() => setHoveredPhase(phase.number)}
                    onMouseLeave={() => setHoveredPhase(null)}
                  >
                    <button
                      onClick={() => setExpandedPhase(expandedPhase === phase.number ? null : phase.number)}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all text-left"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phase {phase.number}:</span>
                        <span className="font-semibold text-foreground">{phase.title}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-4 ${expandedPhase === phase.number ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {hoveredPhase === phase.number && expandedPhase !== phase.number && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-primary/20 rounded-xl px-5 py-4 shadow-lg">
                          <p className="text-sm text-muted-foreground leading-relaxed">{phase.narrative}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {expandedPhase === phase.number && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-5 py-5 mt-2 bg-secondary/30 rounded-xl border border-border/60">
                          <p className="text-sm text-muted-foreground leading-relaxed">{phase.narrative}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── BELONG ── */}
      <Section id="belong" className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Meet <span className="text-primary">Belong</span>.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">The app we built because the data told us to. For teenagers who feel disconnected — which is more of them than you think.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {FEATURES.map((feature, idx) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.07 }}>
                <Card className="h-full hover:-translate-y-1 transition-transform duration-200 border-border hover:border-primary/30 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Belong CTA + QR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 bg-primary/5 border border-primary/20 rounded-2xl p-8"
          >
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">Try Belong now</h3>
              <p className="text-muted-foreground mb-5 max-w-md">
                Our prototype is live. Open it on your phone or desktop and experience what we built for teenagers who feel disconnected.
              </p>
              <a
                href="https://my-belonging-space.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-belong-app"
              >
                <Button size="lg" className="rounded-full">
                  Open Belong <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-border">
                <img
                  src="/belong-qr.png"
                  alt="QR code to open Belong app"
                  className="w-36 h-36 object-contain"
                  data-testid="img-belong-qr"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">Scan to open on your phone</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── DATA ── */}
      <Section id="data" className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3 block">The Evidence</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">What the numbers told us.</h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto">The data wasn't just numbers. It was teenagers telling us — in aggregate — that they were hurting.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center bg-white/10 rounded-2xl p-6 border border-white/10">
                <span className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                  <Counter end={stat.end} suffix={stat.suffix} />
                </span>
                <span className="text-sm text-white/70 leading-snug">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── LEARNINGS ── */}
      <Section id="learnings" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Reflection</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">What we <span className="text-primary">learned</span>.</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Six months of work distilled into three truths we'll carry long after the semester ended.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUOTES.map((quote, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all">
                <span className="text-4xl text-primary/20 font-serif leading-none mb-4">"</span>
                <p className="text-base font-medium text-foreground leading-relaxed italic">"{quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── TEAM ── */}
      <Section id="team" className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">The People</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Meet the <span className="text-primary">Team</span>.</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Seven students who chose to listen before they designed. Click any description to edit it.</p>
          </div>
          {membersLoading ? (
            <div className="flex justify-center p-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {members.map((member, idx) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: idx * 0.06 }}>
                  <MemberCard member={member} index={idx} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ── FOOTER CTA ── */}
      <section className="py-16 bg-primary/5 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">Want to explore the files?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">All our research artifacts — interviews, personas, surveys, and more — are available for upload and download.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { href: "/interviews", label: "Interviews" },
              { href: "/personas", label: "Personas" },
              { href: "/surveys", label: "Surveys" },
              { href: "/ideation", label: "Ideation" },
              { href: "/resources", label: "All Resources" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button variant="outline" className="rounded-full" data-testid={`cta-link-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

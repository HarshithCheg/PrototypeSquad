import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mic, FileText, ClipboardList, Database, User, Map, PenTool, Star, Grid, Presentation, BookOpen } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

const RESOURCES = [
  { key: "interview-guide", label: "Interview Guide", icon: BookOpen, desc: "The semi-structured interview guide used for all 21 teenager interviews." },
  { key: "consent-form", label: "Consent Form", icon: ClipboardList, desc: "The consent documentation signed by all participants and guardians." },
  { key: "survey-questionnaire", label: "Survey Questionnaire", icon: FileText, desc: "The formal survey instrument with clinical battery questions." },
  { key: "survey-data", label: "Survey Response Data", icon: Database, desc: "Anonymised response data from 30+ survey participants." },
  { key: "persona-docs", label: "Persona Documents", icon: User, desc: "All 21 individual personas and 3 composite persona documents." },
  { key: "root-cause-map", label: "Root Cause Map", icon: Map, desc: "The 5-level root cause analysis map connecting loneliness to systemic failures." },
  { key: "brainwriting", label: "Brainwriting Sheets", icon: PenTool, desc: "Raw brainwriting output from our 1,470-idea ideation session." },
  { key: "scored-ideas", label: "Scored Ideas Dataset", icon: Star, desc: "All ideas scored by viability, desirability, and feasibility." },
  { key: "viability-matrix", label: "Viability Matrix", icon: Grid, desc: "The Viability vs Effort matrix identifying quick-win ideas." },
  { key: "concept-presentation", label: "Concept Presentation", icon: Presentation, desc: "Presentation of the three final concepts before Belong was chosen." },
  { key: "audio-recordings", label: "Audio Recordings", icon: Mic, desc: "Raw audio recordings from all 21 interview sessions." },
];

export default function Resources() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Resources &amp; <span className="text-primary">Downloads</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Everything we made, open to read. Upload files to share them publicly, or download what's already there.
        </p>
      </motion.div>

      <div className="space-y-3">
        {RESOURCES.map((res, idx) => (
          <motion.div
            key={res.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
          >
            <button
              onClick={() => setOpen(open === res.key ? null : res.key)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/30 transition-all text-left"
              data-testid={`resource-${res.key}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <res.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{res.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{res.desc}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-4 ${
                  open === res.key ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {open === res.key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-6 mt-2 bg-secondary/20 rounded-xl border border-border/60">
                    <FileUpload section={res.key} title={res.label} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

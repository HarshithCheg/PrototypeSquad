import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileQuestion, Database, BarChart2 } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

const SUBSECTIONS = [
  {
    key: "surveys-form",
    label: "Survey Form",
    icon: FileQuestion,
    description:
      "The formal survey instrument with consent documentation and clinical batteries used to collect responses.",
  },
  {
    key: "surveys-data",
    label: "Response Data",
    icon: Database,
    description:
      "Raw and processed response data from 30+ participants, including anonymised survey records.",
  },
  {
    key: "surveys-charts",
    label: "Charts & Analysis",
    icon: BarChart2,
    description:
      "Visualisations and key findings from the survey data, highlighting the root cause of loneliness and depression.",
  },
];

export default function Surveys() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 block">
          Phase 5
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Surveys
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          30+ responses with proper consent and clinical batteries. The data validated what we heard in interviews — loneliness is the root.
        </p>
      </motion.div>

      <div className="space-y-3">
        {SUBSECTIONS.map((sub, idx) => (
          <motion.div
            key={sub.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <button
              onClick={() => setOpen(open === sub.key ? null : sub.key)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/30 transition-all text-left"
              data-testid={`subsection-${sub.key}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <sub.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{sub.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-4 ${
                  open === sub.key ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {open === sub.key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-6 mt-2 bg-secondary/20 rounded-xl border border-border/60">
                    <FileUpload section={sub.key} title={sub.label} />
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

const PHASES = [
  {
    number: 1,
    title: "We started with what we knew",
    narrative:
      "We were 19–20 year olds with a vague sense that something was off for teenagers today. We started with our own lived experience but quickly realised that wasn't enough to design for someone else. This phase was about acknowledging our biases before we could move past them.",
    section: "phase-1-brief",
    uploadLabel: "Initial brief / problem framing document",
  },
  {
    number: 2,
    title: "Listening before assuming",
    narrative:
      "Each of us interviewed 3 teenagers aged 15 and above using semi-structured guides and clinical batteries — 21 interviews in total. We wanted to hear their world in their own words before we projected ours onto it. The stories were richer and more heartbreaking than we expected.",
    section: "phase-2-interviews",
    uploadLabel: "Interview guides, audio recordings, raw notes",
  },
  {
    number: 3,
    title: "Giving faces to the data",
    narrative:
      "We built individual personas from each interview, then collapsed them into 3 composite personas representing community patterns rather than individual stories. These became our north stars for every subsequent decision.",
    section: "phase-3-personas",
    uploadLabel: "Persona documents or images",
  },
  {
    number: 4,
    title: "Walking in their shoes",
    narrative:
      "We mapped how each persona moves through their day emotionally — where they feel seen, where they feel invisible, and where the system quietly fails them. Empathy maps forced us to go beyond behaviour into feeling.",
    section: "phase-4-journey-maps",
    uploadLabel: "Journey map / empathy map",
  },
  {
    number: 5,
    title: "Surveying at scale",
    narrative:
      "To validate what we were hearing, we ran a formal survey with proper consent and clinical batteries. 30+ responses later, the data pointed clearly at one root: loneliness and depression.",
    section: "phase-5-surveys",
    uploadLabel: "Survey form, consent document, response data, charts",
  },
  {
    number: 6,
    title: "Finding the root",
    narrative:
      "We built a root-cause analysis map going 5 levels deep from the central problem. This gave us 34 problem-framing questions, from which we selected the top 10 to take forward.",
    section: "phase-6-root-cause",
    uploadLabel: "Root cause map",
  },
  {
    number: 7,
    title: "1,470 ideas in one session",
    narrative:
      "Using a modified brainwriting method — 7 members, 3 ideas, 5-minute rounds — we generated 1,470 raw ideas across 10 problem statements. Every single idea was scored for viability, desirability, and feasibility.",
    section: "phase-7-brainwriting",
    uploadLabel: "Brainwriting sheets, scored ideas spreadsheet",
  },
  {
    number: 8,
    title: "Plotting the best ideas",
    narrative:
      "We took the top 20 ideas across each scoring dimension and plotted them on a Viability vs Effort matrix to find what sat in the quick-win quadrant. This gave us a clear, data-backed shortlist.",
    section: "phase-8-matrix",
    uploadLabel: "Matrix chart",
  },
  {
    number: 9,
    title: "Three concepts, one direction",
    narrative:
      "We developed three concepts: Belong (teen wellbeing app), The Disconnect Club (phone-free school club), and PressPause (school stress dashboard). We chose to build Belong.",
    section: "phase-9-concepts",
    uploadLabel: "Concept sketches, comparison doc",
  },
  {
    number: 10,
    title: "Building Belong",
    narrative:
      "Belong is a mobile app for teenagers feeling disconnected. Morning mood check-in, peer circles, senior mentor tips, daily micro-challenges, and a warm counsellor bridge if you need one.",
    section: "phase-10-belong",
    uploadLabel: "App mockups, demo video",
  },
];

export default function Journey() {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Our <span className="text-primary">Journey</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ten phases that took us from assumptions to answers. Hover over any phase to see what we did. Click to expand files.
        </p>
      </motion.div>

      <div className="relative">
        {/* Center line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {PHASES.map((phase, idx) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative pl-20"
            >
              {/* Phase dot */}
              <div className="absolute left-4 top-5 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm z-10">
                {phase.number}
              </div>

              {/* Phase row */}
              <div
                className="relative group"
                onMouseEnter={() => setHoveredPhase(phase.number)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                <button
                  onClick={() =>
                    setExpandedPhase(
                      expandedPhase === phase.number ? null : phase.number
                    )
                  }
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all text-left"
                  data-testid={`phase-${phase.number}-button`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Phase {phase.number}
                    </span>
                    <span className="font-semibold text-foreground">
                      {phase.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-4 ${
                      expandedPhase === phase.number ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredPhase === phase.number &&
                    expandedPhase !== phase.number && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-primary/20 rounded-xl px-5 py-4 shadow-lg"
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {phase.narrative}
                        </p>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedPhase === phase.number && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-5 mt-2 bg-secondary/20 rounded-xl border border-border/60">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {phase.narrative}
                      </p>
                      <FileUpload
                        section={phase.section}
                        title={phase.uploadLabel}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

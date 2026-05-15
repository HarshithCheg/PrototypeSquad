import { motion } from "framer-motion";
import { Sun, Shield, GraduationCap, Zap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/shared/FileUpload";

const FEATURES = [
  {
    icon: Sun,
    title: "Morning check-in",
    description:
      "A 30-second mood log that shapes your entire day. Quick, non-intrusive, and surprisingly powerful.",
  },
  {
    icon: Shield,
    title: "Peer circles",
    description:
      "Anonymous support groups matched by shared feeling. You are not alone — you just haven't found your people yet.",
  },
  {
    icon: GraduationCap,
    title: "Senior mentor match",
    description:
      "Paired with someone who has been through it. Real guidance, real empathy, not a chatbot.",
  },
  {
    icon: Zap,
    title: "Micro-challenges",
    description:
      "Small daily actions that build real connection. Because connection is a skill, not a gift.",
  },
  {
    icon: Heart,
    title: "Counsellor bridge",
    description:
      "A warm, not cold, path to school support. No cold forms, no waiting rooms — just a gentle bridge.",
  },
];

export default function Solution() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">
          Phase 10 — The Output
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
          Meet <span className="text-primary">Belong</span>.
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The app we built because the data told us to. For teenagers who feel disconnected — which is more of them than you think.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {FEATURES.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.07 }}
          >
            <Card className="h-full hover:-translate-y-1 transition-transform duration-200 border-border hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-secondary/30 rounded-2xl p-8 border border-border"
      >
        <h2 className="text-xl font-bold text-foreground mb-2">App Files</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upload mockups, wireframes, screenshots, or a demo video of Belong.
        </p>
        <FileUpload section="solution-belong" title="App Mockups & Demo" />
      </motion.div>
    </div>
  );
}

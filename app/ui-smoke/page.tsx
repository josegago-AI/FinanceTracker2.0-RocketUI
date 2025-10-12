import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { ResponsiveContainer } from "recharts";
import { useForm } from "react-hook-form";

export default function UiSmoke() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">UI Smoke</h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card text-card-foreground border border-border rounded-lg p-4"
      >
        <p>Animation, imports, and Tailwind all working.</p>
      </motion.div>
    </div>
  );
}

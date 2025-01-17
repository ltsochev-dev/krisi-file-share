"use client";

import { Shield, Clock, Lock, Code2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "Secure Upload",
    description:
      "Files are encrypted on your device before upload for maximum security.",
  },
  {
    icon: Lock,
    title: "Private Access",
    description:
      "No one else will be able to open and access the uploaded files. Guaranteed!",
  },
  {
    icon: Clock,
    title: "Automatic Deletion",
    description:
      "Files are automatically deleted after a set time, as specified by you.",
  },
  {
    icon: Code2,
    title: "Open Source",
    description:
      "The code is available for free and open source at GitHub. Click here to learn more!",
    url: "https://github.com/ltsochev-dev/krisi-file-share",
  },
] as const;

export default function Features() {
  const handleClick = (feature: (typeof features)[number]) => {
    if ("url" in feature) {
      window.open(feature.url, "_blank");
    }
  };

  return (
    <div className="py-12 md:py-18">
      <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={cn(
              `bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`,
              "url" in feature && "cursor-pointer"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            onClick={() => handleClick(feature)}
          >
            <feature.icon className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-center">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

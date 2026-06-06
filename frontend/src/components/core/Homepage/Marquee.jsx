import React from "react";
import {
  SiJavascript,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiTensorflow,
  SiDocker,
  SiRust,
//   SiAmazonaws,
  SiGraphql,
  SiKubernetes,
  SiGo,
  SiMongodb,
  SiPostgresql,
} from "react-icons/si";

const TECHS = [
  { Icon: SiJavascript, label: "JavaScript", color: "#F7DF1E" },
  { Icon: SiPython, label: "Python", color: "#3776AB" },
  { Icon: SiReact, label: "React", color: "#61DAFB" },
  { Icon: SiNodedotjs, label: "Node.js", color: "#339933" },
  { Icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { Icon: SiTensorflow, label: "TensorFlow", color: "#FF6F00" },
  { Icon: SiDocker, label: "Docker", color: "#2496ED" },
  { Icon: SiRust, label: "Rust", color: "#CE412B" },
  { Icon: SiDocker, label: "AWS", color: "#FF9900" },
  { Icon: SiGraphql, label: "GraphQL", color: "#E10098" },
  { Icon: SiKubernetes, label: "Kubernetes", color: "#326CE5" },
  { Icon: SiGo, label: "Go", color: "#00ACD7" },
  { Icon: SiMongodb, label: "MongoDB", color: "#47A248" },
  { Icon: SiPostgresql, label: "PostgreSQL", color: "#4169E1" },
];

export default function Marquee() {
  const doubled = [...TECHS, ...TECHS];

  return (
    <div
      className="
        overflow-hidden
        border-y
        border-gray-200
        bg-gray-50
        py-6
      "
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div className="flex w-max animate-marquee">
        {doubled.map(({ Icon, label, color }, i) => (
          <span
            key={i}
            className="
              group
              inline-flex
              items-center
              gap-2
              whitespace-nowrap
              border-r
              border-gray-200
              px-7
              text-[13px]
              font-semibold
              text-gray-500
              transition-colors
              duration-200
              hover:text-gray-900
            "
          >
            <Icon
              size={18}
              color={color}
              className="
                shrink-0
                transition-transform
                duration-200
                group-hover:scale-125
              "
            />
            <span>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
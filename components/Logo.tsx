interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className, size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? 18 : size === "lg" ? 28 : 22;
  const textClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <rect width="32" height="32" rx="6" fill="#0f172a" />
        <rect x="5"  y="17" width="6" height="10" rx="1.5" fill="#3b82f6" />
        <rect x="13" y="11" width="6" height="16" rx="1.5" fill="#3b82f6" />
        <rect x="21" y="5"  width="6" height="22" rx="1.5" fill="#06b6d4" />
      </svg>
      <span className={`font-bold tracking-tight leading-none ${textClass}`}>
        <span className="text-white">RankMy</span>
        <span style={{ color: "#06b6d4" }}>Salary</span>
      </span>
    </div>
  );
}

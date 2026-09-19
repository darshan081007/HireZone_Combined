const tones = {
  accent: "bg-[#9AD9B1]/30 text-[#176B3A] border border-[#9AD9B1]",
  success: "bg-[#2E8B57]/15 text-[#2E8B57] border border-[#2E8B57]/30",
  warning: "bg-amber-100 text-amber-800 border border-amber-200",
  danger: "bg-rose-100 text-rose-700 border border-rose-200",
  neutral: "bg-white text-[#24352A] border border-[#D5E8DA]",
};

const Badge = ({ children, tone = "neutral", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
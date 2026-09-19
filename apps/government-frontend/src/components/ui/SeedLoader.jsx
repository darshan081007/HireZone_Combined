import { useEffect, useState } from "react";

const SeedLoader = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearInterval(stageTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl bg-[#FFFFFF] border border-[#D5E8DA] p-8 shadow-xs">
      <div className="relative flex h-48 w-48 flex-col items-center justify-end">
        {/* Soil Base */}
        <div className="absolute bottom-6 h-3.5 w-36 rounded-full bg-[#7A5535]" />

        {/* Seed */}
        <div
          className={`absolute bottom-9 h-7 w-5 rounded-[60%] bg-[#7A5535] transition-all duration-300 ${
            stage >= 1
              ? "translate-y-2 scale-75 opacity-20"
              : "translate-y-0 scale-100 opacity-100"
          }`}
        />

        {/* Growing Stem */}
        <div
          className={`absolute bottom-8 w-2 origin-bottom rounded-full bg-[#176B3A] transition-all duration-500 ${
            stage === 1 ? "h-10" : stage >= 2 ? "h-20" : "h-0"
          }`}
        />

        {/* Left Leaf */}
        <div
          className={`absolute bottom-[84px] right-[82px] h-7 w-11 origin-bottom-right rounded-full rounded-br-none bg-[#9AD9B1] transition-all duration-400 ${
            stage >= 2
              ? "rotate-[-32deg] scale-100 opacity-100"
              : "rotate-0 scale-0 opacity-0"
          }`}
        />

        {/* Right Leaf */}
        <div
          className={`absolute bottom-[108px] left-[82px] h-7 w-11 origin-bottom-left rounded-full rounded-bl-none bg-[#2E8B57] transition-all duration-400 ${
            stage >= 3
              ? "rotate-[32deg] scale-100 opacity-100"
              : "rotate-0 scale-0 opacity-0"
          }`}
        />
      </div>

      <p className="mt-4 text-sm font-bold tracking-wide text-[#176B3A] animate-pulse">
        Growing workforce insights...
      </p>
    </div>
  );
};

export default SeedLoader;
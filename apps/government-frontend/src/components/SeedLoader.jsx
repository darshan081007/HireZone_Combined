import { useEffect, useState } from "react";

const SeedLoader = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((previousStage) => (previousStage + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[220px] items-center justify-center bg-[#F5F1E8]">
      <div className="relative flex h-48 w-48 flex-col items-center justify-end">
        {/* Soil */}
        <div className="absolute bottom-7 h-3 w-36 rounded-full bg-[#8B5E3C]" />

        {/* Seed */}
        <div
          className={`absolute bottom-10 h-7 w-5 rounded-[60%] bg-[#5B3A29] transition-all duration-300 ${
            stage >= 1
              ? "translate-y-3 scale-75 opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          }`}
        />

        {/* Stem */}
        <div
          className={`absolute bottom-9 w-2 origin-bottom rounded-full bg-[#3F7D3C] transition-all duration-300 ${
            stage >= 1 ? "h-20" : "h-0"
          }`}
        />

        {/* Left Leaf */}
        <div
          className={`absolute bottom-[88px] right-[82px] h-7 w-12 origin-bottom-right rounded-full rounded-br-none bg-[#5B9B4A] transition-all duration-300 ${
            stage >= 2
              ? "rotate-[-28deg] scale-100 opacity-100"
              : "rotate-0 scale-0 opacity-0"
          }`}
        />

        {/* Right Leaf */}
        <div
          className={`absolute bottom-[112px] left-[83px] h-7 w-12 origin-bottom-left rounded-full rounded-bl-none bg-[#78B159] transition-all duration-300 ${
            stage >= 3
              ? "rotate-[28deg] scale-100 opacity-100"
              : "rotate-0 scale-0 opacity-0"
          }`}
        />

        {/* Loading Text */}
        <p className="absolute -bottom-2 text-sm font-medium text-[#31572C]">
          Growing your page...
        </p>
      </div>
    </div>
  );
};

export default SeedLoader;
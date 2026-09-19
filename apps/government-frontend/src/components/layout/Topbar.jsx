import { Menu, Landmark } from "lucide-react";
import { NavLink } from "react-router-dom";

const Topbar = ({ onOpenMobile }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#D5E8DA] bg-white/90 backdrop-blur-md">
      <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          className="rounded-xl border border-[#D5E8DA] p-2 text-[#24352A] lg:hidden hover:bg-[#F3FBF5]"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#176B3A] text-white">
            <Landmark size={16} />
          </div>
          <span className="text-base font-extrabold text-[#176B3A]">GovConnect</span>
        </NavLink>

        {/* Header Title */}
        <div className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7A5535]">
            National Workforce Portal
          </p>
          <p className="text-sm font-extrabold text-[#176B3A]">
            Government Intelligence Dashboard
          </p>
        </div>

        {/* Top Right Live Badge & User Avatar */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[#D5E8DA] bg-[#F3FBF5] px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#2E8B57] animate-pulse" />
            <span className="text-xs font-semibold text-[#24352A]">
              Live Data Sync
            </span>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#176B3A] text-xs font-extrabold text-white shadow-xs">
            GR
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
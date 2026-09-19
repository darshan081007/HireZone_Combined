import { NavLink } from "react-router-dom";
import { Landmark, X, ChevronLeft, ChevronRight } from "lucide-react";
import { navigationGroups } from "../../config/navigation";

const NavItem = ({ item, isCompact, onNavigate }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      title={isCompact ? item.name : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
          isActive
            ? "bg-[#9AD9B1]/30 text-[#176B3A]"
            : "text-[#24352A] hover:bg-[#9AD9B1]/15 hover:text-[#15803D]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left bar indicator */}
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#176B3A]" />
          )}
          <Icon
            size={19}
            className={isActive ? "text-[#176B3A]" : "text-[#6B7280] group-hover:text-[#15803D]"}
          />
          {!isCompact && <span className="truncate">{item.name}</span>}
        </>
      )}
    </NavLink>
  );
};

const SidebarContent = ({ isCompact, onNavigate }) => (
  <div className="flex h-full flex-col">
    {/* Brand Header */}
    <div className="flex h-[72px] flex-none items-center gap-3 border-b border-[#D5E8DA] px-5">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#176B3A] text-white shadow-sm">
        <Landmark size={20} />
      </div>

      {!isCompact && (
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold leading-tight text-[#176B3A]">
            GovConnect
          </p>
          <p className="truncate text-xs font-medium text-[#6B7280]">
            Skill & Intelligence
          </p>
        </div>
      )}
    </div>

    {/* Navigation */}
    <nav className="thin-scroll flex-1 overflow-y-auto px-3 py-4">
      {navigationGroups.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          {!isCompact && (
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[#7A5535]">
              {group.label}
            </p>
          )}

          <div className="space-y-1">
            {group.items.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isCompact={isCompact}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>

    {/* User footer */}
    <div className="flex-none border-t border-[#D5E8DA] p-3">
      <div className="flex items-center gap-3 rounded-xl bg-[#F3FBF5] px-3 py-2.5 border border-[#D5E8DA]">
        <span className="h-2.5 w-2.5 flex-none rounded-full bg-[#2E8B57] animate-pulse" />
        {!isCompact && (
          <p className="truncate text-xs font-semibold text-[#24352A]">
            Gov Representative
          </p>
        )}
      </div>
    </div>
  </div>
);

const Sidebar = ({ mobileOpen, onCloseMobile, isCompact, onToggleCompact }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden border-r border-[#D5E8DA] bg-white transition-all duration-300 lg:block ${
          isCompact ? "w-[76px]" : "w-[264px]"
        }`}
      >
        <div
          className={`fixed h-screen border-r border-[#D5E8DA] bg-white transition-all duration-300 ${
            isCompact ? "w-[76px]" : "w-[264px]"
          }`}
        >
          <SidebarContent isCompact={isCompact} />

          {/* Desktop compact toggle button */}
          <button
            onClick={onToggleCompact}
            className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#D5E8DA] bg-white text-[#176B3A] shadow-md hover:bg-[#F3FBF5]"
          >
            {isCompact ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-[#24352A]/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />

          <div className="relative z-10 flex h-full w-[280px] max-w-[82vw] animate-pageSlideFade flex-col bg-white shadow-2xl">
            <button
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="absolute right-3 top-4 z-10 rounded-lg p-2 text-[#6B7280] hover:bg-[#F3FBF5]"
            >
              <X size={18} />
            </button>

            <SidebarContent isCompact={false} onNavigate={onCloseMobile} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
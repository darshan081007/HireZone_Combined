import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ScrollToTop from "../ui/ScrollToTop";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3FBF5] text-[#24352A]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <Sidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          isCompact={isCompact}
          onToggleCompact={() => setIsCompact(!isCompact)}
        />

        <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
          <Topbar onOpenMobile={() => setMobileOpen(true)} />

          <main className="page-transition w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default DashboardLayout;
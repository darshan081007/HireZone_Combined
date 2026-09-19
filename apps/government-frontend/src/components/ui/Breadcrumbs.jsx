import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { flatNavigation } from "../../config/navigation";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) return null;

  const currentNavItem = flatNavigation.find((item) => item.path === location.pathname);

  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#176B3A] transition-colors"
      >
        <Home size={13} />
        <span>Dashboard</span>
      </Link>

      <ChevronRight size={13} className="text-[#6B7280]/60" />

      {pathSegments.length > 1 && (
        <>
          <span className="capitalize text-[#6B7280]">
            {pathSegments[0].replace("-", " ")}
          </span>
          <ChevronRight size={13} className="text-[#6B7280]/60" />
        </>
      )}

      <span className="font-semibold text-[#176B3A]">
        {currentNavItem?.name || pathSegments[pathSegments.length - 1].replace("-", " ")}
      </span>
    </nav>
  );
};

export default Breadcrumbs;
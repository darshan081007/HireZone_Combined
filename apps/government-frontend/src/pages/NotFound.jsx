import { ArrowLeft, MapPinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <section className="surface-card flex flex-col items-center gap-4 rounded-2xl border border-[#D5E8DA] bg-white px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#9AD9B1]/30 text-[#176B3A]">
          <MapPinOff size={30} />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[#7A5535]">
          Error 404
        </p>

        <h1 className="text-2xl font-extrabold text-[#176B3A] sm:text-3xl">
          Page not found
        </h1>

        <p className="max-w-md text-xs leading-5 text-[#6B7280]">
          The requested path does not exist on this portal. Use the navigation sidebar or return to the main dashboard.
        </p>

        <Button icon={ArrowLeft} onClick={() => navigate("/")} className="mt-2">
          Back to Dashboard
        </Button>
      </section>
    </DashboardLayout>
  );
}

export default NotFound;
import { ArrowLeft, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

function PlaceholderPage({ title, description }) {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Government Intelligence Portal"
        title={title}
        description={description}
      />

      <section className="card-hover-elevation surface-card flex flex-col items-start gap-5 rounded-2xl border border-[#D5E8DA] bg-white p-8 sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9AD9B1]/30 text-[#176B3A]">
          <Wrench size={26} />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge tone="accent">Ready for live data integration</Badge>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-[#6B7280]">
            This module UI is styled according to national government portal specifications. Live metrics will automatically populate upon backend API endpoint connection.
          </p>
        </div>

        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate("/")}>
          Return to Dashboard
        </Button>
      </section>
    </DashboardLayout>
  );
}

export default PlaceholderPage;
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="group inline-flex items-center gap-1.5 rounded-xl border border-[#D5E8DA] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#24352A] shadow-xs transition-all hover:bg-[#9AD9B1]/20 hover:text-[#176B3A] active:scale-95"
    >
      <ArrowLeft
        size={14}
        className="transition-transform group-hover:-translate-x-1 text-[#176B3A]"
      />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
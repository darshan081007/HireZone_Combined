const variants = {
  primary:
    "bg-[#176B3A] text-white hover:bg-[#15803D] hover:-translate-y-0.5 shadow-sm active:scale-98",
  secondary:
    "border border-[#D5E8DA] bg-white text-[#24352A] hover:bg-[#9AD9B1]/20 hover:border-[#176B3A] hover:-translate-y-0.5 active:scale-98",
  ghost: "text-[#24352A] hover:bg-[#9AD9B1]/20 hover:text-[#176B3A] active:scale-98",
};

const Button = ({
  children,
  icon: Icon,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#176B3A] focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;
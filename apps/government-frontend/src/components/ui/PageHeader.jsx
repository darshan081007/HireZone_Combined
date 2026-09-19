import BackButton from "./BackButton";
import Breadcrumbs from "./Breadcrumbs";

const PageHeader = ({ eyebrow, title, description, actions, icon: Icon, showBack = true }) => {
  return (
    <div className="sticky top-[72px] z-20 mb-6 border-b border-[#D5E8DA] bg-[#F3FBF5]/95 px-2 py-4 backdrop-blur-md transition-all">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBack && <BackButton />}
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex items-start gap-3.5">
          {Icon && (
            <div className="hidden h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A] sm:flex border border-[#D5E8DA]">
              <Icon size={22} />
            </div>
          )}

          <div>
            {eyebrow && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#7A5535]">
                {eyebrow}
              </p>
            )}

            <h1 className="text-2xl font-extrabold tracking-tight text-[#176B3A] sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="mt-1 max-w-2xl text-sm leading-5 text-[#6B7280]">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex w-fit flex-none items-center gap-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
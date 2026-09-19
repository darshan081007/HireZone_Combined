import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import SeedLoader from "../SeedLoader";

export const LoadingState = () => <SeedLoader />;

export const CardSkeleton = () => (
  <div className="surface-card rounded-2xl border border-[#D5E8DA] bg-white p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-3 w-3/4">
        <div className="h-4 w-1/3 skeleton-shimmer rounded-md" />
        <div className="h-8 w-1/2 skeleton-shimmer rounded-md" />
        <div className="h-3 w-2/3 skeleton-shimmer rounded-md" />
      </div>
      <div className="h-11 w-11 skeleton-shimmer rounded-xl" />
    </div>
  </div>
);

export const ErrorState = ({
  message = "Something went wrong while loading this data.",
  onRetry,
}) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
    <AlertCircle className="h-7 w-7 text-rose-600" />
    <p className="text-sm font-medium text-rose-800">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-2 rounded-xl bg-[#176B3A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D] active:scale-98"
      >
        <RefreshCw size={15} />
        Try again
      </button>
    )}
  </div>
);

export const EmptyState = ({
  title = "No data available",
  description = "There's nothing to show here yet.",
  icon: Icon = Inbox,
}) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#D5E8DA] bg-white/50 px-6 py-14 text-center">
    <Icon className="h-8 w-8 text-[#6B7280]" />
    <p className="text-sm font-semibold text-[#24352A]">{title}</p>
    <p className="max-w-sm text-sm text-[#6B7280]">{description}</p>
  </div>
);
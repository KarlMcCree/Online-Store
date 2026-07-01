import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  label?: string;
  fullScreen?: boolean;
};

const LoadingSpinner = ({ className, size = 24, label, fullScreen }: Props) => {
  const spinner = (
    <div className={cn("flex items-center justify-center gap-3 text-muted-foreground", className)}>
      <Loader2 className="animate-spin text-secondary" style={{ width: size, height: size }} />
      {label && <span className="text-sm font-body">{label}</span>}
    </div>
  );
  if (fullScreen) {
    return <div className="flex min-h-[40vh] items-center justify-center">{spinner}</div>;
  }
  return spinner;
};

export default LoadingSpinner;

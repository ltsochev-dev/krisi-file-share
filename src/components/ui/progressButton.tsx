import * as React from "react";
import { Button, ButtonProps } from "./button";
import { cn, clamp } from "@/lib/utils";

export interface ProgressButtonProps extends ButtonProps {
  progress?: number;
}

const ProgressButton = React.forwardRef<HTMLButtonElement, ProgressButtonProps>(
  ({ progress, className, children, ...props }, ref) => {
    const percent = clamp(progress ?? 0, 0, 100);
    const isRunning = percent > 0;
    const isComplete = percent >= 100;

    return (
      <Button
        ref={ref}
        {...props}
        className={cn(className, "relative overflow-hidden")}
      >
        {
          <div
            className={cn(
              `absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-in-out opacity-85 pointer-events-none`,
              isRunning && !isComplete ? "visible" : "invisible"
            )}
            style={{ width: `${percent}%` }}
          />
        }
        <span className="inline-flex z-10">{children}</span>
      </Button>
    );
  }
);

ProgressButton.displayName = "ProgressButton";

export { ProgressButton };

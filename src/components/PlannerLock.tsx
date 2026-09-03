import type { ReactNode } from "react";

interface PlannerLockProps {
  locked: boolean;
  children: ReactNode;
  hint?: string;
}

export function PlannerLock({ locked, children, hint }: PlannerLockProps) {
  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none opacity-45 saturate-50"
      >
        {children}
      </div>
      {hint ? (
        <p className="mt-2 text-center text-xs font-medium text-emerald-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

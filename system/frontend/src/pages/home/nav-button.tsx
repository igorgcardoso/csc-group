import { ComponentProps } from "react";

export function NavButton({ ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="flex w-80 items-center justify-center gap-2 rounded bg-emerald-500 px-5 py-3 font-semibold uppercase transition-opacity hover:bg-opacity-70 disabled:cursor-not-allowed disabled:bg-muted"
    />
  );
}

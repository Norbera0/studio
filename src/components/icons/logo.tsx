import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-primary", props.className)}
      {...props}
    >
      <path d="M9.34 4.24a2.5 2.5 0 0 1 4.32 1.46l.29 2.14a2.5 2.5 0 0 0 4.86.69L19.5 4.5" />
      <path d="M11.25 14.58a2.5 2.5 0 0 0 4.33 1.44l.89-1.25a2.5 2.5 0 0 1 4.33 1.44l-1.42 2.01a2.5 2.5 0 0 1-4.14.28l-.29-2.14" />
      <path d="M4.5 4.5l.71 4.14a2.5 2.5 0 0 0 4.86.69l.29-2.14a2.5 2.5 0 0 1 4.32-1.46" />
      <path d="M12.75 14.58a2.5 2.5 0 0 1-4.33 1.44l-.89-1.25a2.5 2.5 0 0 0-4.33 1.44l1.42 2.01a2.5 2.5 0 0 0 4.14.28l.29-2.14" />
      <path d="m18.5 4.5-.71 4.14a2.5 2.5 0 0 1-4.86.69l-.29-2.14" />
      <path d="m5.5 4.5 1.42 2.01a2.5 2.5 0 0 0 4.14.28l.29-2.14" />
      <path d="m14.21 16.02-1.12 1.57a2.5 2.5 0 0 1-4.14.28l-1.42-2.01" />
    </svg>
  );
}

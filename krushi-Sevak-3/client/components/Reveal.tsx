import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps<T extends keyof JSX.IntrinsicElements = "div"> = {
  as?: T;
  className?: string;
  children: ReactNode;
  delay?: number;
  once?: boolean;
} & Omit<JSX.IntrinsicElements[T], "ref" | "className" | "children">;

export function Reveal<T extends keyof JSX.IntrinsicElements = "div">({
  as,
  className,
  children,
  delay = 0,
  once = true,
  ...rest
}: RevealProps<T>) {
  const Component = (as || "div") as keyof JSX.IntrinsicElements;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Component
      ref={ref as never}
      className={cn(
        "transition-all duration-700 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10",
        className,
      )}
      style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
      {...(rest as object)}
    >
      {children}
    </Component>
  );
}

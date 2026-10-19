"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Navigate = (href: string) => void;

const TransitionContext = createContext<Navigate | null>(null);

interface PageTransitionsProps {
  children: ReactNode;
}

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

interface PendingNavigation {
  pathname: string;
  finish: () => void;
}

export function PageTransitions({ children }: PageTransitionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pendingNavigation = useRef<PendingNavigation | null>(null);

  useEffect(() => {
    if (pendingNavigation.current?.pathname === pathname) {
      pendingNavigation.current.finish();
    }
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) {
        window.location.assign(target.href);
        return;
      }

      if (target.pathname === pathname) return;
      if (pendingNavigation.current) return;

      if (typeof document.startViewTransition !== "function") {
        router.push(target.pathname + target.search + target.hash);
        return;
      }

      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const timeout = window.setTimeout(() => {
              pendingNavigation.current = null;
              resolve();
            }, 5000);

            pendingNavigation.current = {
              pathname: target.pathname,
              finish: () => {
                window.clearTimeout(timeout);
                pendingNavigation.current = null;
                resolve();
              },
            };
            router.push(target.pathname + target.search + target.hash);
          }),
      );
    },
    [pathname, router],
  );

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
    </TransitionContext.Provider>
  );
}

export function TransitionLink({
  href,
  onClick,
  target,
  ...props
}: TransitionLinkProps) {
  const navigate = useContext(TransitionContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target ||
      !navigate
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  return <a href={href} target={target} onClick={handleClick} {...props} />;
}

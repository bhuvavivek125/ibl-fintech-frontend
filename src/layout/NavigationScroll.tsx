import { useEffect, ReactElement } from 'react';

export default function NavigationScroll({ children }: { children: ReactElement | null }) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  return children || null;
}

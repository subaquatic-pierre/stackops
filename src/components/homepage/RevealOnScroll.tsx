import { useEffect } from "react";

/**
 * Watches for elements with the `.reveal` class and adds `.visible` when they
 * enter the viewport (IntersectionObserver). Renders nothing — purely side-effect.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );
    revealEls.forEach((el) => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);
  return null;
}

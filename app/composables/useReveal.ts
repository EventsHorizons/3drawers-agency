import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useReveal(selector = "[data-reveal]") {
  onMounted(async () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    await nextTick();
    const els = gsap.utils.toArray<HTMLElement>(selector);
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });
  });

  onBeforeUnmount(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });
}

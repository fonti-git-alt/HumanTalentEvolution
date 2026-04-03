// GSAP + Lenis animations setup
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export interface LenisInstance {
  lenis: Lenis;
  destroy: () => void;
}

export function initSmoothScroll(): LenisInstance {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Add GSAP ticker for smooth animation loop
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });

  // Prevent lagSmoothing for consistent behavior
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy: () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    },
  };
}

// Fade in animation on scroll
export function fadeInOnScroll(
  elements: Element | Element[] | NodeListOf<Element>,
  options: {
    y?: number;
    duration?: number;
    delay?: number;
    start?: string;
  } = {}
): void {
  const { y = 50, duration = 0.8, delay = 0, start = 'top 85%' } = options;

  gsap.from(elements, {
    opacity: 0,
    y,
    duration,
    delay,
    ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: elements instanceof NodeList || Array.isArray(elements) ? elements[0] : elements,
      start,
      toggleActions: 'play none none reverse',
    },
  });
}

// Parallax effect
export function createParallax(
  element: Element,
  options: {
    speed?: number;
    start?: string;
    end?: string;
  } = {}
): void {
  const { speed = 0.5, start = 'top bottom', end = 'bottom top' } = options;

  gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: true,
    },
  });
}

// Hero text animation
export function animateHeroText(elements: Element[]): void {
  gsap.from(elements, {
    opacity: 0,
    y: 60,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.3,
  });
}

// Counter animation
export function animateCounter(element: Element, target: number, options: { suffix?: string } = {}): void {
  const { suffix = '' } = options;
  
  gsap.from(element, {
    textContent: 0,
    duration: 2,
    ease: 'power2.out',
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    onUpdate: function() {
      element.textContent = Math.round(gsap.getProperty(element, 'textContent') as number) + suffix;
    },
  });
}

// Magnetic button effect
export function addMagneticEffect(element: HTMLElement, strength: number = 0.3): void {
  element.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  });
}

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

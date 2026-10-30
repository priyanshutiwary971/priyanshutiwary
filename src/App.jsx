import { useEffect } from 'react';
import { siteMarkup } from './site-markup.js';

/** React Bits inspired soft aurora ambient layer tuned to the ivory/blue reference. */
function AuroraBackground() {
  return <div className="aurora-background" aria-hidden="true"><span /><span /><span /></div>;
}

/** React Bits style viewport reveal for content that should arrive quietly. */
function FadeContent() {
  useEffect(() => {
    const targets = document.querySelectorAll('.section-heading, .service-row, .about-copy, .contact-section > *');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    targets.forEach((target) => {
      target.classList.add('reveal-on-scroll');
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);
  return null;
}

/** React Bits style spotlight interaction for project cards and magnetic CTAs. */
function PointerEffects() {
  useEffect(() => {
    const onPointerMove = (event) => {
      const card = event.target.closest('.project-visual');
      if (card) {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      }
      const link = event.target.closest('.button-dark, .header-cta');
      if (link && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const bounds = link.getBoundingClientRect();
        link.style.setProperty('--magnet-x', `${(event.clientX - bounds.left - bounds.width / 2) * 0.08}px`);
        link.style.setProperty('--magnet-y', `${(event.clientY - bounds.top - bounds.height / 2) * 0.12}px`);
      }
    };
    const resetMagnet = (event) => {
      const link = event.target.closest('.button-dark, .header-cta');
      if (link) { link.style.setProperty('--magnet-x', '0px'); link.style.setProperty('--magnet-y', '0px'); }
    };
    const onClick = (event) => {
      const button = event.target.closest('.menu-toggle');
      if (!button) return;
      const nav = document.querySelector('#primary-nav');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      button.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav?.classList.toggle('is-open', !isOpen);
    };
    const onNavClick = (event) => {
      if (!event.target.closest('#primary-nav a')) return;
      document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      document.querySelector('.menu-toggle')?.setAttribute('aria-label', 'Open navigation');
      document.querySelector('#primary-nav')?.classList.remove('is-open');
    };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerout', resetMagnet);
    document.addEventListener('click', onClick);
    document.addEventListener('click', onNavClick);
    document.querySelectorAll('.project-visual').forEach((card) => card.classList.add('spotlight-card'));
    const year = document.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerout', resetMagnet);
      document.removeEventListener('click', onClick);
      document.removeEventListener('click', onNavClick);
    };
  }, []);
  return null;
}

function PortfolioContent() {
  return <div className="portfolio-content" dangerouslySetInnerHTML={{ __html: siteMarkup }} />;
}

export default function App() {
  return <><AuroraBackground /><FadeContent /><PointerEffects /><PortfolioContent /></>;
}

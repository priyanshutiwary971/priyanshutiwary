import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCalApi } from '@calcom/embed-react';
import { siteMarkup } from './site-markup.js';
import LiquidChrome from './LiquidChrome.jsx';
import CardNav from './CardNav.jsx';

const navItems = [
  { label: 'Selected work', description: 'A selection of short-form, long-form and music video edits.', bgColor: '#27241f', textColor: '#f6f0e6', links: [{ label: 'Explore the portfolio', href: '#work' }] },
  { label: 'Services', description: 'Editing shaped around the story, the platform and the beat.', bgColor: '#302920', textColor: '#f6f0e6', links: [{ label: 'View services', href: '#services' }] },
  { label: 'About', description: 'Four years of thoughtful cuts and visual storytelling.', bgColor: '#24272b', textColor: '#f6f0e6', links: [{ label: 'Meet Priyanshu', href: '#about' }] },
  { label: 'Contact', description: 'Have a project in mind? Let’s talk about it.', bgColor: '#292923', textColor: '#f6f0e6', links: [{ label: 'Get in touch', href: '#contact' }] }
];
const calLink = 'priyanshu-kumar-wgwdko/15min';
const calConfig = JSON.stringify({ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' });

function CalEmbedSetup() {
  useEffect(() => {
    let active = true;
    (async () => {
      const cal = await getCalApi({ namespace: '15min' });
      if (active) cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
    return () => { active = false; };
  }, []);
  return null;
}

function CardNavMount() {
  const [mount, setMount] = useState(null);
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    setMount(document.getElementById('card-nav-root'));
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    document.addEventListener('themechange', syncTheme);
    return () => document.removeEventListener('themechange', syncTheme);
  }, []);
  if (!mount) return null;
  return createPortal(<CardNav logo="PT — PRIYANSHU TIWARY" logoAlt="Priyanshu Tiwary home" logoHref="#top" items={navItems} cta={{ label: 'Book a Meeting', href: `https://cal.com/${calLink}`, target: '_blank', rel: 'noreferrer', calNamespace: '15min', calLink, calConfig }} theme={theme} surface="glass" openOn="click" cardEffect="rise" accentColor="#c59d6a" cardHeight={164} maxWidth={860} intro speed={1.1} ariaLabel="Main navigation" />, mount);
}

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
      const themeButton = event.target.closest('.theme-toggle');
      if (themeButton) {
        const light = document.documentElement.dataset.theme !== 'light';
        document.documentElement.style.setProperty('--theme-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--theme-y', `${event.clientY}px`);
        const apply = () => {
          document.documentElement.dataset.theme = light ? 'light' : 'dark';
          document.dispatchEvent(new Event('themechange'));
          themeButton.setAttribute('aria-pressed', String(light));
          themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
          themeButton.querySelector('.theme-label').textContent = light ? 'Dark mode' : 'Light mode';
        };
        if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply);
        else apply();
        return;
      }
      return;
    };
    const onNavClick = (event) => {
      if (!event.target.closest('.card-nav a')) return;
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

function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1050);
    return () => window.clearTimeout(timer);
  }, []);
  return visible ? <div className="intro-overlay" aria-label="Priyanshu Tiwary"><div className="intro-overlay-inner"><img src="/priyanshu-profile.jpg" alt="" /><p>Priyanshu <em>Tiwary</em></p><span className="intro-rule" /></div></div> : null;
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  return <aside className="music-player" aria-label="Music player demo"><button type="button" className="music-toggle" aria-label={playing ? 'Pause demo music' : 'Play demo music'} onClick={() => setPlaying((value) => !value)}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button><div className="music-info"><strong>{playing ? 'Demo track' : 'Your soundtrack'}</strong><span>{playing ? 'Preview mode · MP3 coming soon' : 'Track coming soon'}</span></div><span className={`music-eq ${playing ? 'is-playing' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span></aside>;
}

export default function App() {
  useEffect(() => { document.documentElement.dataset.theme = 'dark'; }, []);
  return <><div className="liquid-background" aria-hidden="true"><LiquidChrome color="#003fa5" speed={0.2} amplitude={0.3} frequencyX={3} frequencyY={3} detail={4} thickness={1} depth={1} roughness={0.3} exposure={1} interactive rippleStrength={1} rippleSize={1} tilt={1} intro lightMode={false} maxDevicePixelRatio={1.5} /></div><FadeContent /><PointerEffects /><PortfolioContent /><CardNavMount /><CalEmbedSetup /><IntroOverlay /><MusicPlayer /></>;
}

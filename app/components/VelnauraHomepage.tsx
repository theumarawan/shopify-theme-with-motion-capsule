import {useEffect, useRef, useState, type PointerEvent} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';

const navigation = ['Shop', 'Philosophy', 'Ritual', 'Journal', 'About'];
const menuNavigation = ['Philosophy', 'Ritual', 'Journal', 'FAQs', 'About', 'Contact'];
const expressions = ['Genetics.', 'Potential.', 'Limits.', 'Expectations.', 'the Baseline.', 'Ordinary.', 'Hype.', 'Yesterday.'] as const;
const proofWords = ['Evidence-led skincare', 'for those who push beyond', 'what genetics alone offers.'] as const;

export type StorefrontProduct = {id: string; title: string; handle: string; description: string; image: {url: string; altText?: string | null}; variant: {id: string; availableForSale: boolean; price: {amount: string; currencyCode: string}}};
type Countdown = {hours: string; minutes: string; seconds: string};
type Props = {product: StorefrontProduct; mode: 'shopify' | 'demo'};

function getCountdown(): Countdown {
  const now = new Date(); const end = new Date(now); end.setHours(23, 59, 59, 999);
  const total = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  return {hours: String(Math.floor(total / 3600)).padStart(2, '0'), minutes: String(Math.floor((total % 3600) / 60)).padStart(2, '0'), seconds: String(total % 60).padStart(2, '0')};
}

const money = (price: StorefrontProduct['variant']['price']) => new Intl.NumberFormat(undefined, {style: 'currency', currency: price.currencyCode}).format(Number(price.amount));
const displayPrice = (price: StorefrontProduct['variant']['price']) => price.currencyCode === 'PKR' ? `Rs ${Math.round(Number(price.amount)).toLocaleString('en-PK')}` : money(price);
const cleanseValue = (price: StorefrontProduct['variant']['price']) => {
  const amount = Number(price.amount);
  const format = (value: number) => price.currencyCode === 'PKR' ? `Rs ${Math.round(value)}` : new Intl.NumberFormat(undefined, {style: 'currency', currency: price.currencyCode, maximumFractionDigits: 0}).format(value);
  return format(amount / 112.5);
};

export function VelnauraHomepage({product, mode}: Props) {
  const [countdown, setCountdown] = useState<Countdown>({hours: '--', minutes: '--', seconds: '--'});
  const [showSeconds, setShowSeconds] = useState(true);
  const [expressionIndex, setExpressionIndex] = useState(0);
  const [expressionVisible, setExpressionVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [navElevated, setNavElevated] = useState(false);
  const [activeProof, setActiveProof] = useState(0);
  const [newsletterMode, setNewsletterMode] = useState<'phone' | 'email'>('phone');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const menuRef = useRef<HTMLElement>(null); const menuButtonRef = useRef<HTMLButtonElement>(null); const proofRef = useRef<HTMLElement>(null);
  const secondsTimeout = useRef<number | null>(null); const expressionTimeout = useRef<number | null>(null); const lastScrollY = useRef(0);

  useEffect(() => {const update = () => setCountdown(getCountdown()); update(); const interval = window.setInterval(update, 1000); return () => window.clearInterval(interval);}, []);
  useEffect(() => {
    const reveal = () => {setShowSeconds(true); if (secondsTimeout.current) window.clearTimeout(secondsTimeout.current); secondsTimeout.current = window.setTimeout(() => setShowSeconds(false), 3600);};
    reveal(); const scroll = () => {if (window.scrollY < lastScrollY.current - 4) reveal(); lastScrollY.current = window.scrollY;};
    window.addEventListener('scroll', scroll, {passive: true}); return () => {window.removeEventListener('scroll', scroll); if (secondsTimeout.current) window.clearTimeout(secondsTimeout.current);};
  }, []);
  useEffect(() => {
    let previousY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const currentY = window.scrollY;
      const delta = currentY - previousY;
      if (currentY < 18) {setNavVisible(true); setNavElevated(false);}
      else if (delta > 10) {setNavElevated(true); setNavVisible(false);}
      else if (delta < -10) {setNavVisible(true); setNavElevated(true);}
      previousY = currentY;
    };
    const scroll = () => {if (!ticking) {ticking = true; requestAnimationFrame(update);}};
    window.addEventListener('scroll', scroll, {passive: true});
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {setExpressionVisible(false); expressionTimeout.current = window.setTimeout(() => {setExpressionIndex((i) => (i + 1) % expressions.length); setExpressionVisible(true);}, 360);}, 5200);
    return () => {window.clearInterval(interval); if (expressionTimeout.current) window.clearTimeout(expressionTimeout.current);};
  }, []);
  useEffect(() => {
    const section = proofRef.current; if (!section) return; let frame = 0;
    const update = () => {frame = 0; const bounds = section.getBoundingClientRect(); const progress = Math.min(.999, Math.max(0, (window.innerHeight * .8 - bounds.top) / (bounds.height * .6))); setActiveProof(Math.min(2, Math.floor(progress * 3)));};
    const scroll = () => {if (!frame) frame = requestAnimationFrame(update);}; update(); window.addEventListener('scroll', scroll, {passive: true}); window.addEventListener('resize', scroll);
    return () => {window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); if (frame) cancelAnimationFrame(frame);};
  }, []);
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return; const drawer = menuRef.current; const overflow = document.body.style.overflow; const trigger = menuButtonRef.current; const focusable = Array.from(drawer.querySelectorAll<HTMLElement>('a, button'));
    document.body.style.overflow = 'hidden'; focusable[0]?.focus();
    const keydown = (event: KeyboardEvent) => {if (event.key === 'Escape') setMenuOpen(false); if (event.key !== 'Tab' || !focusable.length) return; const first = focusable[0]; const last = focusable.at(-1)!; if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();} else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}};
    document.addEventListener('keydown', keydown); return () => {document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); trigger?.focus();};
  }, [menuOpen]);

  const expression = expressions[expressionIndex];
  const perCleanse = cleanseValue(product.variant.price);
  const productPrice = displayPrice(product.variant.price);
  const moveLight = (event: PointerEvent<HTMLDivElement>) => {const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--light-x', `${((event.clientX - rect.left) / rect.width) * 100}%`); event.currentTarget.style.setProperty('--light-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);};
  const moveCardLight = (event: PointerEvent<HTMLElement>) => {const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--card-x', `${((event.clientX - rect.left) / rect.width) * 100}%`); event.currentTarget.style.setProperty('--card-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);};

  return <div className="velnaura-home">
    <a className="skip-link" href="#hero-copy">Skip to main content</a>
    <div className="top-stack"><aside className="announcement" aria-label="Shipping announcement"><p>Complimentary shipping on all orders</p><span className="announcement-rule" aria-hidden="true"/><div className="countdown" aria-hidden="true"><span>{countdown.hours}<small>h</small></span><i>:</i><span>{countdown.minutes}<small>m</small></span><span className={`countdown-seconds ${showSeconds ? 'is-visible' : ''}`}><i>:</i><span>{countdown.seconds}<small>s</small></span></span><span className="countdown-fire">🔥</span></div><span className="sr-only" role="timer">Offer ends in {countdown.hours} hours, {countdown.minutes} minutes and {countdown.seconds} seconds.</span></aside>
      <header className="navigation-bar"><a className="brand-mark" href="#top" aria-label="Velnaura home"><img src="/velnaura-wordmark.svg" alt="Velnaura"/></a><nav className="primary-navigation" aria-label="Primary navigation">{navigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav><div className="navigation-actions"><button className="cart-button" type="button" aria-label="Open cart"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M5 7.5h18l-1.4 16H6.4L5 7.5Z"/><path d="M9.5 9V6a4.5 4.5 0 0 1 9 0v3"/></svg><span className="cart-glint" aria-hidden="true"/></button><button ref={menuButtonRef} className={`menu-button ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button></div></header></div>
    <header className={`navigation-bar floating-navigation-bar ${navVisible && navElevated ? 'is-visible' : ''}`} aria-label="Floating navigation"><a className="brand-mark" href="#top" aria-label="Velnaura home"><img src="/velnaura-wordmark.svg" alt="Velnaura"/></a><nav className="primary-navigation" aria-label="Primary navigation">{navigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav><div className="navigation-actions"><button className="cart-button" type="button" aria-label="Open cart"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M5 7.5h18l-1.4 16H6.4L5 7.5Z"/><path d="M9.5 9V6a4.5 4.5 0 0 1 9 0v3"/></svg><span className="cart-glint" aria-hidden="true"/></button><button className={`menu-button ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button></div></header>
    <button className={`menu-scrim ${menuOpen ? 'is-open' : ''}`} type="button" aria-label="Close menu" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}/>
    <aside ref={menuRef} className={`menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} aria-label="Velnaura menu"><div className="menu-panel-head"><p>Get it NOW!</p><button type="button" onClick={() => setMenuOpen(false)}>Close</button></div><div className="menu-offer"><div><h2 aria-label="Mugtea Whipped Cleanser"><span>Mugtea</span><small>Whipped Cleanser</small></h2></div><a href="#shop" onClick={() => setMenuOpen(false)}>Claim <span>↗</span></a></div><div className="menu-banner" aria-label="Future promotional banner"/><nav className="menu-navigation" aria-label="Menu navigation">{menuNavigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}<i aria-hidden="true">↗</i></a>)}</nav></aside>
    <main id="top"><section className="hero-screen"><div className="hero-message" id="hero-copy"><p className="hero-kicker">Skin beyond genetics</p><div className="hero-belief-region"><h1 className="belief-machine" aria-label={`Beyond ${expression}`}><span>Beyond</span><span className="expression-window" aria-hidden="true"><span className={`belief-expression ${expression.length > 11 ? 'is-long' : ''} ${expressionVisible ? 'is-visible' : 'is-leaving'}`}>{expression}</span></span></h1></div><div className="hero-conversion"><p>What you’re given is only the beginning.</p><a className="shop-button" href="#shop"><span>Shop now</span><i aria-hidden="true">↗</i></a></div></div>
      <div className="protagonist-stage" onPointerMove={moveLight}><div className="stage-noise" aria-hidden="true"/><div className="stage-halo" aria-hidden="true"/><div className="stage-capsule" aria-hidden="true"><span/></div><p className="stage-script">More from you, for your skin.</p><div className="stage-coordinates" aria-hidden="true"><span>V / 001</span><span>CALM · CLEAN · BALANCE</span></div><div className="stage-word" aria-hidden="true">BECOMING</div></div></section>
      <section ref={proofRef} className="evidence-section" id="philosophy" aria-labelledby="evidence-title"><div className="evidence-intro"><p className="section-label">THE MUGTEA METHOD</p><h2 id="evidence-title">{proofWords.map((word, i) => <span key={word} className={activeProof === i ? 'is-active' : ''} onMouseEnter={() => setActiveProof(i)}>{word}{' '}</span>)}</h2></div><div className="media-templates proof-rail" aria-label="The Mugtea method"><article className="proof-card proof-card--sensory" onPointerMove={moveCardLight}><div className="proof-card-head"><span>01 / FEEL</span><span>WHIPPED</span></div><div className="proof-image"><img src="/mugtea-tube.png" alt="Velnaura Mugtea whipped cleanser tube" loading="lazy"/></div><div className="proof-card-copy"><h3>Clean, not compromised.</h3><p>A sensorial reset that belongs in your day, not outside it.</p></div></article><article className="proof-card proof-card--formula" onPointerMove={moveCardLight}><div className="proof-card-head"><span>02 / FORMULA</span><span>MADE WITH INTENT</span></div><div className="formula-capsule" aria-hidden="true"><span>PHA</span><span>CENTELLA</span><span>MUGWORT</span><span>CUCUMBER</span></div><div className="proof-card-copy"><h3>Every ingredient has a role.</h3><p>Purposeful actives and selected botanicals, working in balance.</p></div></article><article className="proof-card proof-card--ritual" id="ritual" onPointerMove={moveCardLight}><div className="proof-card-head"><span>03 / RITUAL</span><span>DAILY</span></div><div className="proof-image"><img src="/mugtea-packaging.png" alt="Velnaura Mugtea cleanser packaging" loading="lazy"/></div><div className="proof-card-copy"><h3>Small act. Better skin ahead.</h3><p>One considered cleanse is enough to set the tone for what follows.</p></div></article></div>
        <article className="mugtea-commerce" id="shop"><div className="mugtea-copy"><h2><span>Mugtea</span><small>Whipped Cleanser</small></h2><p className="mugtea-lede">A whipped daily reset engineered to leave skin calm, clean and ready for what comes next.</p><p className="mugtea-formula">Tea Tree · Mugwort · Cucumber<br/>Centella · PHA · Niacinamide</p><div className="mugtea-value"><strong>{perCleanse}</strong><span>per cleanse</span></div><p className="mugtea-total-price">{productPrice} · 100 g</p><div className="mugtea-actions">{mode === 'shopify' ? <AddToCartButton disabled={!product.variant.availableForSale} lines={[{merchandiseId: product.variant.id, quantity: 1}]}>{product.variant.availableForSale ? 'Get Mugtea' : 'Sold out'}</AddToCartButton> : <button type="button">Get Mugtea</button>}<a href="#ritual">Discover the ritual</a></div></div><div className="mugtea-visual"><span className="product-index">M / 001</span><img src={product.image.url} alt={product.image.altText || `${product.title} packaging`} loading="lazy"/></div></article>
      </section><section className="newsletter-section" aria-labelledby="newsletter-title"><div className="newsletter-copy"><p>STAY IN THE RITUAL</p><h2 id="newsletter-title">Get Velnaura updates first.</h2><p className="newsletter-subcopy">Launch updates, restock alerts and first access to Mugtea — no daily inbox clutter.</p><form className="newsletter-form" onSubmit={(event) => {event.preventDefault(); setNewsletterMessage(`You’re in. We’ll send the next note to your ${newsletterMode === 'phone' ? 'phone' : 'inbox'}.`);}}><label className="sr-only" htmlFor="newsletter-input">{newsletterMode === 'phone' ? 'Mobile number' : 'Email address'}</label><div className="newsletter-input-row"><input id="newsletter-input" key={newsletterMode} type={newsletterMode === 'phone' ? 'tel' : 'email'} inputMode={newsletterMode === 'phone' ? 'tel' : 'email'} autoComplete={newsletterMode === 'phone' ? 'tel' : 'email'} placeholder={newsletterMode === 'phone' ? 'Mobile number' : 'you@email.com'} required/><button type="submit" aria-label="Join newsletter">↗</button></div><button className="newsletter-mode" type="button" onClick={() => {setNewsletterMode(newsletterMode === 'phone' ? 'email' : 'phone'); setNewsletterMessage('');}}>{newsletterMode === 'phone' ? 'Email me instead' : 'Text me instead'}</button><p className="newsletter-consent">{newsletterMode === 'email' ? <>By completing this form you are signing up to receive our emails and can unsubscribe at any time. See our <a href="https://velnaura.com/policies/terms-of-service.html">Terms of Service</a> and <a href="https://velnaura.com/policies/privacy-policy.html">Privacy Policy</a>.</> : <>By providing your number and clicking the button, you agree to receive recurring auto-dialed marketing SMS (including cart reminders; AI content; artificial or prerecorded voices) and our <a href="https://velnaura.com/policies/terms-of-service.html">Terms of Service</a> (including arbitration). Consent is not required to purchase. Msg &amp; data rates may apply. Msg frequency varies. Reply HELP for help; STOP to opt-out. <a href="https://velnaura.com/policies/privacy-policy.html">View Privacy Policy</a>.</>}</p>{newsletterMessage && <p className="newsletter-success" role="status">{newsletterMessage}</p>}</form></div><nav className="newsletter-nav" aria-label="Footer navigation"><div><h3>Shop</h3><a href="#shop">Mugtea</a></div><div><h3>Explore</h3><a href="#philosophy">Philosophy</a><a href="#ritual">Ritual</a><a href="#journal">Journal</a><a href="#about">About</a></div><div><h3>Support</h3><a href="#faqs">FAQs</a><a href="mailto:contact@velnaura.com">Contact us</a><a href="#shipping">Shipping &amp; returns</a></div></nav></section><section className="footer-brand-row" aria-label="Velnaura social channels"><a className="footer-wordmark" href="#top" aria-label="Velnaura home"><img src="/velnaura-wordmark.svg" alt="Velnaura"/></a><nav className="social-buttons" aria-label="Social media"><a href="#instagram" aria-label="Instagram"><img src="https://img.icons8.com/ios-filled/50/e8eee4/instagram-new.png" alt=""/></a><a href="#tiktok" aria-label="TikTok"><img src="https://img.icons8.com/ios-filled/50/e8eee4/tiktok.png" alt=""/></a><a href="#youtube" aria-label="YouTube"><img src="https://img.icons8.com/ios-filled/50/e8eee4/youtube-play.png" alt=""/></a><a href="#facebook" aria-label="Facebook"><img src="https://img.icons8.com/ios-filled/50/e8eee4/facebook-new.png" alt=""/></a></nav></section><footer className="site-footer"><div className="footer-meta"><span>© {new Date().getFullYear()} Velnaura. All rights reserved.</span><div><a href="#privacy">Privacy Policy</a><a href="#terms">Terms of Service</a><a href="#shipping">Shipping Policy</a><a href="#returns">Returns &amp; refunds</a><a href="#accessibility">Accessibility</a></div></div><p className="footer-beyond">BEYOND</p></footer></main>
  </div>;
}

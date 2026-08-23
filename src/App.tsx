import { useState, useEffect } from 'react';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { NotFound } from './pages/NotFound';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'privacy' | 'not-found'>(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '' || path === '/index.html') return 'home';
    if (path === '/privacy' || path === '/politica-de-privacidad') return 'privacy';
    return 'not-found';
  });

  const [copied, setCopied] = useState(false);
  const scaffoldCmd = 'bun create Digitalandia-dev/template-bun-react mi-app';

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '' || path === '/index.html') {
        setCurrentView('home');
      } else if (path === '/privacy' || path === '/politica-de-privacidad') {
        setCurrentView('privacy');
      } else {
        setCurrentView('not-found');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (view: 'home' | 'privacy') => {
    const targetPath = view === 'home' ? '/' : '/privacy';
    window.history.pushState({}, '', targetPath);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(scaffoldCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (currentView === 'not-found') {
    return (
      <>
        <GoogleAnalytics />
        <NotFound />
      </>
    );
  }

  if (currentView === 'privacy') {
    return (
      <>
        <GoogleAnalytics />
        <PrivacyPolicy 
          companyName="Digitalandia"
          websiteUrl="https://digitalandia.com"
          contactEmail="contacto@digitalandia.com"
          lastUpdated="Agosto 2026"
          onGoBack={() => navigateTo('home')}
        />
      </>
    );
  }

  return (
    <>
      <GoogleAnalytics />
      <main className="page">
        {/* 1. Header Minimalista */}
        <header className="header">
          <a href="https://digitalandia.com/labs" target="_blank" rel="noopener noreferrer" className="brand">
            <img src="/logo.svg" alt="Digitalandia" width="20" height="20" />
            Digitalandia <span>/ labs</span>
          </a>

          <a href="https://github.com/Digitalandia-dev/template-bun-react" target="_blank" rel="noopener noreferrer" className="nav-link">
            GitHub ↗
          </a>
        </header>

        {/* 2. Titular y Descripción */}
        <section className="hero">
          <h1 className="title">Plantilla Bun + React 19</h1>
          <p className="desc">
            Base de desarrollo ligera y de alto rendimiento optimizada para 100/100 en Google Lighthouse y TypeScript estricto.
          </p>
        </section>

        {/* 3. Snippet de Comando Copiable */}
        <div className="cmd-box">
          <code>
            <span className="cmd-prompt">$</span>
            {scaffoldCmd}
          </code>

          <button 
            type="button" 
            onClick={handleCopy} 
            className={`copy-btn ${copied ? 'copied' : ''}`}
            aria-label="Copiar comando de instalación"
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>

        {/* 4. Especificaciones en Texto Plano */}
        <div className="specs">
          <span>Runtime: <strong>Bun v1.3+</strong></span>
          <span>Core: <strong>React 19 + TS</strong></span>
          <span>Bundler: <strong>Vite 8</strong></span>
          <span>Score: <strong>100 PSI Ready</strong></span>
        </div>

        {/* 5. Footer */}
        <footer className="footer">
          <span>
            Licencia MIT ·{' '}
            <a 
              href="https://digitalandia.com/labs" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Digitalandia Labs
            </a>
          </span>
          <button type="button" onClick={() => navigateTo('privacy')} className="footer-btn">
            Privacidad
          </button>
        </footer>
      </main>
    </>
  );
}

export default App;

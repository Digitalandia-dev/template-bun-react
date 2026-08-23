import { useEffect } from 'react';

export function GoogleAnalytics() {
  const gaId = import.meta.env.VITE_GA_ID;

  useEffect(() => {
    // Si la variable no está definida o es la clave de ejemplo, no hacer nada
    if (!gaId || gaId === 'G-XXXXXXXXXX' || gaId.trim() === '') return;

    let loaded = false;
    const triggerEvents = ['scroll', 'keydown', 'touchstart', 'click'];

    const loadGA = () => {
      if (loaded) return;
      loaded = true;

      // Inyectar de forma asíncrona la etiqueta de Google Tag Manager (gtag.js)
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Inicializar dataLayer y la función gtag
      window.dataLayer = window.dataLayer || [];
      
      // Declaramos la función gtag nativa
      window.gtag = function(...args: unknown[]) {
        window.dataLayer.push(args);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        page_path: window.location.pathname,
      });

      // Limpiar escuchadores de eventos
      triggerEvents.forEach((event) => window.removeEventListener(event, loadGA));
    };

    // Escuchar la primera interacción del usuario para cargar el script (Performance Boost)
    triggerEvents.forEach((event) => window.addEventListener(event, loadGA, { passive: true }));
    
    // Carga de respaldo automático a los 4 segundos si el usuario no interactúa
    const safetyTimeout = setTimeout(loadGA, 4000);

    return () => {
      triggerEvents.forEach((event) => window.removeEventListener(event, loadGA));
      clearTimeout(safetyTimeout);
    };
  }, [gaId]);

  return null;
}

// Declaraciones de tipo globales para TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export default GoogleAnalytics;

import { useEffect } from 'react';
import { initDeferredAnalytics } from '../lib/loadAnalytics';

interface GoogleAnalyticsProps {
  trackingId?: string;
}

/**
 * Componente declarativo de Google Analytics 4 (GA4).
 * Carga de forma diferida en tiempo de reposo del navegador (requestIdleCallback)
 * o tras la primera interacción del usuario con cero impacto en métricas Core Web Vitals (100/100 PSI).
 */
export function GoogleAnalytics({ trackingId }: GoogleAnalyticsProps) {
  useEffect(() => {
    initDeferredAnalytics(trackingId);
  }, [trackingId]);

  return null;
}

export default GoogleAnalytics;


interface PrivacyPolicyProps {
  companyName?: string;
  websiteUrl?: string;
  contactEmail?: string;
  lastUpdated?: string;
  onGoBack?: () => void;
}

export function PrivacyPolicy({
  companyName = 'Digitalandia',
  websiteUrl = 'https://digitalandia.com',
  contactEmail = 'contacto@digitalandia.com',
  lastUpdated = 'Agosto 2026',
  onGoBack,
}: PrivacyPolicyProps) {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <article className="privacy-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={handleGoBack} className="footer-btn" style={{ fontSize: '0.85rem' }}>
          ← Volver
        </button>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{lastUpdated}</span>
      </div>

      <div>
        <h1>Política de Privacidad</h1>
      </div>

      <p>
        En <strong>{companyName}</strong> ({websiteUrl}), la privacidad de nuestros usuarios y clientes es prioritaria. Este documento describe de forma clara los datos que procesamos y cómo los protegemos.
      </p>

      <div>
        <h2>1. Información que recopilamos</h2>
        <p>
          La información personal que nos proporciones (nombre, correo electrónico o detalles de proyecto) se recopila únicamente a través de formularios de contacto o canales directos (WhatsApp o correo) con tu consentimiento explícito.
        </p>
      </div>

      <div>
        <h2>2. Uso de la información</h2>
        <p>Utilizamos tus datos estrictamente para:</p>
        <ul>
          <li>Responder a tus solicitudes de cotización o asesoría técnica.</li>
          <li>Desarrollar y entregar los proyectos de software contratados.</li>
          <li>Mejorar el rendimiento y la seguridad de nuestras plataformas.</li>
        </ul>
      </div>

      <div>
        <h2>3. Cookies y Privacidad</h2>
        <p>
          No vendemos ni comercializamos tus datos con terceros. Solo utilizamos herramientas analíticas mínimas y anónimas para evaluar el rendimiento técnico del sitio web.
        </p>
      </div>

      <div>
        <h2>4. Contacto y Derechos de Datos</h2>
        <p>
          Para ejercer tus derechos de acceso, rectificación o eliminación de tus datos, puedes escribirnos a:{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </div>

      <div style={{ paddingTop: '1rem' }}>
        <button type="button" onClick={handleGoBack} className="footer-btn">
          ← Volver a la plantilla
        </button>
      </div>
    </article>
  );
}

export default PrivacyPolicy;

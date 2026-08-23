export function NotFound() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <main className="page" style={{ minHeight: '80vh', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-text)' }}>
          [Error 404]
        </span>

        <h1 className="title" style={{ fontSize: '2rem' }}>
          Página No Encontrada
        </h1>

        <p className="desc">
          La ruta que buscas no existe o ha sido reubicada dentro del sistema.
        </p>

        <button 
          type="button" 
          onClick={handleGoHome} 
          className="copy-btn"
          style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', border: '1px solid var(--border)', fontSize: '0.8rem' }}
        >
          ← Volver al Inicio
        </button>
      </div>
    </main>
  );
}

export default NotFound;


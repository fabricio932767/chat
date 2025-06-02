'use client';

// INÍCIO DO BOOTSTRAP CLIENT
import { useEffect } from 'react';

export function BootstrapClient() {
  useEffect(() => {
    // Importar o JavaScript do Bootstrap dinamicamente apenas no navegador
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
// FIM DO BOOTSTRAP CLIENT 
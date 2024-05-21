import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/xcaliber-demo/'}>
      <Suspense>
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>,
);

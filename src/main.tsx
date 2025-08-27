import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Success from './pages/Success';
import PaymentSuccess from './pages/PaymentSuccess';
import './index.css';
import Cancel from './pages/Cancel';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/success', element: <Success /> },
  { path: '/payment-success', element: <PaymentSuccess /> },
  { path: '/cancel', element: <Cancel /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

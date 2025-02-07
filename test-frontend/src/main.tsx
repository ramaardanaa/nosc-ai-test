import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar/index.tsx';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode >,
)

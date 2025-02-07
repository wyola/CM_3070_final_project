import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './routes/Home.tsx';
import { Login } from './routes/Login.tsx';
import './sass/main.scss';
import { MainPagesLayout } from './layouts/MainPagesLayout.tsx';
import { Register } from './routes/Register.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPagesLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<MainPagesLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/register" element={<MainPagesLayout />}>
          <Route index element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

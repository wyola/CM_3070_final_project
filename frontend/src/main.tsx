import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './routes/Home/Home.tsx';
import { Login } from './routes/Login/Login.tsx';
import { MainPagesLayout } from './layouts/MainPagesLayout.tsx';
import { Register } from './routes/Register/Register.tsx';
import { Organization } from './routes/Organization/Organization.tsx';
import { HOME, LOGIN, REGISTER, ORGANIZATION_ID } from '@/constants';
import { UserProvider } from '@/contexts';
import './sass/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path={HOME} element={<MainPagesLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path={LOGIN} element={<MainPagesLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path={REGISTER} element={<MainPagesLayout />}>
            <Route index element={<Register />} />
          </Route>
          <Route path={ORGANIZATION_ID} element={<MainPagesLayout />}>
            <Route index element={<Organization />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);

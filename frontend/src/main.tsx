import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './sass/main.scss';
import {
  Home,
  Login,
  Register,
  Organization,
  OrganizationEdit,
  Report,
} from '@/routes';
import { MainPagesLayout } from './layouts/MainPagesLayout.tsx';
import {
  HOME,
  LOGIN,
  REGISTER,
  ORGANIZATION_ID,
  ORGANIZATION_EDIT,
  REPORT,
} from '@/constants';
import { UserProvider } from '@/contexts';

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
          <Route path={ORGANIZATION_EDIT} element={<MainPagesLayout />}>
            <Route index element={<OrganizationEdit />} />
          </Route>
          <Route path={REPORT} element={<MainPagesLayout />}>
            <Route index element={<Report />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);

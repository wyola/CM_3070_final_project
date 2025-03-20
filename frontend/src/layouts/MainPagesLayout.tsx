import { Outlet } from 'react-router';
import { Header, Footer } from '@/components';
import './mainPagesLayout.scss';

export function MainPagesLayout() {
  return (
    <>
      <Header />
      <main className='main'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

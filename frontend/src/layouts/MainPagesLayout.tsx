import { Header } from '@/components/Header/Header';
import { Outlet } from 'react-router';

export function MainPagesLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer style={{ background: '#d7ccc8', height: '200px' }}>footer</footer>
    </>
  );
}

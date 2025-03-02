import { OrganizationsListProvider } from '@/contexts';
import { OrganizationsTable } from '@/components/OrganizationsList/OrganizationsTable';

export const Home = () => {
  return (
    <OrganizationsListProvider>
      <section className="content home">
        <OrganizationsTable />
      </section>
    </OrganizationsListProvider>
  );
};

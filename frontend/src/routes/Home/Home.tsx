import { OrganizationsListProvider } from '@/contexts';
import { OrganizationsTable } from '@/components/OrganizationsTable/OrganizationsTable';
import { OrganizationsSearchFilterForm } from '@/components/OrganizationsSearchFilterForm/OrganizationsSearchFilterForm';

export const Home = () => {
  return (
    <OrganizationsListProvider>
      <section className="content home">
        <OrganizationsSearchFilterForm />
        <OrganizationsTable />
      </section>
    </OrganizationsListProvider>
  );
};

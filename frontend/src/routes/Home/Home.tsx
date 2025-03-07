import { OrganizationsListProvider } from '@/contexts';
import {
  OrganizationsTable,
  OrganizationsSearchFilterForm,
} from '@/components';

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

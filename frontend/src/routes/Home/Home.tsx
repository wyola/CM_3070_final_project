import { OrganizationsListProvider } from '@/contexts';
import {
  OrganizationsTable,
  OrganizationsSearchFilterForm,
  PageTitle,
} from '@/components';

export const Home = () => {
  return (
    <OrganizationsListProvider>
      <section className="content home">
        <PageTitle title="Find Organizations" />

        <OrganizationsSearchFilterForm />
        <OrganizationsTable />
      </section>
    </OrganizationsListProvider>
  );
};

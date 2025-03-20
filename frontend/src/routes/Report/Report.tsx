import { PageTitle } from '@/components';
import { ReportAbuseForm } from '@/components/ReportAbuseForm/ReportAbuseForm';

export const Report = () => {
  return (
    <section className="content report">
      <PageTitle title="Report mistreated animals" />
      <ReportAbuseForm />
    </section>
  );
};

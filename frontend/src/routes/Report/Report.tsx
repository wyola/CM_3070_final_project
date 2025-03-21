import { PageTitle, ReportAbuseForm } from '@/components';

export const Report = () => {
  return (
    <section className="content report">
      <PageTitle title="Report mistreated animals" />
      <ReportAbuseForm />
    </section>
  );
};

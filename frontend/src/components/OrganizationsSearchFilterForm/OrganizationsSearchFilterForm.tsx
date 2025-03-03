import { FormProvider, useForm } from 'react-hook-form';
import { CustomFormField } from '../CustomFormField/CustomFormField';
import { useOrganizationsList } from '@/contexts';
import { VOIVODESHIPS } from '@/constants';
import { OrganizationSearchFilterFormDataI } from '@/types';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import { useSearchParams } from 'react-router';
import './organizationsSearchFilterForm.scss';

export const OrganizationsSearchFilterForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const methods = useForm<OrganizationSearchFilterFormDataI>({
    defaultValues: {
      search: searchParams.get('search') || '',
      voivodeship: searchParams.get('voivodeship') || 'all',
      acceptsReports: searchParams.get('acceptsReports') === 'true',
    },
  });

  const { handleSubmit } = methods;
  const { fetchOrganizations } = useOrganizationsList();

  const onFilterChange = handleSubmit((data) => {
    const params = new URLSearchParams();

    if (data.search?.trim()) {
      params.set('search', data.search.trim());
    }
    if (data.voivodeship && data.voivodeship !== 'all') {
      params.set('voivodeship', data.voivodeship);
    }
    if (data.acceptsReports) {
      params.set('acceptsReports', String(data.acceptsReports));
    }

    setSearchParams(params);
    fetchOrganizations(data);
  });

  const voivodeshipOptions = [
    { value: 'all', label: 'All voivodeships' },
    ...VOIVODESHIPS.map((voivodeship) => ({
      value: voivodeship,
      label: voivodeship,
    })),
  ];

  return (
    <FormProvider {...methods}>
      <form className="search-form" onChange={onFilterChange}>
        <CustomFormField
          type="text"
          name="search"
          id="search"
          placeholder="Search by name or city..."
        />

        <CustomSelect
          name="voivodeship"
          id="voivodeship"
          placeholder="Select voivodeship"
          options={voivodeshipOptions}
        />

        <CustomFormField
          type="checkbox"
          name="acceptsReports"
          id="acceptsReports"
          label="Accepts reports"
          className="search-form__checkbox"
        />
      </form>
    </FormProvider>
  );
};

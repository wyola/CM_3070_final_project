import { FormProvider, useForm } from 'react-hook-form';
import { CustomFormField } from '../CustomFormField/CustomFormField';
import { useOrganizationsList } from '@/contexts';
import { VOIVODESHIPS } from '@/constants';
import { OrganizationSearchFilterFormDataI } from '@/types';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import { useSearchParams } from 'react-router';
import { useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
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

  const { watch } = methods;
  const { search, acceptsReports, voivodeship } = watch();
  const { fetchOrganizations } = useOrganizationsList();

  const onFilterChange = useCallback(
    debounce(() => {
      const params = new URLSearchParams();

      if (search?.trim()) {
        params.set('search', search.trim());
      }
      if (voivodeship && voivodeship !== 'all') {
        params.set('voivodeship', voivodeship);
      }
      if (acceptsReports) {
        params.set('acceptsReports', String(acceptsReports));
      }

      setSearchParams(params);
      fetchOrganizations({ search, voivodeship, acceptsReports });
    }, 100),
    [setSearchParams, fetchOrganizations, search, voivodeship, acceptsReports]
  );

  useEffect(() => {
    onFilterChange();
    return () => onFilterChange.cancel();
  }, [search, voivodeship, acceptsReports]);

  const voivodeshipOptions = [
    { value: 'all', label: 'All voivodeships' },
    ...VOIVODESHIPS.map((voivodeship) => ({
      value: voivodeship.toLowerCase(),
      label: voivodeship,
    })),
  ];

  return (
    <FormProvider {...methods}>
      <form className="search-form">
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

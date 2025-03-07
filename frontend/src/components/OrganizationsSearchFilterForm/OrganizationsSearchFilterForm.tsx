import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { useOrganizationsList } from '@/contexts';
import { CustomFormField, CustomSelect } from '@/components';
import { VOIVODESHIPS } from '@/constants';
import { OrganizationSearchFilterFormDataI } from '@/types';
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
  const { fetchOrganizations, currentPage, updateCurrentPage } =
    useOrganizationsList();

  const onFilterChange = useCallback(
    debounce(() => {
      const params = new URLSearchParams();

      if (search?.trim()) {
        params.set('search', search.trim());
      } else {
        params.delete('search');
      }
      if (voivodeship && voivodeship !== 'all') {
        params.set('voivodeship', voivodeship);
      } else {
        params.delete('voivodeship');
      }
      if (acceptsReports) {
        params.set('acceptsReports', String(acceptsReports));
      }

      if (currentPage) {
        params.set('page', currentPage.toString());
      }

      setSearchParams(params);
      fetchOrganizations({ search, voivodeship, acceptsReports });
    }, 100),
    [
      setSearchParams,
      fetchOrganizations,
      search,
      voivodeship,
      acceptsReports,
      currentPage,
    ]
  );

  useEffect(() => {
    updateCurrentPage(1);
  }, [search, voivodeship, acceptsReports]);

  useEffect(() => {
    onFilterChange();
    return () => onFilterChange.cancel();
  }, [search, voivodeship, acceptsReports, currentPage]);

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

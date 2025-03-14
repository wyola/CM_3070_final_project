import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { useOrganizationsList } from '@/contexts';
import { CustomFormField, CustomMultiSelect, CustomSelect } from '@/components';
import { ANIMAL_OPTIONS, VOIVODESHIPS } from '@/constants';
import { KindsOfNeeds, OrganizationSearchFilterFormDataI } from '@/types';
import debounce from 'lodash.debounce';
import './organizationsSearchFilterForm.scss';
import { mapKindToLabel } from '@/utils';

export const OrganizationsSearchFilterForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const methods = useForm<OrganizationSearchFilterFormDataI>({
    defaultValues: {
      search: searchParams.get('search') || '',
      voivodeship: searchParams.get('voivodeship') || 'all',
      acceptsReports: searchParams.get('acceptsReports') === 'true',
      animals: searchParams.get('animals')?.split(',') || [],
      needs: searchParams.get('needs') || 'all',
    },
  });

  const { watch } = methods;
  const { search, acceptsReports, voivodeship, animals, needs } = watch();
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

      if (animals && animals.length > 0) {
        params.set('animals', animals.join(','));
      } else {
        params.delete('animals');
      }

      if (needs && needs !== 'all') {
        params.set('needs', needs);
      } else {
        params.delete('needs');
      }

      if (currentPage) {
        params.set('page', currentPage.toString());
      }

      setSearchParams(params);
      fetchOrganizations({
        search,
        voivodeship,
        acceptsReports,
        animals,
        needs,
      });
    }, 100),
    [
      setSearchParams,
      fetchOrganizations,
      search,
      voivodeship,
      acceptsReports,
      animals,
      needs,
      currentPage,
    ]
  );

  useEffect(() => {
    updateCurrentPage(1);
  }, [search, voivodeship, acceptsReports, animals, needs]);

  useEffect(() => {
    onFilterChange();
    return () => onFilterChange.cancel();
  }, [search, voivodeship, acceptsReports, currentPage, animals, needs]);

  const voivodeshipOptions = [
    { value: 'all', label: 'All voivodeships' },
    ...VOIVODESHIPS.map((voivodeship) => ({
      value: voivodeship.toLowerCase(),
      label: voivodeship,
    })),
  ];

  const needsOptions = [
    { value: 'all', label: 'All needs' },
    ...Object.values(KindsOfNeeds).map((need) => ({
      value: need,
      label: mapKindToLabel(need),
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

        <CustomMultiSelect
          name="animals"
          id="animals"
          placeholder="Select animals"
          options={ANIMAL_OPTIONS}
        />

        <CustomSelect
          name="needs"
          id="needs"
          placeholder="Filter by need"
          options={needsOptions}
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

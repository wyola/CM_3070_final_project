import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { useOrganizationsList } from '@/contexts';
import {
  CustomFormField,
  CustomMultiSelect,
  CustomSelect,
  Button,
} from '@/components';
import { ANIMAL_OPTIONS, VOIVODESHIPS } from '@/constants';
import { KindsOfNeeds, OrganizationSearchFilterFormDataI } from '@/types';
import { mapKindToLabel } from '@/utils';
import debounce from 'lodash.debounce';
import './organizationsSearchFilterForm.scss';

type OrganizationsSearchFilterFormProps = {
  className?: string;
};

export const OrganizationsSearchFilterForm = ({
  className,
}: OrganizationsSearchFilterFormProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const previousValues = useRef<{
    search?: string;
    voivodeship?: string;
    acceptsReports?: boolean;
    animals?: string[];
    needs?: string;
    useLocation?: boolean;
  }>({});

  const methods = useForm<OrganizationSearchFilterFormDataI>({
    defaultValues: {
      search: searchParams.get('search') || '',
      voivodeship: searchParams.get('voivodeship') || 'all',
      acceptsReports: searchParams.get('acceptsReports') === 'true',
      animals: searchParams.get('animals')?.split(',') || [],
      needs: searchParams.get('needs') || 'all',
      useLocation: searchParams.get('nearest') === 'true',
    },
  });

  const { watch, setValue } = methods;

  const { search, acceptsReports, voivodeship, animals, needs, useLocation } =
    watch();

  const { fetchOrganizations, currentPage, updateCurrentPage } =
    useOrganizationsList();

  const getLocation = useCallback(() => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError(
            "Couldn't access your location. Please check your browser permissions."
          );
          setValue('useLocation', false);
          setIsGettingLocation(false);
        }
      );
    } else {
      setLocationError("Your browser doesn't support geolocation.");
      setValue('useLocation', false);
      setIsGettingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (useLocation && !location && !isGettingLocation) {
      getLocation();
    }
  }, [useLocation, getLocation, location, isGettingLocation]);

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

      if (useLocation) {
        params.set('nearest', 'true');
      } else {
        params.delete('nearest');
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
        useLocation,
        lat: useLocation ? location?.lat : undefined,
        long: useLocation ? location?.long : undefined,
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
      useLocation,
      location,
    ]
  );

  useEffect(() => {
    const shouldResetPage =
      previousValues.current &&
      (previousValues.current.search !== search ||
        previousValues.current.voivodeship !== voivodeship ||
        previousValues.current.acceptsReports !== acceptsReports ||
        JSON.stringify(previousValues.current.animals) !==
          JSON.stringify(animals) ||
        previousValues.current.needs !== needs ||
        previousValues.current.useLocation !== useLocation);

    previousValues.current = {
      search,
      voivodeship,
      acceptsReports,
      animals,
      needs,
      useLocation,
    };

    if (shouldResetPage && currentPage !== 1) {
      updateCurrentPage(1);
    } else {
      onFilterChange();
    }

    return () => onFilterChange.cancel();
  }, [
    search,
    voivodeship,
    acceptsReports,
    animals,
    needs,
    useLocation,
    location,
    currentPage,
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    methods.reset({
      search: '',
      voivodeship: 'all',
      acceptsReports: false,
      animals: [],
      needs: 'all',
      useLocation: false,
    });

    setSearchParams(new URLSearchParams());

    fetchOrganizations({
      search: '',
      voivodeship: 'all',
      acceptsReports: false,
      animals: [],
      needs: 'all',
      useLocation: false,
    });

    updateCurrentPage(1);
  };

  return (
    <FormProvider {...methods}>
      <form
        className={`search-form ${className || ''}`}
        onSubmit={handleSubmit}
      >
        <CustomFormField
          type="text"
          name="search"
          id="search"
          placeholder="Search by name or city..."
          className="search-form__field--search"
        />

        <CustomSelect
          name="voivodeship"
          placeholder="Select voivodeship"
          options={voivodeshipOptions}
          className="search-form__field--voivodeship"
        />

        <CustomMultiSelect
          name="animals"
          placeholder="Select animals"
          options={ANIMAL_OPTIONS}
          className="search-form__field--animals"
        />

        <CustomSelect
          name="needs"
          placeholder="Filter by need"
          options={needsOptions}
          className="search-form__field--needs"
        />

        <CustomFormField
          type="checkbox"
          name="acceptsReports"
          label="Accepts reports"
          className="search-form__checkbox search-form__field--accepts-reports"
        />

        <div className="search-form__location">
          <CustomFormField
            type="checkbox"
            name="useLocation"
            label="Find nearest"
            className="search-form__checkbox"
            disabled={isGettingLocation}
          />

          {isGettingLocation && (
            <div className="search-form__location--info">
              Getting your location...
            </div>
          )}

          {locationError && (
            <div className="search-form__location--info">{locationError}</div>
          )}

          {useLocation && location && (
            <div className="search-form__location--info">
              ✓ Using your location
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={clearFilters}
          className="search-form__clear-button"
        >
          Clear filters
        </Button>
      </form>
    </FormProvider>
  );
};

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  CustomFormField,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  CustomSwitch,
  CustomMultiSelect,
  FormMessage,
  ReportSummary,
  LocationMap,
  RichTextEditor,
  Label,
} from '@/components';
import { ReportFormDataI } from '@/types';
import { createReportApi } from '@/lib/axios';
import { ANIMAL_OPTIONS } from '@/constants';
import axios from 'axios';
import { useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import './reportAbuseForm.scss';

export const ReportAbuseForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addressType, setAddressType] = useState<'map' | 'address'>('map');
  const [formErrors, setFormErrors] = useState<
    { field: string; message: string }[]
  >([]);
  const [isContactInfoVisible, setIsContactInfoVisible] = useState(true);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [assignedOrganizations, setAssignedOrganizations] = useState<
    { organizationName: string; organizationId: number }[]
  >([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);

          methods.setValue(
            'geolocation',
            JSON.stringify({
              lat: latitude,
              lon: longitude,
            })
          );
        },
        (error) => {
          console.error('Error getting location:', error);
          setPosition([52.2297, 21.0122]); // Default to Warsaw, Poland
          methods.setValue(
            'geolocation',
            JSON.stringify({
              lat: 52.2297,
              lon: 21.0122,
            })
          );
        }
      );
    }
  }, []);

  const CenterMarker = () => {
    const map = useMapEvents({
      moveend() {
        const center = map.getCenter();
        methods.setValue(
          'geolocation',
          JSON.stringify({
            lat: center.lat,
            lon: center.lng,
          })
        );
      },
      click(e: L.LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        map.setView([lat, lng], map.getZoom());

        methods.setValue(
          'geolocation',
          JSON.stringify({
            lat: lat,
            lon: lng,
          })
        );
      },
    });

    return <img className="map-pin" src="/pin-color.svg" />;
  };

  const methods = useForm<ReportFormDataI>({
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      postalCode: '',
      geolocation: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      image: '',
      animals: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ReportFormDataI) => {
    setIsLoading(true);
    setError(null);
    setFormErrors([]);

    try {
      const response = await createReportApi.createReport(data, addressType);

      if (response && response.data.assignments) {
        setAssignedOrganizations(response.data.assignments);
      }
      setIsSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          setFormErrors(error.response.data.errors);
        } else {
          setError(
            error.response?.data?.message ||
              'Failed to send report. Please try again.'
          );
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="report">
      {isSuccess ? (
        <ReportSummary assignedOrganizations={assignedOrganizations} />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="report__form">
            <CustomFormField
              label="Title"
              type="text"
              name="title"
              id="title"
              required
              placeholder="Enter a brief title for your report"
              errorMessage={
                formErrors.find((error) => error.field === 'title')?.message
              }
            />

            <CustomMultiSelect
              name="animals"
              id="animals"
              placeholder="Select animals involved"
              options={ANIMAL_OPTIONS}
              label="Animals involved"
              required
              errorMessage={
                formErrors.find((error) => error.field === 'animals')?.message
              }
            />

            <div className="description-field">
              <Label htmlFor="description" className="description-field__label">
                Description <span className="form-item__required">*</span>
              </Label>
              <RichTextEditor
                name="description"
                placeholder="Please describe the situation in detail..."
              />
              {formErrors.find((error) => error.field === 'description')
                ?.message && (
                <FormMessage className="report__form--error-message">
                  {
                    formErrors.find((error) => error.field === 'description')
                      ?.message
                  }
                </FormMessage>
              )}
            </div>

            <div className="report__form--location">
              <p className="report__form--helper-text">
                Provide abuse location by showing it on map or by filling out
                address form <span className="form-item__required">*</span>
              </p>

              <Tabs
                defaultValue={addressType}
                onValueChange={(value) =>
                  setAddressType(value === 'map' ? 'map' : 'address')
                }
              >
                <TabsList>
                  <TabsTrigger value="map">Show on map</TabsTrigger>
                  <TabsTrigger value="address">Type address</TabsTrigger>
                </TabsList>
                <TabsContent value="map">
                  {position ? (
                    <div className="report__form--map">
                      <p className="report__form--helper-text">
                        Click on the map to set a location or drag the map to
                        adjust pin position. Zoom-in to give the most accurate
                        location.
                      </p>
                      <LocationMap
                        geolocation={{ lat: position[0], lon: position[1] }}
                        customMarker={<CenterMarker />}
                      />
                    </div>
                  ) : (
                    <div className="report__form--loading-map">
                      Getting your location... If prompted, please allow
                      location access
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="address">
                  <CustomFormField
                    label="Address"
                    type="text"
                    name="address"
                    id="address"
                    required
                    placeholder="Street, building number, apartment number"
                  />
                  <div className="report__form--city-postal-wrapper">
                    <CustomFormField
                      label="City"
                      type="text"
                      name="city"
                      id="city"
                      required
                      placeholder="City name"
                    />
                    <CustomFormField
                      label="Postal Code"
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      required
                      pattern="[0-9]{2}-[0-9]{3}"
                      placeholder="Postal code in format 00-000"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              {formErrors.find((error) => error.field === 'address')
                ?.message && (
                <FormMessage className="report__form--error-message">
                  {
                    formErrors.find((error) => error.field === 'address')
                      ?.message
                  }
                </FormMessage>
              )}
            </div>

            <CustomFormField
              label="Upload Photo, max 5MB (optional)"
              type="file"
              name="image"
              id="image"
              accept="image/*"
              errorMessage={
                formErrors.find((error) => error.field === 'image')?.message
              }
            />

            <div className="report__form--contact">
              <CustomSwitch
                label="I want to provide my contact information (optional)"
                checked={isContactInfoVisible}
                onCheckedChange={() =>
                  setIsContactInfoVisible(!isContactInfoVisible)
                }
              />
              <p className="report__form--helper-text">
                Organization can contact you if they have issues finding
                reported place. <br />
                You can choose what data you want to provide.
                <br />
                Your personal data is safe with them, but we understand if you
                prefer to remain anonymous.
              </p>
            </div>

            {isContactInfoVisible && (
              <>
                <CustomFormField
                  label="Your Name (optional)"
                  type="text"
                  name="contactName"
                  id="contactName"
                  placeholder="Enter your name"
                />
                <CustomFormField
                  label="Email (optional)"
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  placeholder="Enter your email address"
                />
                <CustomFormField
                  label="Phone Number (optional)"
                  type="tel"
                  name="contactPhone"
                  id="contactPhone"
                  placeholder="Enter your phone number (9 digits)"
                />
              </>
            )}

            <Button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
              onClick={() => console.log('xxx ass')}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

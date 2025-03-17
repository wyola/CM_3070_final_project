import { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  CustomFormField,
  Button,
  SuccessMessage,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  CustomSwitch,
  CustomMultiSelect,
  FormMessage,
} from '@/components';
import {
  ReportFormDataI,
  ReportWithAddressFormDataI,
  ReportWithGeolocationFormDataI,
} from '@/types';
import { axiosInstance } from '@/lib/axios';
import { ANIMAL_OPTIONS, API_ENDPOINTS } from '@/constants';
import axios from 'axios';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
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
  const mapRef = useRef(null);

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

    return (
      <div className="map-center-marker">
        <div className="map-pin"></div>
      </div>
    );
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
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('animals', JSON.stringify(data.animals));
      if (addressType === 'address') {
        formData.append(
          'address',
          (data as ReportWithAddressFormDataI).address
        );
        formData.append('city', (data as ReportWithAddressFormDataI).city);
        formData.append(
          'postalCode',
          (data as ReportWithAddressFormDataI).postalCode
        );
      } else {
        const geolocation = (data as ReportWithGeolocationFormDataI)
          .geolocation;
        formData.append('geolocation', geolocation);
      }

      if (data.contactName) formData.append('contactName', data.contactName);
      if (data.contactEmail) formData.append('contactEmail', data.contactEmail);
      if (data.contactPhone) formData.append('contactPhone', data.contactPhone);

      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      await axiosInstance.post(API_ENDPOINTS.REPORT.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
        <SuccessMessage
          message="Your report has been submitted successfully!"
          imageSrc="./success_dog.png"
        />
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

            <CustomFormField
              label="Description"
              type="textarea"
              name="description"
              id="description"
              required
              placeholder="Please describe the situation in detail"
              errorMessage={
                formErrors.find((error) => error.field === 'description')
                  ?.message
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
                formErrors.find((error) => error.field === 'animals.0')?.message
              }
            />

            <div className="report__form--location">
              <p className="report__form--helper-text">
                Provide abuse location by showing it on map or by filling out
                address form <span>*</span>
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
                        adjust pin position
                      </p>
                      <MapContainer
                        center={position}
                        zoom={13}
                        style={{ height: '400px', width: '100%' }}
                        ref={mapRef}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <CenterMarker />
                      </MapContainer>
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
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

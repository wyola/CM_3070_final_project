import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './locationMap.scss';

interface LocationMapProps {
  geolocation: { lat: number; lon: number };
  popupHeader?: string;
  fullAddress?: {
    address: string;
    postalCode: string;
    city: string;
  };
  customMarker?: React.ReactNode;
  mapContainerHeight?: string;
}

export const LocationMap = ({
  geolocation,
  popupHeader,
  fullAddress,
  customMarker,
  mapContainerHeight,
}: LocationMapProps) => {
  return (
    <MapContainer
      center={[geolocation.lat, geolocation.lon]}
      zoom={15}
      style={{
        height: `${mapContainerHeight || '300px'}`,
        width: '100%',
        zIndex: 0,
      }}
      className="map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {customMarker ? (
        customMarker
      ) : (
        <Marker position={[geolocation.lat, geolocation.lon]}>
          <Popup>
            {popupHeader && <span>{popupHeader}</span>}
            <br />
            {fullAddress && (
              <span>
                {fullAddress.address}, {fullAddress.postalCode}{' '}
                {fullAddress.city}
              </span>
            )}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

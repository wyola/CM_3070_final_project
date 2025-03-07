import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './organizationMap.scss';
import { CustomCard } from '../CustomCard/CustomCard';

interface OrganizationMapProps {
  geolocation: { lat: number; lon: number };
  name: string;
  address: string;
}

export const OrganizationMap = ({
  geolocation,
  name,
  address,
}: OrganizationMapProps) => {
  return (
    <CustomCard className="organization-map">
      <MapContainer
        center={[geolocation.lat, geolocation.lon]}
        zoom={15}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[geolocation.lat, geolocation.lon]}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </CustomCard>
  );
};

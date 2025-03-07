interface GeolocationCoordinates {
  lat: number;
  lon: number;
}

export class GeolocationService {
  private userAgent: string;

  constructor() {
    this.userAgent = 'AnimalAlliesAPI/1.0';
  }

  /**
   * Get geolocation coordinates from an address using OpenStreetMap Nominatim API
   */
  async getCoordinatesFromAddress(addressData: {
    address: string;
    city: string;
    postalCode: string;
    country?: string;
  }): Promise<GeolocationCoordinates | null> {
    try {
      const { address, city, postalCode, country = 'Poland' } = addressData;
      const query = encodeURIComponent(
        `${address}, ${postalCode} ${city}, ${country}`
      );

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        {
          headers: {
            'User-Agent': this.userAgent,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return null;
    }
  }
}

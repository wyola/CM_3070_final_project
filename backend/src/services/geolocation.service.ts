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

  // Haversine formula to calculate distance between two points on Earth
  // https://en.wikipedia.org/wiki/Haversine_formula
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const earthRadiusKm = 6371;
    const deltaLat = this.deg2rad(lat2 - lat1);
    const deltaLon = this.deg2rad(lon2 - lon1);

    const halfChordLengthSquared =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const angularDistance =
      2 *
      Math.atan2(
        Math.sqrt(halfChordLengthSquared),
        Math.sqrt(1 - halfChordLengthSquared)
      );
    const distanceKm = earthRadiusKm * angularDistance;

    return distanceKm;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

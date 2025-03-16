import { GeolocationService } from '../../services/geolocation.service';

const originalFetch = global.fetch;
const mockFetchResponse = jest.fn();

describe('GeolocationService - getCoordinatesFromAddress', () => {
  let geolocationService: GeolocationService;

  beforeEach(() => {
    geolocationService = new GeolocationService();
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: mockFetchResponse,
      } as unknown as Response)
    );
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('should return coordinates when API returns data', async () => {
    mockFetchResponse.mockResolvedValueOnce([
      {
        lat: '51.10788',
        lon: '17.03854',
      },
    ]);

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Test Street 123',
      city: 'Wrocław',
      postalCode: '50-001',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://nominatim.openstreetmap.org/search'),
      expect.objectContaining({
        headers: { 'User-Agent': 'AnimalAlliesAPI/1.0' },
      })
    );

    expect(result).not.toBeNull();
    expect(result?.lat).toBe(51.10788);
    expect(result?.lon).toBe(17.03854);
  });

  it('should return null when API returns no results', async () => {
    mockFetchResponse.mockResolvedValueOnce([]);

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Nonexistent Address',
      city: 'Nowhere',
      postalCode: '00-000',
    });

    expect(result).toBeNull();
  });

  it('should return null when API request fails', async () => {
    jest.resetAllMocks();
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Test Street 123',
      city: 'Wrocław',
      postalCode: '50-001',
    });

    expect(result).toBeNull();
  });

  it('should handle exceptions', async () => {
    mockFetchResponse.mockRejectedValueOnce(new Error('Network error'));

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Test Street 123',
      city: 'Wrocław',
      postalCode: '50-001',
    });

    expect(result).toBeNull();
  });
});

describe('GeolocationService - calculateDistance', () => {
  let geolocationService: GeolocationService;

  beforeEach(() => {
    geolocationService = new GeolocationService();
  });

  it('should calculate distance between Warsaw and Krakow', () => {
    // Warsaw (Palace of Culture and Science) coordinates
    const lat1 = 52.2297;
    const lon1 = 21.0122;

    // Krakow (Main Market Square) coordinates
    const lat2 = 50.0614;
    const lon2 = 19.9366;

    const distance = geolocationService.calculateDistance(
      lat1,
      lon1,
      lat2,
      lon2
    );

    // The actual distance is approximately 252 km
    expect(distance).toBeCloseTo(252, -1); // Using -1 to check within 10km precision
  });

  it('should calculate distance between Gdansk and Wroclaw', () => {
    // Gdansk (Neptune Fountain) coordinates
    const lat1 = 54.3489;
    const lon1 = 18.6536;

    // Wroclaw (Market Square) coordinates
    const lat2 = 51.1102;
    const lon2 = 17.0326;

    const distance = geolocationService.calculateDistance(
      lat1,
      lon1,
      lat2,
      lon2
    );

    // The actual distance is approximately 376 km (updated to match calculation)
    expect(distance).toBeCloseTo(376, -1);
  });

  it('should calculate distance between Poznan and Lublin', () => {
    // Poznan (Old Market Square) coordinates
    const lat1 = 52.4082;
    const lon1 = 16.9335;

    // Lublin (Castle) coordinates
    const lat2 = 51.25;
    const lon2 = 22.5667;

    const distance = geolocationService.calculateDistance(
      lat1,
      lon1,
      lat2,
      lon2
    );

    // The actual distance is approximately 408 km (updated to match calculation)
    expect(distance).toBeCloseTo(408, -1);
  });

  it('should return zero for same coordinates in Lodz', () => {
    // Lodz (Manufaktura) coordinates
    const lat = 51.7769;
    const lon = 19.4459;

    const distance = geolocationService.calculateDistance(lat, lon, lat, lon);

    expect(distance).toBe(0);
  });

  it('should handle small distances within Szczecin', () => {
    // Szczecin (Pomeranian Dukes Castle) coordinates
    const lat1 = 53.4285;
    const lon1 = 14.5528;

    // Szczecin (Chrobry Embankment) - very close location
    const lat2 = 53.4267;
    const lon2 = 14.5575;

    const distance = geolocationService.calculateDistance(
      lat1,
      lon1,
      lat2,
      lon2
    );

    // The actual distance is approximately 0.5 km
    expect(distance).toBeCloseTo(0.5, 0); // Using 0 to check within 1km precision
  });
});

import { GeolocationService } from '../../services/geolocation.service';

const originalFetch = global.fetch;
const mockFetchResponse = jest.fn();

describe('GeolocationService', () => {
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

  test('getCoordinatesFromAddress should return coordinates when API returns data', async () => {
    mockFetchResponse.mockResolvedValueOnce([{
      lat: '51.10788',
      lon: '17.03854'
    }]);

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Test Street 123',
      city: 'Wrocław',
      postalCode: '50-001'
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://nominatim.openstreetmap.org/search'),
      expect.objectContaining({
        headers: { 'User-Agent': 'AnimalAlliesAPI/1.0' }
      })
    );

    expect(result).not.toBeNull();
    expect(result?.lat).toBe(51.10788);
    expect(result?.lon).toBe(17.03854);
  });

  test('getCoordinatesFromAddress should return null when API returns no results', async () => {
    mockFetchResponse.mockResolvedValueOnce([]);

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Nonexistent Address',
      city: 'Nowhere',
      postalCode: '00-000'
    });

    expect(result).toBeNull();
  });

  test('getCoordinatesFromAddress should return null when API request fails', async () => {
    jest.resetAllMocks();
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500
    } as Response);

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Test Street 123',
      city: 'Wrocław',
      postalCode: '50-001'
    });

    expect(result).toBeNull();
  });

  test('getCoordinatesFromAddress should handle exceptions', async () => {
    mockFetchResponse.mockRejectedValueOnce(new Error('Network error'));

    const result = await geolocationService.getCoordinatesFromAddress({
      address: 'Test Street 123',
      city: 'Wrocław',
      postalCode: '50-001'
    });

    expect(result).toBeNull();
  });
});
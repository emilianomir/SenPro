import { render, screen, act } from '@testing-library/react';
import TravelMode from '../components/TravelMode';
import * as mapsUtils from '../utils/loadGoogleMaps';

// Mock the Google Maps API
import '../../src/__mocks__/google-maps';

// Mock the script loading utility
jest.mock('../utils/loadGoogleMaps', () => ({
  loadGoogleMapsScript: jest.fn()
}));

describe('TravelMode Component', () => {
  beforeEach(() => {
    // Simulate the script loading successfully
    mapsUtils.loadGoogleMapsScript.mockImplementation((cb) => cb());
  });

  it('renders origin and destination addresses', async () => {
    await act(async () => {
      render(
        <TravelMode
          origin={{ lat: 0, lng: 0 }}
          destination={{ lat: 1, lng: 1 }}
          originAddress="123 Origin St"
          destinationAddress="456 Destination Ave"
        />
      );
    });

    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText('To:')).toBeInTheDocument();
    expect(screen.getByText('123 Origin St')).toBeInTheDocument();
    expect(screen.getByText('456 Destination Ave')).toBeInTheDocument();
  });
});

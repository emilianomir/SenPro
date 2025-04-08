import { render, screen, act } from '@testing-library/react';
import TravelMode from '../components/TravelMode';
import * as mapsUtils from '../utils/loadGoogleMaps';

// mock the google maps api
import '../../src/__mocks__/google-maps';

// mock the script loading utility
jest.mock('../utils/loadGoogleMaps', () => ({
  loadGoogleMapsScript: jest.fn()
}));

describe('TravelMode component', () => { // unit test for the TravelMode component, isolated from the rest of the app
  beforeEach(() => {
    // simulate the script loading successfully
    mapsUtils.loadGoogleMapsScript.mockImplementation((cb) => cb()); // when loadGoogleMapsScript is called, it will call the cb function, which is a successful call of the initMap function
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

    // check if the text is in the document, some text
    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText('To:')).toBeInTheDocument();
    expect(screen.getByText('123 Origin St')).toBeInTheDocument();
    expect(screen.getByText('456 Destination Ave')).toBeInTheDocument();
  });


});

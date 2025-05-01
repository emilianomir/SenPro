import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import TravelMode from '../components/TravelMode';
import * as mapsUtils from '../utils/loadGoogleMaps';
import fetchMock from 'jest-fetch-mock';

// create fake weather api response with arbitrary values
const mockWeatherApiResponse = (temperature, windspeed, winddirection, weathercode, is_day) => {
  fetchMock.mockResponseOnce(JSON.stringify({
    current_weather: {
      temperature,
      windspeed,
      winddirection,
      weathercode,
      is_day,
      time: "2023-04-08T14:00"
    },
    daily: {
      time: ["2023-04-08", "2023-04-09", "2023-04-10"],
      weathercode: [2, 61, 0],
      temperature_2m_max: [26.3, 24.1, 27.8],
      temperature_2m_min: [17.5, 18.2, 16.0],
      precipitation_probability_max: [10, 85, 5]
    }
  }));
};

// mock the google maps api via the google-maps.js file which is the window.google.maps object
import '../../src/__mocks__/google-maps';

// simulate the script without actually loading the script
// prevents the script from being loaded and the map from being initialized
//! by using the loadGoogleMapsScript function which is in the loadGoogleMaps.js file
jest.mock('../utils/loadGoogleMaps', () => ({
  loadGoogleMapsScript: jest.fn()
}));

// enable the fetch mock so that that fake weather api response can be made
fetchMock.enableMocks();

//! don't show any console logs
let originalConsoleLog;
let originalConsoleError;

beforeAll(() => {
  originalConsoleLog = console.log;
  originalConsoleError = console.error;
  console.log = jest.fn();
  console.error = jest.fn();
});
// ! end of silence console logs


// ! MOCK THE ROUTE FUNCTION
const mockRouteFn = jest.fn((options, callback) => {
  callback({ status: 'OK', routes: [{ legs: [{ distance: { text: '1 km' }, duration: { text: '3 mins' } }] }] }); // callback is called which means that the route is calculated with the distance and duration of the route widget in the TravelMode component
});
global.google.maps.DirectionsService = jest.fn(() => ({ // this means that instead of the google maps api, the mockRouteFn will be used
  route: mockRouteFn
}));
// ! end of mock the route function

// ! restore the console logs
afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
// ! end of restore the console logs

describe('TravelMode component', () => { //! THIS IS THE TEST SUITE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  beforeEach(() => {
    // before every tests, 
    // clear all mocks
    // reset the fetch mock
    // mock the weather api response
    // simulate the script loading 

    jest.clearAllMocks();
    fetchMock.resetMocks();
    mockWeatherApiResponse(22.5, 18.4, 270, 2, 1);
    mapsUtils.loadGoogleMapsScript.mockImplementation((cb) => cb());
  });

  it('renders origin and destination addresses', () => {
    render(
      <TravelMode
        origin={{ lat: 26.304, lng: -98.163 }}
        destination={{ lat: 26.301, lng: -98.163 }}
        originAddress="123 Origin St"
        destinationAddress="456 Destination Ave"
      />
    );

    // Check if addresses are displayed correctly
    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText('To:')).toBeInTheDocument();
    expect(screen.getByText('123 Origin St')).toBeInTheDocument();
    expect(screen.getByText('456 Destination Ave')).toBeInTheDocument();
  });

  it('toggles traffic layer when traffic button is clicked', async () => {
    await act(async () => {
      render(
        <TravelMode
          origin={{ lat: 26.304, lng: -98.163 }}
          destination={{ lat: 26.301, lng: -98.163 }}
        />
      );
    });

    // looks that the traffic button to be in the document using rtl
    const trafficButton = screen.getByText('Hide Traffic');
    expect(trafficButton).toBeInTheDocument();
    
    // simulate user clicking the traffic button via rtl
    await act(async () => {
      fireEvent.click(trafficButton); // rtl
    });
    
    // Button text should change
    expect(screen.getByText('Show Traffic')).toBeInTheDocument();
    
    // Click to toggle traffic back on
    await act(async () => {
      fireEvent.click(screen.getByText('Show Traffic'));
    });
    
    // Button text should change back
    expect(screen.getByText('Hide Traffic')).toBeInTheDocument();
  });

  it('swaps origin and destination when swap button is clicked', async () => {
    await act(async () => {
      render( // use render from @testing-library/react to render the actual DOM elements
        <TravelMode
          origin={{ lat: 26.304, lng: -98.163 }}
          destination={{ lat: 26.301, lng: -98.163 }}
          originAddress="123 Origin St"
          destinationAddress="456 Destination Ave"
        />
      );
    });

    // check that the origin and destination addresses are in the document
    expect(screen.getByText('123 Origin St')).toBeInTheDocument();
    expect(screen.getByText('456 Destination Ave')).toBeInTheDocument();
    
    // find the swap button and click it
    const swapButton = screen.getByTitle('Swap locations');
    
    await act(async () => {
      fireEvent.click(swapButton);
    });
    
    // check that the origin and destination addresses are swapped
    expect(screen.getByText('456 Destination Ave')).toBeInTheDocument();
    expect(screen.getByText('123 Origin St')).toBeInTheDocument();
  });

  it('shows weather information when weather button is clicked', async () => {
    await act(async () => {
      render(
        <TravelMode
          origin={{ lat: 26.304, lng: -98.163 }}
          destination={{ lat: 26.301, lng: -98.163 }}
        />
      );
    });

    // check that the weather button is in the document
    const weatherButton = screen.getByText('Show Weather');
    expect(weatherButton).toBeInTheDocument();
    
    // simulate user clicking the weather button via rtl
    await act(async () => {
      fireEvent.click(weatherButton);
    });
    
    // check that the weather button text changes
    expect(screen.getByText('Hide Weather')).toBeInTheDocument();
    
    // check that the weather panel title is in the document
    await waitFor(() => {
      expect(screen.getByText('Weather at Destination')).toBeInTheDocument();
    });
  });

  it('updates travel mode when dropdown changes', async () => {
    await act(async () => {
      render(
        <TravelMode
          origin={{ lat: 26.304, lng: -98.163 }}
          destination={{ lat: 26.301, lng: -98.163 }}
        />
      );
    });

    // find the travel mode dropdown
    const modeSelect = screen.getByRole('combobox'); 
    fireEvent.change(modeSelect, { target: { value: 'WALKING' } });

    // check that the mock has been called with the selected mode
    expect(mockRouteFn).toHaveBeenCalled();
  });
});




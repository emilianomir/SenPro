import { render, screen, act, waitFor } from '@testing-library/react';
import TrafficCongestionPanel from '../components/TrafficCongestionPanel';
import fetchMock from 'jest-fetch-mock';

// enable the fetch mock so that that fake weather api response can be made
fetchMock.enableMocks();

// mock the TrafficIncidentsPanel component
jest.mock('../components/TrafficIncidentsPanel', () => {
  return function MockTrafficIncidentsPanel() {
    return <div data-testid="mocked-incidents-panel">Mocked Traffic Incidents Panel</div>;
  };
});

// silence console logs during tests
let originalConsoleLog;
let originalConsoleError;

beforeAll(() => {
  // store original console methods
  originalConsoleLog = console.log;
  originalConsoleError = console.error;
  
  // mock console methods
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('TrafficCongestionPanel component', () => {
  const origin = { lat: 26.304, lng: -98.163 };
  const destination = { lat: 26.301, lng: -98.163 };
  
  beforeEach(() => {
    // reset all mocks
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });
  
  it('renders loading state initially', async () => {
    // delay API response to ensure we see the loading state
    fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(
      () => resolve(JSON.stringify({ success: true })), 
      100
    )));
    
    await act(async () => {
      render(<TrafficCongestionPanel origin={origin} destination={destination} />);
    });
    
    expect(screen.getByText('Loading traffic data...')).toBeInTheDocument();
  });
  
  it('displays traffic congestion information correctly', async () => {
    // mock successful API response
    fetchMock.mockResponseOnce(JSON.stringify({
      success: true,
      distance: 2000, // 2km
      duration: 300, // 5 minutes without traffic
      durationInTraffic: 420 // 7 minutes with traffic (40% congestion)
    }));
    
    await act(async () => {
      const { container } = render(
        <TrafficCongestionPanel 
          origin={origin} 
          destination={destination} 
        />
      );

      // add data-testid to the congestion-level element
      const congestionLevel = container.querySelector('.congestion-level');
      if (congestionLevel) {
        congestionLevel.setAttribute('data-testid', 'congestion-level');
      }
    });
    
    // wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading traffic data...')).not.toBeInTheDocument();
    });
    
    // check title and elements
    expect(screen.getByText('Traffic Insights')).toBeInTheDocument();
    expect(screen.getByText('Traffic Congestion')).toBeInTheDocument();
    
    // check congestion level calculation (should be "Moderate" with 40%)
    await waitFor(() => {
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
    });
    
    // check speed calculations
    // Current speed: 2km / (420/3600) = 17.1 km/h = 10.6 mph
    // Free flow speed: 2km / (300/3600) = 24 km/h = 14.9 mph
    await waitFor(() => {
      expect(screen.getByText('10.6')).toBeInTheDocument(); // ! current speed in mph
      expect(screen.getByText('14.9')).toBeInTheDocument(); // ! normal speed in mph
    });
    
    // check if TrafficIncidentsPanel is rendered
    expect(screen.getByTestId('mocked-incidents-panel')).toBeInTheDocument();
  });
  
  it('handles low congestion correctly', async () => {
    // mock API response with low congestion (10%)
    fetchMock.mockResponseOnce(JSON.stringify({
      success: true,
      distance: 5000, // 5km
      duration: 600, // 10 minutes
      durationInTraffic: 660 // 11 minutes 
    }));
    
    let container;
    await act(async () => {
      const renderResult = render(<TrafficCongestionPanel origin={origin} destination={destination} />);
      container = renderResult.container;
    });
    
    // wait for API response
    await waitFor(() => {
      expect(screen.queryByText('Loading traffic data...')).not.toBeInTheDocument();
    });
    
    // ! check congestion level (should be "Low" with 10%)
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    
    // ! check congestion meter styling using querySelector instead of getByClassName
    const congestionLevel = container.querySelector('.congestion-level');
    expect(congestionLevel).toHaveClass('low');
    expect(congestionLevel.style.width).toBe('10%');
  });
  
  it('handles high congestion correctly', async () => {
    // mock API response with high congestion (100%)
    fetchMock.mockResponseOnce(JSON.stringify({
      success: true,
      distance: 10000, // 10km
      duration: 900, // 15 minutes
      durationInTraffic: 1800 // 30 minutes (100% congestion)
    }));
    
    let container;
    await act(async () => {
      const renderResult = render(<TrafficCongestionPanel origin={origin} destination={destination} />);
      container = renderResult.container;
    });
    
    // wait for API response
    await waitFor(() => {
      expect(screen.queryByText('Loading traffic data...')).not.toBeInTheDocument();
    });
    
    // check congestion level (should be "High" with 100%)
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // check congestion meter styling using querySelector
    const congestionLevel = container.querySelector('.congestion-level');
    expect(congestionLevel).toHaveClass('high');
    expect(congestionLevel.style.width).toBe('100%');
  });
  
  it('handles API error gracefully', async () => {
    // mock API error
    fetchMock.mockRejectOnce(new Error('Network error'));
    
    await act(async () => {
      render(<TrafficCongestionPanel origin={origin} destination={destination} />);
    });
    
    //wait for error handling
    await waitFor(() => {
      expect(screen.queryByText('Loading traffic data...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Unknown')).toBeInTheDocument(); // congestion level
    expect(screen.getByText('0%')).toBeInTheDocument(); // congestion percentage
    
    expect(screen.getAllByText('0')[0]).toBeInTheDocument(); // current speed
    expect(screen.getAllByText('0')[1]).toBeInTheDocument(); // normal speed
  });
  
  it('handles case when API returns lower traffic duration than normal duration', async () => {
    //! sometimes API might return inconsistent results where traffic is faster than normal conditions
    fetchMock.mockResponseOnce(JSON.stringify({
      success: true,
      distance: 5000, // 5km
      duration: 600, // 10 minutes
      durationInTraffic: 540 // 9 minutes , traffic faster, so congestion is 0%
    }));
    
    await act(async () => {
      render(<TrafficCongestionPanel origin={origin} destination={destination} />);
    });
    
    // ! wait for API response
    await waitFor(() => {
      expect(screen.queryByText('Loading traffic data...')).not.toBeInTheDocument();
    });
    
    // this test is to ensure that the component handles the case when the API returns a lower traffic duration than normal duration
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); //should make sure that the congestion is non-negative
  });
}); 
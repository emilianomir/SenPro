// __mocks__/google-maps.js
const google = {
    // mock the google maps api
    maps: {
      // mock the map
      Map: jest.fn().mockImplementation(() => ({
        setCenter: jest.fn(),
        setZoom: jest.fn()
      })),
      // mock the directions renderer
      DirectionsRenderer: jest.fn().mockImplementation(() => ({
        setMap: jest.fn(),
        setDirections: jest.fn(),
        getDirections: jest.fn(() => null)
      })),
      // mock the directions service with hardcoded values
      DirectionsService: jest.fn().mockImplementation(() => ({
        route: jest.fn((opts) =>
          Promise.resolve({
            routes: [
              {
                legs: [
                  {
                    distance: { text: '2 km' },
                    duration: { text: '5 mins' }
                  }
                ]
              }
            ]
          })
        )
      })),


      // mock the traffic layer
      TrafficLayer: jest.fn().mockImplementation(() => ({
        setMap: jest.fn()
      })),
      Geocoder: jest.fn().mockImplementation(() => ({
        geocode: jest.fn((params, callback) =>
          callback([{ formatted_address: 'Mocked Address' }], 'OK')
        )
      })),
      TravelMode: {
        DRIVING: 'DRIVING',
        WALKING: 'WALKING',
        TRANSIT: 'TRANSIT'
      },
      LatLng: jest.fn((lat, lng) => ({ lat, lng }))
    }
  };
  
  global.google = google;
// this is a utility function to load the google maps script 
// it is used to load the google maps script and then call the callback function
//basically it like a pseduo map api, so we can mock the map api
export function loadGoogleMapsScript(callback) { // cb is initMap
    if (typeof window === 'undefined' || window.google) { // no window or google object already load
      callback(); // so run the cb
      return;
    }
    // mock the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  }
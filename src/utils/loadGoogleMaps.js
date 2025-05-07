// this is a utility function to load the google maps script 
// it is used to load the google maps script and then call the callback function
//basically it like a pseduo map api, so we can mock the map api
export function loadGoogleMapsScript(callback) { // cb is initMap
    if (typeof window === 'undefined') { // if no window, return
      return;
    }

    // script already loaded, so run the callback
    const existing = document.getElementById('google-maps'); // check if the script is already loaded via the id
    if (existing) {
      if (window.google && window.google.maps) {
        callback(); // if the script is already loaded, run the callback
      } else {
        existing.addEventListener('load', callback); // if the script is not loaded, add an event listener to the script
      }
      return;
    }

    // first time, inject the script
    const script = document.createElement('script');
    script.id = 'google-maps'; // give the script an id to be able to check if it is loaded
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`; // inject the script
    script.async = true; // async to not block the page
    script.defer = true;// same
    script.onload = callback;
    document.head.appendChild(script); // head is where scripts go in html/dom
  }
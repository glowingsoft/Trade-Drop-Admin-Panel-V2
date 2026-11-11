import { CONFIG } from 'src/config-global';

let loadPromise;

export function getGoogleMapsApiKey() {
  return CONFIG.googleMaps?.apiKey || '';
}

export function loadGoogleMaps(libraries = ['places']) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (loadPromise) return loadPromise;

  const libs = Array.isArray(libraries) ? libraries.filter(Boolean).join(',') : String(libraries || '');

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      if (window.google?.maps) resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${libs ? `&libraries=${libs}` : ''}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Google Maps'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function loadGoogleMapsPlaces() {
  return loadGoogleMaps(['places']);
}

export function searchGooglePlaces(input) {
  const query = String(input || '').trim();
  if (!query) return Promise.resolve([]);

  return loadGoogleMapsPlaces().then(
    (google) =>
      new Promise((resolve) => {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: query,
            types: ['geocode'],
          },
          (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              resolve([]);
              return;
            }
            resolve(
              predictions.map((item) => ({
                placeId: item.place_id,
                description: item.description,
                mainText: item.structured_formatting?.main_text || item.description,
                secondaryText: item.structured_formatting?.secondary_text || '',
              }))
            );
          }
        );
      })
  );
}

export function getGooglePlaceDetails(placeId) {
  if (!placeId) return Promise.resolve(null);

  return loadGoogleMapsPlaces().then(
    (google) =>
      new Promise((resolve) => {
        const container = document.createElement('div');
        const service = new google.maps.places.PlacesService(container);
        service.getDetails(
          {
            placeId,
            fields: ['place_id', 'name', 'formatted_address', 'geometry'],
          },
          (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
              resolve(null);
              return;
            }
            resolve({
              placeId: place.place_id,
              name: place.name || '',
              address: place.formatted_address || place.name || '',
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            });
          }
        );
      })
  );
}

import axios from 'axios';

const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

/**
 * Search for places using Foursquare Places API (v3)
 * @param {string} query Search query (e.g., "Cafe")
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 */
export const searchPlaces = async (query, lat = 24.8607, lng = 67.0011) => {
  if (!FOURSQUARE_API_KEY || FOURSQUARE_API_KEY === 'your_foursquare_api_key_here') {
    console.warn('Foursquare API Key is missing. Returning mock data.');
    return [
      { name: 'Mock Location 1', location: { formatted_address: '123 Main St' }, geocodes: { main: { latitude: lat, longitude: lng } } },
      { name: 'Mock Location 2', location: { formatted_address: '456 Business Rd' }, geocodes: { main: { latitude: lat + 0.01, longitude: lng + 0.01 } } },
    ];
  }

  try {
    const options = {
      method: 'GET',
      url: 'https://api.foursquare.com/v3/places/search',
      params: {
        query: query,
        ll: `${lat},${lng}`,
        radius: 10000,
        limit: 5
      },
      headers: {
        accept: 'application/json',
        Authorization: FOURSQUARE_API_KEY
      }
    };

    const response = await axios.request(options);
    return response.data.results;
  } catch (error) {
    console.error('Foursquare API Error:', error);
    throw error;
  }
};

/**
 * Get address suggestions / autocomplete (simplified using search)
 */
export const getAddressSuggestions = async (query) => {
    // Defaulting to Karachi coordinates as a base if geolocation fails
    return await searchPlaces(query);
};

import axios from 'axios';

const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

/**
 * Search for places using Foursquare Places API (v3)
 * @param {string} query Search query (e.g., "Cafe")
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 */
export const searchPlaces = async (query, lat = 24.8607, lng = 67.0011) => {
  console.log('Searching for address:', query);
  
  // Try OpenStreetMap Nominatim first (Reliable & Free)
  try {
    const osmResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: `${query}, Karachi`,
        format: 'json',
        limit: 5,
        addressdetails: 1
      },
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (osmResponse.data && osmResponse.data.length > 0) {
      console.log('OSM search successful');
      return osmResponse.data.map(item => ({
        name: item.display_name.split(',')[0],
        location: { formatted_address: item.display_name },
        geocodes: { 
          main: { 
            latitude: parseFloat(item.lat), 
            longitude: parseFloat(item.lon) 
          } 
        }
      }));
    }
  } catch (osmError) {
    console.warn('Nominatim failed, trying Foursquare:', osmError.message);
  }

  // Fallback to Foursquare if OSM fails
  if (!FOURSQUARE_API_KEY || FOURSQUARE_API_KEY.includes('your_')) {
    return [];
  }

  try {
    const options = {
      method: 'GET',
      url: 'https://api.foursquare.com/v3/places/search',
      params: {
        query: query,
        near: 'Karachi, PK',
        limit: 5,
        fields: 'fsq_id,name,location,geocodes',
      },
      headers: {
        accept: 'application/json',
        Authorization: FOURSQUARE_API_KEY
      }
    };

    const response = await axios.request(options);
    return response.data.results.map(item => ({
      name: item.name || 'Unknown Location',
      location: { formatted_address: item.location?.formatted_address || '' },
      geocodes: { main: { latitude: item.geocodes?.main?.latitude || lat, longitude: item.geocodes?.main?.longitude || lng } }
    }));
  } catch (error) {
    console.error('All search services failed:', error.message);
    return [];
  }
};

/**
 * Get address suggestions / autocomplete (simplified using search)
 */
export const getAddressSuggestions = async (query) => {
    // Defaulting to Karachi coordinates as a base if geolocation fails
    return await searchPlaces(query);
};

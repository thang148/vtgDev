import axios from 'utils/api';

export function getPlaceList(params) {
  return axios.get('api/place/get-all', { params });
}

export function createPlace(place) {
  return axios.post('api/place/', place);
}

export function updatePlace(place) {
  return axios.put('api/place/', place);
}

export function removePlace(id) {
  return axios.delete('api/place/' + id);
}
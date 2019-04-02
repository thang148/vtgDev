import axios from 'utils/api';

export function getAllHotel(params) {
  return axios.get('api/hotel/get-all', { params })
}
import axios from 'utils/api';

export function getCountryList(params) {
  return axios.get('api/country/get-all', { params });
}

export function getAllCountry() {
  return axios.get('api/country/get-all');
}

export function createCountry(country) {
  return axios.post('api/country/', country);
}

export function updateCountry(country) {
  return axios.put('api/country/', country);
}

export function getCountry(id) {
  return axios.get('api/country/', { params: { id } });
}

export function deleteCountry(id) {
  return axios.delete('api/country/' + id);
}

export function getProvinceList(params) {
  return axios.get('api/province/get-all', { params });
}

export function createProvince(province) {
  return axios.post('api/province/', province);
}

export function updateProvince(province) {
  return axios.put('api/province/', province);
}

export function deleteProvince(id) {
  return axios.delete('api/province/' + id);
}

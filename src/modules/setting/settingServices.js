import axios from 'utils/api';

export function getPageList() {
  return axios.get('api/page-info/get-all');
}

export function updatePage(place) {
  return axios.put('api/page-info/save-by-name', place);
}

export function removePage(id) {
  return axios.delete('api/page-info/' + id);
}

export function setCompanyInfo(data) {
  return axios.put('api/setting/save-by-name', {
    name: 'CompanyProfile',
    value: JSON.stringify(data)
  })
}

export function getCompanyInfo() {
  return axios.get('api/setting/get-by-name?name=CompanyProfile')
    .then((data) => (data ? JSON.parse(data.value) : {}));
}

export function putSetting(data) {
  return axios.put('api/setting/save-by-name', data)
}

export function getSetting(name) {
  return axios.get('api/setting/get-by-name', { params: { name } })
    .then((data) => (data ? data : {}));
}
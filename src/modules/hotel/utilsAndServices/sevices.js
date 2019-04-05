import axios from 'utils/api';

export function getAllUtils(params) {
    return axios.get('/api/category-convenient/get-page', { params });
}

export function UpdateUtils(data) {
    return axios.put('/api/category-convenient/update', data);
}

export function getAllService(params) {
    return axios.get('/api/category-convenient/get-page', { params });
}

export function UpdateService(data) {
    return axios.put('/api/category-convenient/update', data);
}

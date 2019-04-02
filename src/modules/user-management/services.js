import axios from 'utils/api';
export function getAllUser(params) {
    return axios.get('api/user/get-all', { params });
}

export function CreateUser(data) {
    return axios.post('/api/user/create', data);
}

export function UpdateUser(data) {
    return axios.put('/api/user/update', data);
}

export function DeleteUser(data) {
    return axios.delete('/api/user/delete/' + data);
}



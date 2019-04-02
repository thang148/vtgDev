import axios from 'utils/api';

export function getRoomType(){
    return axios.get('api/')
}
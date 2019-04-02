import Axios from 'axios';
import { BASE_URL } from '../common/constants';

export function login({ username, password }) {
  return Axios.post(
    BASE_URL + 'oauth/token',
    `username=${username}&password=${password}&grant_type=password`,
    {
      headers: {
        'Authorization': 'Basic Zm9vQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ=',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
}
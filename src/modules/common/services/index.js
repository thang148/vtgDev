import axios from 'utils/api';

/**
 * CONTENT RESOURCES
 */

export function uploadContent(formData) {
  return axios.post('api/content/create-upload', formData);
}
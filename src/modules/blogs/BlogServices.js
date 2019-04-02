import axios from 'utils/api';

export function getBlogCategories(params) {
  return axios.get('api/blog-category/get-all', { params });
}

export function getCategory(id) {
  return axios.get('api/blog-category/' + id);
}

export function deleteCategory(id) {
  return axios.delete('api/blog-category/' + id);
}

export function createCategory(data) {
  return axios.post('api/blog-category/', data);
}

export function modifyCategory(data) {
  return axios.put('api/blog-category/', data);
}

export function getBlogList(params) {
  return axios.get('api/blog/search-with-cate-and-province', { params });
}

export function getBlog(id) {
  return axios.get('api/blog/' + id);
}

export function createBlog(data) {
  return axios.post('api/blog/', data);
}

export function modifyBlog(data) {
  return axios.put('api/blog/', data);
}

export function deleteBlog(id) {
  return axios.delete('api/blog/' + id);
}

export function getPlaceList() {
  return axios.get('api/province/get-all');
}

export function setCopyrightInfo(data) {
  return axios.put('api/setting/', {
    id: 2,
    name: 'BlogCopyright',
    value: data
  })
}

export function getCopyrightInfo() {
  return axios.get('api/setting/2');
}

export function deleteManyBlog(ids) {
  return axios.delete('api/blog/delete-many', { params: { ids } })
}

export function updateStatus(ids, status) {
  return axios.put('api/blog/update-status', null, { params: { ids, status } })
}
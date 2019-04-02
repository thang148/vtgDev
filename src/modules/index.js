import React from 'react';
import loadable from 'react-loadable';
import { Loading } from './common/components';

export default {
  Loading,
  Blank: () => (<span />),
  Login: loadable({
    loader: () => import('./auth/Login'),
    loading: Loading
  }),
  Logout: loadable({
    loader: () => import('./auth/Logout'),
    loading: Loading
  }),
  Location: loadable({
    loader: () => import('./location'),
    loading: Loading
  }),
  Places: loadable({
    loader: () => import('./places'),
    loading: Loading
  }),
  CustomList: loadable({
    loader: () => import('./custom-list'),
    loading: Loading
  }),
  Layout: loadable({
    loader: () => import('./layout'),
    loading: Loading
  }),
  Blog: loadable({
    loader: () => import('./blogs/blog'),
    loading: Loading
  }),
  BlogPreview: loadable({
    loader: () => import('./blogs/preview'),
    loading: Loading
  }),
  BlogManagement: loadable({
    loader: () => import('./blogs/management'),
    loading: Loading
  }),
  BlogCategory: loadable({
    loader: () => import('./blogs/category'),
    loading: Loading
  }),
  BlogCopyright: loadable({
    loader: () => import('./blogs/copyright'),
    loading: Loading
  }),
  SettingPageInfo: loadable({
    loader: () => import('./setting/PageInfo'),
    loading: Loading
  }),
  SettingCompanyProfile: loadable({
    loader: () => import('./setting/ComanyProfile'),
    loading: Loading
  }),
  SettingOther: loadable({
    loader: () => import('./setting/Other'),
    loading: Loading
  }),
  UserInfo: loadable({
    loader: () => import('./user-info'),
    loading: Loading
  }),
  HotelManagement: loadable({
    loader: () => import('./hotel/management'),
    loading: Loading
  }),
  HotelUpload: loadable({
    loader: () => import('./hotel/upload'),
    loading: Loading
  }),
  HotelUtilsAndServices: loadable({
    loader: () => import('./hotel/utilsAndServices'),
    loading: Loading
  }),
  RoomManagement: loadable({
    loader: () => import('./room/management'),
    loading: Loading
  }),
  UserManagement: loadable({
    loader: () => import('./user-management/Management'),
    loading: Loading
  })
}
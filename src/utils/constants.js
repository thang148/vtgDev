export const DEFAULT_LANG = 'en';
export const DEFAULT_THEME = 'theme.Light';
export const BASE_URL = process.env.NODE_ENV === "development" ? '' : '/vtg/';
export const RESOURCES_PATH = BASE_URL + 'resources/';
export const TOKEN_KEY = 'JWT';
export const REFRESH_TOKEN_KEY = 'F5T';
export const HOTEL_TYPES = [
  'HOTEL', 'HOMESTAY', 'MOTEL', 'RESORT', 'APARTMENT', 'YACHT', 'VILLA'
]
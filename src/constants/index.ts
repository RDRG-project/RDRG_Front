// description : Navigation URL PATH
export const SNS_PATH = '/sns/:accessToken/:expires';
export const AUTH_PATH = '/rdrg/authentication';
export const HOME_PATH = '/rdrg/home';
export const RENT_PATH = '/rdrg/rent';
export const CUSTOMER_SUPPORT_PATH = '/customer-support';

// description : Navigation 절대 URL PATH
export const HOME_ABSOLUTE_PATH = HOME_PATH;
export const RENT_ABSOLUTE_PATH = RENT_PATH;
export const CUSTOMER_SUPPORT_ABSOLUTE_PATH = CUSTOMER_SUPPORT_PATH;
export const AUTH_ABSOLUTE_PATH = AUTH_PATH;

// description : API URL PATH
export const SERVER_DOMAIN_URL = 'http://localhost:4500';
export const SERVER_API_URL = `${SERVER_DOMAIN_URL}/rdrg`;
export const SERVER_AUTH_MODULE_URL = `${SERVER_API_URL}/auth`;
export const SIGN_IN_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-in`;
export const ID_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/id-check`;
export const EMAIL_AUTH_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth`;
export const EMAIL_AUTH_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth-check`;
export const SIGN_UP_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-up`;


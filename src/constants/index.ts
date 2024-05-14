// description : Navigation URL PATH
export const SNS_PATH = '/sns/:accessToken/:expires';
export const RDRG_PATH = '/rdrg' // 공통 레이아웃
export const HOME_PATH = 'home' // 홈화면
export const AUTH_PATH = 'sign-in'; //로그인 화면
export const SIGN_UP_PATH = 'sign-up'; //회원가입화면
export const RENT_PATH = 'rent'; // 대여화면
export const CUSTOMER_SUPPORT_PATH = 'customer-support'; //고객지원 화면

// description : Navigation 절대 URL PATH
export const RDRG_ABSOLUTE_PATH = RDRG_PATH; // 공통 레이아웃 절대 경로
export const HOME_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}`; // 홈화면 절대경로
export const AUTH_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${AUTH_PATH}`; // 로그인 화면 절대경로
export const SIGN_UP_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${SIGN_UP_PATH}`; // 회원가입 화면 절대경로

export const RENT_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${RENT_PATH}`; // 대여화면 절대경로

export const CUSTOMER_SUPPORT_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${CUSTOMER_SUPPORT_PATH}`; // 고객지원 화면 절대경로

// description : API URL PATH
export const SERVER_DOMAIN_URL = 'http://localhost:4500';
export const SERVER_API_URL = `${SERVER_DOMAIN_URL}/rdrg`;
export const SERVER_AUTH_MODULE_URL = `${SERVER_API_URL}/auth`;
export const SIGN_IN_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-in`;
export const ID_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/id-check`;
export const EMAIL_AUTH_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth`;
export const EMAIL_AUTH_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth-check`;
export const SIGN_UP_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-up`;

export const POST_COMMENT_REQUEST_URL = (receptionNumber: number | string) => `${CUSTOMER_SUPPORT_BOARD_MODULE_URL}/${receptionNumber}/comment`;
export const CUSTOMER_SUPPORT_BOARD_MODULE_URL = `${SERVER_API_URL}/board`;
export const POST_BOARD_REQUEST_URL = `${CUSTOMER_SUPPORT_BOARD_MODULE_URL}/`;
export const GET_BOARD_LIST_URL = `${CUSTOMER_SUPPORT_BOARD_MODULE_URL}/list`;

// 
export const GET_BOARD_URL = (receptionNumber: number | string) => `${CUSTOMER_SUPPORT_BOARD_MODULE_URL}/${receptionNumber}`;
export const PUT_BOARD_URL = (receptionNumber: number | string) => `${CUSTOMER_SUPPORT_BOARD_MODULE_URL}/${receptionNumber}`;
export const DELETE_BOARD_URL = (receptionNumber: number | string) => `${CUSTOMER_SUPPORT_BOARD_MODULE_URL}/${receptionNumber}`;


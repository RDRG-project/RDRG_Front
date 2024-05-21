// description : Navigation URL PATH
export const SNS_PATH = '/sns/:accessToken/:expires'; // sns 화면
export const RDRG_PATH = '/rdrg' // 공통 레이아웃
export const HOME_PATH = 'home' // 홈화면
export const AUTH_PATH = 'auth'; // 로그인 , 회원가입 화면

export const HOME_COMPANY_PATH = 'company' // 회사소개
export const HOME_CLAUSE_PATH = 'clause' // 이용약관
export const HOME_POLICY_PATH = 'policy' // 개인정보처리방침
export const HOME_PLACE_PATH = 'place' // 지점안내

export const CUSTOMER_SUPPORT_PATH = 'customer-support'; //고객지원 화면
export const CUSTOMER_SUPPORT_WRITE_PATH = 'write'; //문의 내역 글쓰기
export const CUSTOMER_SUPPORT_DETAIL_PATH = ':receptionNumber'; // 문의 내역 상세
export const CUSTOMER_SUPPORT_UPDATE_PATH = 'update/:receptionNumber'; // 문의 내역 업데이트

export const RENT_PATH = 'rent'; // 대여화면

export const MYPAGE_PATH = 'mypage'; //마이페이지 화면
export const MYPAGE_PROFILE_PATH = 'mypage/profile'; //프로필 화면
export const MYPAGE_RENT_DETAIL_PATH = 'mypage/rent-detail'; //대여내역 화면
export const MYPAGE_UNREGISTER_PATH = 'mypage/unregister'; //회원탈퇴 화면

// description : Navigation 절대 URL PATH
export const RDRG_ABSOLUTE_PATH = RDRG_PATH; // 공통 레이아웃 절대 경로
export const HOME_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}`; // 홈화면 절대경로
export const AUTH_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${AUTH_PATH}`; // 로그인 , 회원가입 화면 절대경로

export const HOME_COMPANY_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_COMPANY_PATH}`; // 회사소개 화면 절대경로
export const HOME_CLAUSE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_CLAUSE_PATH}`;   // 이용약관 화면 절대경로
export const HOME_POLICY_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_POLICY_PATH}`;   // 개인정보처리방침 화면 절대경로
export const HOME_PLACE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_PLACE_PATH}`;     // 지점안내 화면 절대경로

export const CUSTOMER_SUPPORT_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${CUSTOMER_SUPPORT_PATH}`; // 고객지원 화면 절대경로
export const CUSTOMER_SUPPORT_WRITE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${CUSTOMER_SUPPORT_PATH}/${CUSTOMER_SUPPORT_WRITE_PATH}`;
export const CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH = (receptionNumber: string | number) => `${CUSTOMER_SUPPORT_PATH}/${CUSTOMER_SUPPORT_DETAIL_PATH}/${receptionNumber}`;
export const CUSTOMER_SUPPORT_UPDATE_ABSOLUTE_PATH = (receptionNumber: string | number) => `${CUSTOMER_SUPPORT_PATH}/${CUSTOMER_SUPPORT_UPDATE_PATH}/update/${receptionNumber}`;

export const RENT_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${RENT_PATH}`; // 대여화면 절대경로

export const MYPAGE_PROFILE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${MYPAGE_PATH}/${MYPAGE_PROFILE_PATH}`; // 프로필 화면 절대경로
export const MYPAGE_RENT_DETAIL_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${MYPAGE_PATH}/${MYPAGE_RENT_DETAIL_PATH}`; // 대여내역 화면 절대경로
export const MYPAGE_UNREGISTER_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${MYPAGE_PATH}/${MYPAGE_UNREGISTER_PATH}`; // 회원탈퇴 화면 절대경로

// description : API URL PATH
// 도메인 및 기본 경로
export const SERVER_DOMAIN_URL = 'http://localhost:4500';
export const SERVER_API_URL = `${SERVER_DOMAIN_URL}/rdrg`;
export const SERVER_AUTH_MODULE_URL = `${SERVER_API_URL}/auth`;

// 로그인, 회원가입
export const SIGN_IN_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-in`;
export const ID_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/id-check`;
export const EMAIL_AUTH_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth`;
export const EMAIL_AUTH_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth-check`;
export const SIGN_UP_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-up`;

// 유저 정보 반환 
export const SERVER_USER_MODULE_URL = `${SERVER_API_URL}/user`;
export const GET_SIGN_IN_USER_REQUEST_URL = `${SERVER_USER_MODULE_URL}/`;

// 문의 게시판 반환
export const SERVER_BOARD_MODULE_URL = `${SERVER_API_URL}/board`;
export const POST_BOARD_REQUEST_URL = `${SERVER_BOARD_MODULE_URL}/`;
export const POST_COMMENT_REQUEST_URL = (receptionNumber: number | string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}/comment`;
export const GET_BOARD_LIST_URL = `${SERVER_BOARD_MODULE_URL}/list`;

// 게시판 불러오기
export const GET_BOARD_URL = (receptionNumber: number | string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}`;
// 게시판 수정
export const PUT_BOARD_URL = (receptionNumber: number | string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}`;
// 게시판 삭제
export const DELETE_BOARD_URL = (receptionNumber: number | string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}`;

// 대여할 기기 리스트 불러오기
export const SERVER_DEVICE_MODULE_URL = `${SERVER_API_URL}/device`;
export const POST_DEVICE_URL = `${SERVER_DEVICE_MODULE_URL}/`

// description: 게시물 상수
export const COUNT_PER_PAGE = 5;
export const COUNT_PER_SECTION = 5;


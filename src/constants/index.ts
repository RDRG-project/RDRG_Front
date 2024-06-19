// description : Navigation URL PATH //
export const RDRG_PATH = '/rdrg'; // 공통 레이아웃
export const HOME_PATH = 'home'; // 홈화면
export const SNS_PATH = '/sns/:accessToken/:expires'; // sns 화면
export const AUTH_PATH = 'auth'; // 로그인 , 회원가입 화면

export const HOME_COMPANY_PATH = 'company'; // 회사소개
export const HOME_CLAUSE_PATH = 'clause'; // 이용약관
export const HOME_POLICY_PATH = 'policy'; // 개인정보처리방침
export const HOME_PLACE_PATH = 'place'; // 지점안내

export const CUSTOMER_SUPPORT_PATH = 'customer-support'; //고객지원 화면
export const CUSTOMER_SUPPORT_WRITE_PATH = 'write'; //문의 내역 글쓰기
export const CUSTOMER_SUPPORT_DETAIL_PATH = ':receptionNumber'; // 문의 내역 상세
export const CUSTOMER_SUPPORT_UPDATE_PATH = 'update/:receptionNumber'; // 문의 내역 수정

export const RENT_PATH = 'rent'; // 대여화면
export const RENT_ADD_PATH = 'add'; //대여 추가화면
export const RENT_SUCCESS_PATH = 'pay/success'; // 대여 성공화면
export const RENT_FAIL_PATH = 'pay/fail/:rentNumber'; // 대여 실패 화면
export const RENT_CANCEL_PATH = 'pay/cancel/:rentNumber'; // 결제 취소 화면

export const MYPAGE_PATH = 'mypage'; //마이페이지 화면
export const MYPAGE_PROFILE_PATH = 'profile'; //프로필 화면
export const MYPAGE_RENT_DETAIL_PATH = 'myrentpage'; //나의 대여내역 화면
export const MYPAGE_DETAILS_PATH = ':rentNumber'; //나의 대여 상세내역 화면
export const MYPAGE_UNREGISTER_PATH = 'unregister'; //회원탈퇴 화면

// description : Navigation 절대 URL PATH //
export const RDRG_ABSOLUTE_PATH = RDRG_PATH; // 공통 레이아웃 절대 경로
export const HOME_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}`; // 홈화면 절대경로
export const HOME_COMPANY_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_COMPANY_PATH}`; // 회사소개 화면 절대경로
export const HOME_CLAUSE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_CLAUSE_PATH}`;   // 이용약관 화면 절대경로
export const HOME_POLICY_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_POLICY_PATH}`;   // 개인정보처리방침 화면 절대경로
export const HOME_PLACE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${HOME_PATH}/${HOME_PLACE_PATH}`;     // 지점안내 화면 절대경로

export const AUTH_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${AUTH_PATH}`; // 로그인 , 회원가입 화면 절대경로

export const CUSTOMER_SUPPORT_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${CUSTOMER_SUPPORT_PATH}`; // 고객지원 화면 절대경로
export const CUSTOMER_SUPPORT_WRITE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${CUSTOMER_SUPPORT_PATH}/${CUSTOMER_SUPPORT_WRITE_PATH}`; // 문의 내역 글쓰기 화면 절대경로
export const CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH = (receptionNumber: string | number) => `${RDRG_ABSOLUTE_PATH}/${CUSTOMER_SUPPORT_PATH}/${receptionNumber}`; // 문의 내역 상세 화면 절대경로
export const CUSTOMER_SUPPORT_UPDATE_ABSOLUTE_PATH = (receptionNumber: string | number) => `${RDRG_ABSOLUTE_PATH}/${CUSTOMER_SUPPORT_PATH}/update/${receptionNumber}`; // 문의 내역 수정 화면 절대경로

export const RENT_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${RENT_PATH}`; // 대여화면 절대경로

export const RENT_ADD_ABSOLUTE_PATH = `${RENT_ABSOLUTE_PATH}/${RENT_ADD_PATH}`; // 기기추가 절대 경로

export const MYPAGE_PROFILE_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${MYPAGE_PATH}/${MYPAGE_PROFILE_PATH}`; // 프로필 화면 절대경로
export const MYPAGE_RENT_DETAIL_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${MYPAGE_PATH}/${MYPAGE_RENT_DETAIL_PATH}`; // 나의 대여내역 화면 절대경로
export const MYPAGE_DETAILS_ABSOLUTE_PATH = (rentNumber: string | number) => `${RDRG_ABSOLUTE_PATH}/${MYPAGE_PATH}/${MYPAGE_RENT_DETAIL_PATH}/${rentNumber}`; // 나의 대여 상세내역 화면 절대경로
export const MYPAGE_UNREGISTER_ABSOLUTE_PATH = `${RDRG_ABSOLUTE_PATH}/${MYPAGE_PATH}/${MYPAGE_UNREGISTER_PATH}`; // 회원탈퇴 화면 절대경로

// description : API URL PATH //
//! 도메인 및 기본 경로
export const SERVER_DOMAIN_URL = 'http://localhost:4500';
export const SERVER_API_URL = `${SERVER_DOMAIN_URL}/rdrg`;

//* Auth 모듈
export const SERVER_AUTH_MODULE_URL = `${SERVER_API_URL}/auth`;
// 로그인
export const POST_SIGN_IN_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-in`;
export const SNS_SIGN_IN_REQUEST_URL = (type: string) => `${SERVER_AUTH_MODULE_URL}/oauth2/${type}`;
// 아이디 중복 확인
export const POST_ID_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/id-check`;
// 이메일 인증
export const POST_EMAIL_AUTH_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth`;
// 이메일 인증 확인
export const POST_EMAIL_AUTH_CHECK_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/email-auth-check`;
// 회원 가입
export const POST_SIGN_UP_REQUEST_URL = `${SERVER_AUTH_MODULE_URL}/sign-up`;

//* User 모듈
export const SERVER_USER_MODULE_URL = `${SERVER_API_URL}/user`;
// 로그인 유저 정보 반환
export const GET_SIGN_IN_USER_REQUEST_URL = `${SERVER_USER_MODULE_URL}/`;
// 개인정보 불러오기
export const GET_USER_INFO_URL = (userId: string) => `${SERVER_USER_MODULE_URL}/${userId}`;
// 비밀번호 변경하기
export const PATCH_PASSWORD_URL = `${SERVER_USER_MODULE_URL}/changePw`;
// 회원 탈퇴
export const DELETE_USER_URL = (userId: string) => `${SERVER_USER_MODULE_URL}/${userId}`;

//* FileUpload 모듈
export const SERVER_FILE_UPLOAD_URL = `${SERVER_API_URL}/file`;
// 파일 업로드
export const POST_UPLOAD_URL = `${SERVER_FILE_UPLOAD_URL}/upload`;
// 파일 불러오기
export const GET_FILE_CALL_URL = (fileName: number| string) => `${SERVER_FILE_UPLOAD_URL}/${fileName}`;

//* payment 모듈
export const SERVER_PAYMENT_MODULE_URL = `${SERVER_API_URL}/payment`;
// 결제 정보 저장
export const POST_PAYMENT_SAVE_REQUEST_URL = `${SERVER_PAYMENT_MODULE_URL}/save`;
// 예약정보 확인
export const GET_RESERVE_REQUEST_URL = (userId: string) => `${SERVER_PAYMENT_MODULE_URL}/${userId}`;
// 나의 대여 내역(사용자) 불러오기
export const GET_MYRENTPAGE_URL = `${SERVER_PAYMENT_MODULE_URL}/myrentpage`;
// 관리자 전체 대여내역 불러오기
export const GET_ADMIN_RENT_PAGE = `${SERVER_PAYMENT_MODULE_URL}/adminrentpage`;
// 관리자 검색대여 내역 불러오기
export const GET_ADMIN_SEARCH_WORD = `${SERVER_PAYMENT_MODULE_URL}/adminrent/search`;
// 대여 상태 변경
export const PATCH_RENT_STATUS = (rentNumber: number | string) => `${SERVER_PAYMENT_MODULE_URL}/${rentNumber}`;
// 대여 상세내역 불러오기
export const GET_RENT_DETAIL_URL = (rentNumber: number| string) => `${GET_MYRENTPAGE_URL}/${rentNumber}`;
// 대여내역 삭제
export const DELETE_RENT_CANCEL = (rentNumber: string | number) => `${SERVER_PAYMENT_MODULE_URL}/${rentNumber}`;

//* device 모듈
export const SERVER_DEVICE_MODULE_URL = `${SERVER_API_URL}/device`;
// 기기 리스트 불러오기
export const GET_DEVICE_URL = `${SERVER_DEVICE_MODULE_URL}/list`;
// IT 기기 추가
export const POST_IT_ADD_URL = `${SERVER_DEVICE_MODULE_URL}/`;
// 예약 가능한 기기 리스트 불러오기
export const GET_RENT_POSSIBILITY_LIST_URL = `${SERVER_DEVICE_MODULE_URL}/list`;
// 관리자 권한 기기 리스트 불러오기
export const GET_ADMIN_LIST = `${SERVER_DEVICE_MODULE_URL}/adminlist`;
// IT 기기 삭제
export const DELETE_IT_URL = (serialNumber: number | string) => `${SERVER_DEVICE_MODULE_URL}/${serialNumber}`;

//* 문의게시판(board) 모듈
export const SERVER_BOARD_MODULE_URL = `${SERVER_API_URL}/board`;
// 문의 게시물 작성
export const POST_BOARD_REQUEST_URL = `${SERVER_BOARD_MODULE_URL}/`;
// 문의 게시판 리스트 불러오기
export const GET_BOARD_LIST_URL = `${SERVER_BOARD_MODULE_URL}/list`;
// 문의 게시물 불러오기
export const GET_BOARD_URL = (receptionNumber: number| string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}`;
// 문의게시판 게시물 답글 작성
export const POST_COMMENT_REQUEST_URL = (receptionNumber: number | string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}/comment`;
// 게시판 수정
export const PUT_BOARD_URL = (receptionNumber: number | string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}`;
// 게시판 삭제
export const DELETE_BOARD_URL = (receptionNumber: number | string) => `${SERVER_BOARD_MODULE_URL}/${receptionNumber}`;


// description: 게시물 상수 //
export const COUNT_PER_PAGE = 5;
export const COUNT_PER_SECTION = 5;

export const USER_RENT_LIST_COUNT_PER_PAGE = 3;
export const ADMIN_RENT_LIST_COUNT_PER_PAGE = 10;

// description: 패턴 형식 //
export const ID_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,23}$/;
export const EMAIL_PATTERN = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=\[\]{}|\\;:‘“<>.,?\/]).{8,19}$/;
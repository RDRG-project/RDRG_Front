// description: 로그인 Request Body DTO 
export interface PostSignInRequestDto {
    userId: string;
    userPassword: string;
}

// description: 아이디 중복 확인 Request Body DTO 
export interface PostIdCheckRequestDto {
    userId: string;
}

// description: 이메일 중복 확인 및 인증메일 전송 Request Body DTO 
export interface PostEmailAuthRequestDto {
    userEmail: string;
}

// description: 이메일 인증 확인 Request Body DTO 
export interface PostEmailAuthCheckRequestDto {
    userEmail: string;
    authNumber: string;
}

// description: 회원가입 Request Body Dto 
export interface PostSignUpRequestDto {
    userId: string;
    userPassword: string;
    userEmail: string;
    authNumber: string;
}
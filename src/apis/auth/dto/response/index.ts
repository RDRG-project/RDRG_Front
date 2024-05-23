import ResponseDto from "src/apis/response.dto";

// description: 로그인 Response Body DTO 
export interface SignInResponseDto extends ResponseDto {
    accessToken: string;
    expires: number;
}

export interface UserInfoResponseDto extends ResponseDto {
    userId: string;
    userEmail: string;
}
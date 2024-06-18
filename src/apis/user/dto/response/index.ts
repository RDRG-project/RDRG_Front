import ResponseDto from "src/apis/response.dto";

// description : 로그인 유저 정보 불러오기 Response Body Dto
export interface GetSignInUserResponseDto extends ResponseDto{
    userId: string;
    userRole: string;
}

// description : 유저 정보 불러오기 Response Body Dto
export interface GetPersonalInfoResponseDto extends ResponseDto {
    userId: string;
    userEmail: string;
}
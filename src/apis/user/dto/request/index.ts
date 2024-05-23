// description: 비밀번호 변경하기 Request Body DTO 
export interface ChangePWRequestDto {
    userPassword: string;
    newUserPassword: string;
}
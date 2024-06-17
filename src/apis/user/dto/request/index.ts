// description: 비밀번호 변경하기 Request Body DTO 
export interface GetChangePWRequestDto {
    userId: string;
    userPassword: string;
    newUserPassword: string;
}
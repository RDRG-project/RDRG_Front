// description: 결제 정보 저장 Request Body DTO //
export interface PostPaymentSaveRequestDto {
    rentUserId: string;
    rentSerialNumber: string[];
    rentPlace: string;
    rentReturnPlace : string;
    rentDatetime: string;
    rentReturnDatetime: string;
    rentTotalPrice : number;
    rentStatus:string;
}

// description: 대여 상태 변경 Request Body DTO //
export interface GetRentStatusRequestDto {
    rentStatus: string;
}
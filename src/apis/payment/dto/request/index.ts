
// description: 결제 정보 저장 Request Body DTO //
export interface PostPaymentSaveRequestDto {
    rentUserId: string;
    rentSerialNumber: string[];
    rentPlace: string;
    rentReturnPlace : string;
    rentDatetime: Date | null;
    rentReturnDatetime: Date | null;
    rentTotalPrice : number;
    rentStatus:boolean;
}

// description: 결제 정보 저장 Request Body DTO //
export interface PutBoardRequestDto {
    userId: string;
    serialNumber: string[];
    rentPlace: string;
    rentReturnPlace : string;
    rentDatetime: string;
    rentReturnDatetime : string;
    totalPrice : number;
}
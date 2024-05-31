import ResponseDto from "src/apis/response.dto";
import { RentDetailList, RentItem, RentalPeriod } from "src/types";

export interface ReserveResponseDto extends ResponseDto {
    userId: string;
    rentalPeriod : string;
    rentPlace:string;
    rentTotalPrice: number;
}

export interface GetMyRentPageResponseDto extends ResponseDto {
    rentList: RentItem[];
}

export interface GetRentDetailResponseDto extends ResponseDto {
    rentNumber : number;
    rentDetailList : RentDetailList[];
    rentDatetime : string;
    rentReturnDatetime : string;
    rentStatus : boolean;
    rentPlace : string;
    rentReturnPlace : string;
    rentTotalPrice : number;
}

export interface PostPaymentResponseDto extends ResponseDto {
    tid: string;
    nextRedirectMobileUrl: string;
    nextRedirectPcUrl: string;
    partnerOrderId: string | null;
}
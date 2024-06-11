import ResponseDto from "src/apis/response.dto";
import { AdminRentItem, RentDetailList, RentItem, RentalPeriod } from "src/types";

// 나의 예약정보 확인 ResponseDto 
export interface ReserveResponseDto extends ResponseDto {
    userId: string;
    rentalPeriod : string;
    rentPlace:string;
    rentTotalPrice: number;
}

// 나의 대여 내역 불러오기 ResponseDto
export interface GetMyRentPageResponseDto extends ResponseDto {
    rentList: RentItem[];
}

// 관리자용 전체 대여 내역 불어오기 ResponseDto
export interface GetAdminRentPageResponseDto extends ResponseDto {
    adminRentList: AdminRentItem[];
}

export interface GetRentDetailResponseDto extends ResponseDto {
    rentNumber : number;
    rentDetailList : RentDetailList[];
    rentDatetime : string;
    rentReturnDatetime : string;
    rentStatus : string;
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
import ResponseDto from "src/apis/response.dto";

import { AdminRentItem, RentDetailList, RentItem, RentalPeriod } from "src/types";

// description: 나의 예약정보 확인(사용자) Response Body DTO //
export interface ReserveResponseDto extends ResponseDto {
    userId: string;
    rentalPeriod : string;
    rentPlace:string;
    rentTotalPrice: number;
}

// description: 나의 대여 내역 불러오기 Response Body DTO //
export interface GetMyRentPageResponseDto extends ResponseDto {
    rentList: RentItem[];
}

// description: 상세 대여 내역 불러오기 Response Body DTO //
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

// description: 관리자용 전체 대여 내역 불어오기 ResponseDto //
export interface GetAdminRentPageResponseDto extends ResponseDto {
    adminRentList: AdminRentItem[];
}

// description: 결제 완료 ResponseDto //
export interface PostPaymentResponseDto extends ResponseDto {
    tid: string;
    nextRedirectMobileUrl: string;
    nextRedirectPcUrl: string;
    partnerOrderId: string | null;
}
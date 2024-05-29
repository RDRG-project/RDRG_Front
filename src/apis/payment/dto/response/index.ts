import ResponseDto from "src/apis/response.dto";
import { RentDetailList, RentItem, RentalPeriod } from "src/types";

export interface ReserveResponseDto extends ResponseDto {
    userId: string;
    rentalPeriod : RentalPeriod[];
    rentPlace:String;
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
    rentTotalPrice : number;
}
import ResponseDto from "src/apis/response.dto";
import { RentItem, RentalPeriod } from "src/types";

export interface ReserveResponseDto extends ResponseDto {
    userId: string;
    rentalPeriod : RentalPeriod[];
    rentPlace:String;
    rentTotalPrice: number;
}

export interface GetMyRentPageResponseDto extends ResponseDto {
    rent: RentItem[];
}
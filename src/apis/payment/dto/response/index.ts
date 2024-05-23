import ResponseDto from "src/apis/response.dto";
import { DeviceListItem, RentItem, RentalPeriod } from "src/types";

export interface ReserveResponseDto extends ResponseDto {
    userId: string;
    rentalPeriod : RentalPeriod[];
    rentPlace:String;
    rentTotalPrice: number;
}

export interface RentPageResponseDto extends ResponseDto {
    rent: RentItem[];
}

export interface DeviceListResponseDto extends ResponseDto {
    deviceList: DeviceListItem[]
}
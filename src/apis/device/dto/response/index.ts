import ResponseDto from "src/apis/response.dto";
import { DeviceListItem, ItRentList } from "src/types";

export interface GetDeviceListResponseDto extends ResponseDto {
    deviceList: ItRentList[];
}

export interface DeviceListResponseDto extends ResponseDto {
    deviceList: DeviceListItem[]
}
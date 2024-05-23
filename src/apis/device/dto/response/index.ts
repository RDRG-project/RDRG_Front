import ResponseDto from "src/apis/response.dto";
import { ItRentList } from "src/types";

export interface GetDeviceListResponseDto extends ResponseDto {
    itRentList: ItRentList[];
}
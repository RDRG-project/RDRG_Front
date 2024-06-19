import ResponseDto from "src/apis/response.dto";

import { DeviceListItem } from "src/types";

// description: 예약 가능한 기기 리스트 불러오기 Response Body DTO //
export interface GetDeviceListResponseDto extends ResponseDto {
    deviceList: DeviceListItem[]
}
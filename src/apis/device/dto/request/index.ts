// description: device 리스트 불러오기 Request Body DTO //
export interface DeviceListRequestDto {
    rentNumber: number;
    rentUserId: string;
    rentSerialNumber: string;
    rentDatetime: string;
    rentReturnDatetime: string;
    rentPlace: string;
    rentTotalPrice: number;
    rent_status: boolean;
}

// description: device 선택한 종류에 따른 전체 불러오기 Request Body DTO //
export interface DeviceListRequestDto {
    rentNumber: number;
    rentUserId: string;
    rentSerialNumber: string;
    rentTotalPrice: number;
    rent_status: boolean;
}
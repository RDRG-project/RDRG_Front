// description: IT 기기 추가 Request Body DTO //
export interface DeviceADDRequestDto {
    serialNumber: string;
    model: string;
    name: string;
    deviceExplain: string;
    type: string;
    price: number;
}

// description: IT 기기 삭제 Request Body DTO //
export interface DeviceDeleteRequestDto {
    serialNumber: string;
}

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
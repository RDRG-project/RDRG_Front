// description board 모듈 (BoardListResponseDto)의 interface
export interface BoardListItem {
    receptionNumber: number;
    status: boolean;
    title: string;
    writerId: string;
    writeDatetime: string;
}

// description device (DeviceListResponseDto)의 interface
export interface DeviceListItem {
    serialNumber: string;
    model: string;
    name: string;
    deviceExplain?: string;
    type?: string;
    brand:string;
    price: number;
    devicesImgUrl?: string;
    place?:string;
}

// description payment 모듈 (MyRentPageResponseDto)의 interface
export interface RentItem {
    rentNumber : number;
    name: string[];
    rentDatetime: string;
    rentReturnDatetime : string;
    totalPrice  : number;
    rentStatus: string;
}

// description payment 모듈 (RentDetailResponseDto)의 interface
export interface RentDetailList{
    name : string;
    price : number;
}

// description payment 모듈 (AdminRentPageResponseDto)의 interface
export interface AdminRentItem {
    rentNumber: number;
    userId?: string;
    name: string[];
    rentDatetime: string;
    rentReturnDatetime: string;
    totalPrice: number;
    rentStatus: string;
}

// description payment 모듈 (RentDetailResponseDto)의 interface
export interface RentalPeriod {
    rentalPeriod: string;
}







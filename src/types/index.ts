export interface BoardListItem {
    receptionNumber: number;
    status: boolean;
    title: string;
    writerId: string;
    writeDatetime: string;
}

export interface RentalPeriod {
    rentalPeriod: string;
}

export interface RentItem {
    rentNumber : number;
    name: string[];
    rentDatetime: string;
    rentReturnDatetime : string;
    totalPrice  : number;
    rentStatus: string;
}
export interface AdminRentItem {
    rentNumber: number;
    userId?: string;
    name: string[];
    rentDatetime: string;
    rentReturnDatetime: string;
    totalPrice: number;
    rentStatus: string;
}


export interface RentDetailList{
    name : string;
    price : number;
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

export interface ItRentList {
    serialNumber: string;
    model: string;
    name: string;
    // 설명 부분 좀 손봐야함
    deviceExplain?: string;
    type?: string;
    brand:string;
    price: number;
    devicesImgUrl?: string;
}

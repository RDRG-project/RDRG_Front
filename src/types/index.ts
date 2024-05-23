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
    type: string;
    rentDatetime: string;
    rentReturnDatetime: string;
    rentStatus: boolean;
}

export interface ItRentList {
    serialNumber: string;
    model?: string;
    name: string;
    deviceExplain?: string;
    type: string;
    brand?:string;
    price: number;
    devicesImgUrl?: string;
}
export interface BoardListItem {
    receptionNumber: number;
    status: boolean;
    title: string;
    writerId: string;
    writeDatetime: string;
}

export interface DeviceListItem {
    serialNumber: string;
    model: string;
    name: string;
    explain: string;
    type: string;
    price: number;
    // image: string;
}
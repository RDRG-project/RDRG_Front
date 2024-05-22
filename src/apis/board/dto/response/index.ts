import ResponseDto from "src/apis/response.dto";
import { BoardListItem, DeviceListItem } from "src/types";

export interface GetBoardListResponseDto extends ResponseDto {
    boardList: BoardListItem[];
}
export interface GetDeviceListResponseDto extends ResponseDto {
    deviceList: DeviceListItem[];
}
export interface GetBoardResponseDto extends ResponseDto {
    receptionNumber: number;
    status: boolean;
    title: string;
    writerId: string;
    writeDatetime: string;
    contents: string;
    comment: string | null;
}
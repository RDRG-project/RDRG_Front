import ResponseDto from "src/apis/response.dto";
import { BoardListItem } from "src/types";

// description: 문의 게시판 리스트 불러오기 Response Body DTO
export interface GetBoardListResponseDto extends ResponseDto {
    boardList: BoardListItem[];
}

// description: 뮨의 게시물 불러오기 Response Body DTO
export interface GetBoardResponseDto extends ResponseDto {
    receptionNumber: number;
    status: boolean;
    title: string;
    writerId: string;
    writeDatetime: string;
    contents: string;
    comment: string | null;
    imageUrl: string[];
}
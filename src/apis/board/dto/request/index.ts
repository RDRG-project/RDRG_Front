import { BoardFileItem } from "src/types";

// description: 문의 게시물 작성 및 수정 Request Body DTO //
export interface BoardRequestDto {
    title: string;
    contents: string;
    fileList: BoardFileItem[];
}

// description: 문의 게시물 답글 작성 Request Body DTO //
export interface PostCommentRequestDto {
    comment: string;
}
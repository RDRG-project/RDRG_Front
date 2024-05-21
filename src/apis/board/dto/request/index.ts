// description: Q&A 작성 Request Body DTO //
export interface PostBoardRequestDto {
    title: string;
    contents: string;
    urlList: string[];
}

// description: Q&A Comment Request Body DTO //
export interface PostCommentRequestDto {
    comment: string;
}

// description: Q&A 수정 Request Body DTO //
export interface PutBoardRequestDto {
    title: string;
    contents: string;
}
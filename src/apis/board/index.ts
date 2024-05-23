import axios from "axios";
import { DELETE_BOARD_URL, GET_BOARD_LIST_URL, GET_BOARD_URL, POST_BOARD_REQUEST_URL, POST_COMMENT_REQUEST_URL, PUT_BOARD_URL } from "src/constants";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import { GetBoardListResponseDto, GetBoardResponseDto } from "./dto/response";
import { PostBoardRequestDto, PostCommentRequestDto, PutBoardRequestDto } from "./dto/request";
import ResponseDto from "../response.dto";

// function: 문의 게시물 작성 API 함수
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_REQUEST_URL, requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 문의 게시판 리스트 불러오기 API 함수()
export const getBoardListRequest = async (accessToken: string) => {
    const result = await axios.get(GET_BOARD_LIST_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetBoardListResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 문의 게시물 불러오기 API 함수
export const getBoardRequest = async (receptionNumber: number | string, accessToken: string) => {
    const result = await axios.get(GET_BOARD_URL(receptionNumber), bearerAuthorization(accessToken))
        .then(requestHandler<GetBoardResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 문의게시판 게시물 답글 작성 API 함수
export const postCommentRequest = async (receptionNumber: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_REQUEST_URL(receptionNumber), requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: Q&A 게시물 삭제 API 함수
export const deleteBoardRequest = async (receptionNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(receptionNumber), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: Q&A 게시물 수정 API 함수
export const putBoardRequest = async (receptionNumber: number | string, requestBody: PutBoardRequestDto, accessToken: string) => {
    const result = await axios.put(PUT_BOARD_URL(receptionNumber), requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
};


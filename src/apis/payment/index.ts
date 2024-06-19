import axios from "axios"

import ResponseDto from "../response.dto"
import { bearerAuthorization, requestErrorHandler, requestHandler } from ".."
import { GetRentStatusRequestDto, PostPaymentSaveRequestDto } from "./dto/request"
import { GetAdminRentPageResponseDto, GetMyRentPageResponseDto, GetRentDetailResponseDto, ReserveResponseDto } from "./dto/response"

import { DELETE_RENT_CANCEL, GET_ADMIN_RENT_PAGE, GET_ADMIN_SEARCH_WORD, GET_MYRENTPAGE_URL, GET_RENT_DETAIL_URL, GET_RESERVE_REQUEST_URL, PATCH_RENT_STATUS, POST_PAYMENT_SAVE_REQUEST_URL } from "src/constants"

// function: 결제 정보 저장 API 함수 //
export const postPaymentSaveRequest = async (requestBody:PostPaymentSaveRequestDto, accessToken: string) => {
    const result = await axios.post(POST_PAYMENT_SAVE_REQUEST_URL,requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 예약정보 확인(사용자) API 함수 //
export const getReserveRequest = async (userId:string, accessToken: string) => {
    const result = await axios.get(GET_RESERVE_REQUEST_URL(userId)
        ,bearerAuthorization(accessToken))
        .then(requestHandler<ReserveResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 나의 대여 내역 불러오기 API 함수 //
export const getMyRentPageRequest = async (accessToken: string) => {
    const result = await axios.get(GET_MYRENTPAGE_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetMyRentPageResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 대여 상세 내역 불러오기 API 함수 //
export const getRentDetailRequest = async (rentNumber: number | string, accessToken: string) => {
    const result = await axios.get(GET_RENT_DETAIL_URL(rentNumber), bearerAuthorization(accessToken))
        .then(requestHandler<GetRentDetailResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 대여 삭제(결제취소)하기 API 함수 //
export const deleteRentCancelRequest = async (accessToken:string, rentNumber:number | string) => {
    const result = await axios.delete(DELETE_RENT_CANCEL(rentNumber), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 대여 상태 변경 API 함수 //
export const patchRentStatusRequest = async (accessToken: string, rentNumber: number | string, requestBody: GetRentStatusRequestDto ) => {
    const result = await axios.patch(PATCH_RENT_STATUS(rentNumber),requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 관리자용 전체 대여 내역 불러오기 API 함수 //
export const getAdminRentPageRequest = async (accessToken: string) => {
    const result = await axios.get(GET_ADMIN_RENT_PAGE, bearerAuthorization(accessToken))
        .then(requestHandler<GetAdminRentPageResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 관리자 검색 대여 내역 불러오기 API 함수 //
export const getAdminSearchWordRequest = async (word:string ,accessToken: string) => {
    const config = {...bearerAuthorization(accessToken), params: {word}};
    const result = await axios.get(GET_ADMIN_SEARCH_WORD, config)
        .then(requestHandler<GetAdminRentPageResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
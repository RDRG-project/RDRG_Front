import axios from "axios"
import { bearerAuthorization, requestErrorHandler, requestHandler } from ".."
import { DELETE_RENT_CANCEL, GET_MYRENTPAGE_URL, GET_RENT_DETAIL_URL, GET_RESERVE_REQUEST_URL, POST_PAYMENT_SAVE_REQUEST_URL } from "src/constants"
import { GetMyRentPageResponseDto, GetRentDetailResponseDto, ReserveResponseDto } from "./dto/response"
import ResponseDto from "../response.dto"
import { PostPaymentSaveRequestDto } from "./dto/request"

// function: 결제 정보 저장 API 함수
export const postPaymentSaveRequest = async (requestBody:PostPaymentSaveRequestDto, accessToken: string) => {
    const result = await axios.post(POST_PAYMENT_SAVE_REQUEST_URL,requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
};

// function: 예약정보 확인 API 함수
export const getReserveRequest = async (userId:string, accessToken: string) => {
    const result = await axios.get(GET_RESERVE_REQUEST_URL(userId)
        ,bearerAuthorization(accessToken))
        .then(requestHandler<ReserveResponseDto>)
        .catch(requestErrorHandler)
    return result;
};

// function: 나의 대여 내역 불러오기 API 함수
export const getMyRentPageRequest = async (accessToken: string) => {
    const result = await axios.get(GET_MYRENTPAGE_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetMyRentPageResponseDto>)
        .catch(requestErrorHandler)
    return result;
};

// function: 대여 상세 내역 불러오기 API 함수
export const getRentDetailRequest = async (rentNumber: number | string, accessToken: string) => {
    const result = await axios.get(GET_RENT_DETAIL_URL(rentNumber), bearerAuthorization(accessToken))
        .then(requestHandler<GetRentDetailResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 대여 취소하기 API 함수
export const deleteRentCancelRequest = async (accessToken:string, rentNumber:number | string) => {
    const result = await axios.delete(DELETE_RENT_CANCEL(rentNumber), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
}

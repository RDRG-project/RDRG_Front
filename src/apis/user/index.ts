import axios from "axios";
import { DELETE_USER_URL, GET_SIGN_IN_USER_REQUEST_URL, GET_USER_INFO_URL, PATCH_PASSWORD_URL } from "src/constants";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import { GetSignInUserResponseDto, GetPersonalInfoResponseDto } from "./dto/response";
import { ChangePWRequestDto } from "./dto/request";
import ResponseDto from "../response.dto";

// function : 로그인 유저 정보 반환 API 함수
export const getSignInUserRequest = async (accessToken : string) => {
    const result = await axios.get(GET_SIGN_IN_USER_REQUEST_URL, bearerAuthorization(accessToken))
    .then(requestHandler<GetSignInUserResponseDto>)
    .catch(requestErrorHandler)
    return result;
};

// function : 로그인 유저 정보 불러오기 API 함수
export const getUserInfoRequest = async (userId: string, accessToken: string) => {
    const result = await axios.get(GET_USER_INFO_URL(userId), bearerAuthorization(accessToken))
        .then(requestHandler<GetPersonalInfoResponseDto>)
        .catch(requestErrorHandler)
    return result;
};

// function : 비밀번호 변경하기 API 함수
export const patchPasswordRequest = async(requestBody:ChangePWRequestDto , accessToken: string) => {
    const result = await axios.patch(PATCH_PASSWORD_URL, requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
};

// function : 회원 탈퇴 API 함수
export const deleteUserRequest = async (userId: string, accessToken: string) => {
    const result = await axios.delete(DELETE_USER_URL(userId), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
}

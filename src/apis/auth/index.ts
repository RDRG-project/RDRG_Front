import axios from "axios";

import ResponseDto from "../response.dto";
import { requestErrorHandler, requestHandler } from "..";
import { PostEmailAuthCheckRequestDto, PostEmailAuthRequestDto, PostIdCheckRequestDto, PostSignInRequestDto, PostSignUpRequestDto } from "./dto/request";
import { PostSignInResponseDto } from "./dto/response";

import { POST_EMAIL_AUTH_CHECK_REQUEST_URL, POST_EMAIL_AUTH_REQUEST_URL, POST_ID_CHECK_REQUEST_URL, POST_SIGN_IN_REQUEST_URL, POST_SIGN_UP_REQUEST_URL } from "src/constants";

// function: 로그인 API 함수 //
export const signInRequest = async (requestBody: PostSignInRequestDto) => {
    const result = await axios.post(POST_SIGN_IN_REQUEST_URL, requestBody)
        .then(requestHandler<PostSignInResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 아이디 중복 확인 API 함수 //
export const idCheckRequest = async (requestBody: PostIdCheckRequestDto) => {
    const result = await axios.post(POST_ID_CHECK_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 이메일 중복 확인 및 인증메일 전송 API 함수 //
export const emailAuthRequest = async (requestBody: PostEmailAuthRequestDto) => {
    const result = await axios.post(POST_EMAIL_AUTH_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 이메일 인증 확인 API 함수 //
export const emailAuthCheckRequest = async (requestBody: PostEmailAuthCheckRequestDto) => {
    const result = await axios.post(POST_EMAIL_AUTH_CHECK_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 회원가입 API 함수 //
export const signUpRequest = async (requestBody: PostSignUpRequestDto) => {
    const result = await axios.post(POST_SIGN_UP_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
import axios from "axios";

import ResponseDto from "../response.dto";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";

import { GET_FILE_CALL_URL, POST_UPLOAD_URL } from "src/constants";

// function : 파일 업로드 API 함수 //
export const postUploadRequest = async (accessToken:string) => {
    const result = await axios.post(POST_UPLOAD_URL, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function : 파일 불러오기 API 함수 //
export const getUserInfoRequest = async (fileName: number | string, accessToken:string) => {
    const result = await axios.get(GET_FILE_CALL_URL(fileName), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function : 이미지 업로드 API 함수 //
export const imageUploadRequest = async (data: FormData, accessToken: string) => {
    const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${accessToken}` } };
    const result = await axios.post(POST_UPLOAD_URL, data, config)
        .then((response) => response.data as string)
        .catch((error) => null);
    return result;
};
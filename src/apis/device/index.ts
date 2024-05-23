import axios from "axios";
import { DeviceADDRequestDto, DeviceDeleteRequestDto, DeviceListRequestDto } from "./dto/request";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import ResponseDto from "../response.dto";
import { DELETE_IT_URL, GET_DEVICE_URL, POST_IT_ADD_URL } from "src/constants";
import { GetDeviceListResponseDto } from "./dto/response";

// function: 기기 리스트 불러오기 API 함수
export const getDeviceRequest = async (accessToken: string) => {
    const result = await axios.get(GET_DEVICE_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetDeviceListResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: IT 기기 추가 API 함수
export const PostDeviceADDRequest = async(requestBody: DeviceADDRequestDto ,accessToken:string) => {
    const result = await axios.post(POST_IT_ADD_URL, requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: IT 기기 삭제 API 함수
export const DeleteDeviceRequest = async(requestBody: DeviceDeleteRequestDto ,serialNumber: number | string, accessToken:string) => {
    const result = await axios.post(DELETE_IT_URL(serialNumber), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
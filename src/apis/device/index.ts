import axios from "axios";
import { DeviceAddRequestDto, DeviceDeleteRequestDto } from "./dto/request";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import ResponseDto from "../response.dto";
import { DELETE_IT_URL,  GET_ADMIN_LIST,  GET_RENT_POSSIBILITY_LIST_URL,  POST_IT_ADD_URL } from "src/constants";
import { DeviceListResponseDto } from "./dto/response";

// function: IT 기기 추가 API 함수
export const PostDeviceAddRequest = async(requestBody: DeviceAddRequestDto ,accessToken:string) => {
    const result = await axios.post(POST_IT_ADD_URL, requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 대여 가능한 기기 리스트 불러오기 API 함수
export const getRentPossibilityListRequest = async(start:string, end:string, place:string, accessToken:string) => {
    const config = {...bearerAuthorization(accessToken), params: { start, end, place }}
    const result = await axios.get(GET_RENT_POSSIBILITY_LIST_URL, config)
        .then(requestHandler<DeviceListResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
// function: 관리자 권한의 기기 리스트 불러오기 API 함수
export const getAdminRentListRequest = async(accessToken: string) => {
    const result = await axios.get(GET_ADMIN_LIST, bearerAuthorization(accessToken))
        .then(requestHandler<DeviceListResponseDto>)
        .catch(requestErrorHandler);
    return result;
}

// function: IT 기기 삭제 API 함수
export const deleteDeviceRequest = async( serialNumber: number | string, accessToken:string) => {
    const result = await axios.delete(DELETE_IT_URL(serialNumber), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
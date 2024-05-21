import axios from "axios";
import { DeviceListRequestDto } from "./dto/request";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import ResponseDto from "../response.dto";
import { POST_DEVICE_URL } from "src/constants";

// function: device 전체 불러오기 API 함수
export const postDeviceRequest = async (requestBody: DeviceListRequestDto, accessToken: string) => {
    const result = await axios.post(POST_DEVICE_URL, requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
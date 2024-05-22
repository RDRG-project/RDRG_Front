import axios from "axios";
import { DeviceListRequestDto } from "./dto/request";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import ResponseDto from "../response.dto";
import { GET_DEVICE_URL } from "src/constants";
import { GetDeviceListResponseDto } from "../board/dto/response";

// function: device 전체 불러오기 API 함수
export const getDeviceRequest = async (accessToken: string) => {
    const result = await axios.get(GET_DEVICE_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetDeviceListResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

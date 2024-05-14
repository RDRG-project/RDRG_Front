import axios from "axios";
import { GET_BOARD_LIST_URL } from "src/constants";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import { GetBoardListResponseDto } from "./dto/response";

// function: Q&A 전체 리스트 불러오기 API 함수
export const getBoardListRequest = async (accessToken: string) => {
    const result = await axios.get(GET_BOARD_LIST_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetBoardListResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
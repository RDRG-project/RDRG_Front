import useUserStore from 'src/stores/user.store'
import './style.css'
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GetBoardResponseDto } from 'src/apis/board/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { CUSTOMER_SUPPORT_ABSOLUTE_PATH, CUSTOMER_SUPPORT_UPDATE_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH } from 'src/constants';
import { deleteBoardRequest, postCommentRequest, getBoardRequest } from 'src/apis/board';
import { PostCommentRequestDto } from 'src/apis/board/dto/request';
import axios from 'axios';

//                    component                    //
export default function SupportDetail () {

    //                    state                    //
    const { loginUserId, loginUserRole } = useUserStore();
    const { receptionNumber } = useParams();

    const [cookies] = useCookies();
    const [title, setTitle] = useState<string>('');
    const [writerId, setWriterId] = useState<string>('');
    const [writeDate, setWriterDate] = useState<string>('');
    const [contents, setContents] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);
    const [comment, setComment] = useState<string | null>(null);
    const [commentRows, setCommentRows] = useState<number>(1);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    
    //                    function                    //
    const navigator = useNavigate();

    const getBoardResponse = (result: GetBoardResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 접수번호입니다.' : 
            result.code === 'NB' ? '존재하지 않는 접수번호입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') {
                navigator(HOME_ABSOLUTE_PATH);
                return;
            }
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
            return;
        }

        const { title, writerId, writeDatetime, contents, status, comment, imageUrl } = result as GetBoardResponseDto;
        setTitle(title);
        setWriterId(writerId);
        setWriterDate(writeDatetime);
        setContents(contents);
        setStatus(status);
        setComment(comment);
        setImageUrls(imageUrl);
    };

    const postCommentResponse = (result: ResponseDto | null) => {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '입력 데이터가 올바르지 않습니다.' :
            result.code === 'NB' ? '존재하지 않는 게시물입니다.' :
            result.code === 'WC' ? '이미 답글이 작성된 게시물입니다.' : 
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }
    
        if (!receptionNumber || !cookies.accessToken) return;
        getBoardRequest(receptionNumber, cookies.accessToken).then(getBoardResponse);
    } ;

    const deleteBoardResponse = (result: ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'VF' ? '올바르지 않은 접수 번호입니다.' :
            result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);

    };

    //                    event handler                    //
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (status || loginUserRole !== 'ROLE_ADMIN') return;
        const comment = event.target.value;
        setComment(comment);

        const commentRows = comment.split('\n').length;
        setCommentRows(commentRows);
    };

    const onCommentSubmitClickHandler = () => {
        if (!comment || !comment.trim() ) return;
        if (!receptionNumber || loginUserRole !== 'ROLE_ADMIN' || !cookies.accessToken) return;

        const requestBody: PostCommentRequestDto = { comment};
        postCommentRequest(receptionNumber, requestBody, cookies.accessToken).then(postCommentResponse);
    };

    const onListClickHandler = () => {
        navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
    };

    const onUpdateClickHandler = () => {
        if (!receptionNumber || loginUserId !== writerId || status) return;
        navigator(CUSTOMER_SUPPORT_UPDATE_ABSOLUTE_PATH(receptionNumber));
    };

    const onDeleteClickHandler = () => {
        if (!receptionNumber || loginUserId !== writerId || !cookies.accessToken) return;
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        deleteBoardRequest(receptionNumber, cookies.accessToken).then(deleteBoardResponse);
    };

    const openImageInNewWindow = (imageUrl: string) => {
        window.open(imageUrl, 'blank', 'width=auto,height=auto');
    };

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken || !receptionNumber) return;
        getBoardRequest(receptionNumber, cookies.accessToken).then(getBoardResponse);
    }, []);

    //                    render                    //
    const coveredWriterId = writerId !== '' && (writerId[0] + '*'.repeat(writerId.length - 1));
    return (
        <>
            <div className='cs-image'>문의게시판</div>
            <div id='cs-detail-wrapper'>
                <div className='cs-detail-main-box'>
                    <div className='cs-detail-info-box'>
                        <div className='cs-detail-info-divider'>{'\|'}</div>
                        <div className='cs-detail-info'>작성일 {writeDate}</div>
                        <div className='cs-detail-info-divider'>{'\|'}</div>
                        <div className='cs-detail-info'>작성자 {coveredWriterId}</div>
                        <div className='cs-detail-info-divider'>{'\|'}</div>
                    </div>
                    <div className='cs-detail-top-box'>
                        <div className='cs-detail-title-container'>
                            <div className='cs-detail-title'>제목</div>
                            <div className='cs-detail-title-box'>{title}</div>
                        </div>
                        <div className='cs-detail-contents-container'>
                            <div className='cs-detail-contents-title'>내용</div>
                            <div className='cs-detail-contents-box'>{contents}</div>
                        </div>                        
                        {imageUrls.length > 0 && (
                        <div className="cs-write-bottom">
                            <div className='cs-write-bottom-title'>첨부파일</div>
                            <div className='cs-write-file-box'>
                                
                                <div>
                                <div className='cs-get-file-box'>
                                {imageUrls.map(url => (
                                <img key={url} src={url} width="50" height="auto"  onClick={() => openImageInNewWindow(url)} />
                                ))}
                                </div>
                                </div>

                            </div>
                        </div>
                        )}
                    </div>
                </div>
                {loginUserRole === 'ROLE_ADMIN' && !status && 
                    <div className='cs-detail-comment-textarea-box'>
                        <textarea style={{ height: `${28 * commentRows}px` }} className='cs-detail-comment-textarea' placeholder='답글을 작성해주세요.' value={comment == null ? '' : comment} onChange={onCommentChangeHandler} />
                    </div>
                }
                {status &&
                <div className='cs-detail-comment-box'>
                    <div className='cs-detail-comment-title'>답변</div>
                    <div className='cs-detail-comment'>{comment}</div>
                </div>
                }
                <div className='cs-detail-button-box'>
                    <div className='customer-support-button' onClick={onListClickHandler}>목록보기</div>
                    {loginUserRole === 'ROLE_ADMIN' && !status && 
                    <div className='customer-support-button' onClick={onCommentSubmitClickHandler}>답글달기</div>}
                    {loginUserId === writerId && loginUserRole === 'ROLE_USER' &&  
                    <div className='cs-detail-owner-button-box'>
                        {!status && <div className='customer-support-button' onClick={onUpdateClickHandler}>수정</div>}
                        <div className='customer-support-button' onClick={onDeleteClickHandler}>삭제</div>
                    </div>
                    }
                </div>
            </div>
        </>
    );
};
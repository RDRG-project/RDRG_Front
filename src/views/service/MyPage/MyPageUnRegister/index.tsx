import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import { useUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { deleteUserRequest } from 'src/apis/user';
import ResponseDto from 'src/apis/response.dto';
import { HOME_ABSOLUTE_PATH } from 'src/constants';
import { useNavigate } from 'react-router';

//                    component                    //
export default function MypageUnRegister() {

    //                    state                    //
    const { loginUserId, loginUserRole, logoutUser } = useUserStore();
    const [ cookies, setCookies, removeCookies ] = useCookies();
    const [userId, setUserId] = useState<string>('');
    const [isChecked ,setIsChecked] = useState<boolean>(false);

    //                    function                    //
    const navigator = useNavigate();

    const deleteUserResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 계정 정보입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }
        logoutUser();
        removeCookies('accessToken');
        navigator(HOME_ABSOLUTE_PATH);
    };

    //                    event handler                    //
    const onCheckBoxHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };    

    const userDeleteClickHandler = () => {
        if (loginUserId !== userId) return;
        const isConfirm = window.confirm('정말로 탈퇴하시겠습니까?')
        if (!isConfirm) return;
        deleteUserRequest(userId, cookies.accessToken).then(deleteUserResponse);
    };

    //                    effect                    //
    useEffect(() => {
        if (loginUserId) {
            setUserId(loginUserId);
        }
    }, [loginUserId]);
    
    //                    render                    //
    return (
        <div className='unregister-wrapper'>
            <div className='unregister-contents-title'>회원 탈퇴</div>
            <div className='unregister-contents-text'>
                <div><br/><ul><li>회원탈퇴 전, 유의사항을 확인해주시기 바랍니다.</li></ul></div>
                <div className='unregister-contents-text-detail'> 
                - 회원탈퇴 시 회원전용 웹 서비스 이용이 불가합니다.<br/>
                - 상법 및 '전자상거래 등에서 소비자 보호에 관한 법률' 등 관련 법령의 규정에 의하여 다음과 같이 ‘거래 관련 관리의무 관계 확인’ 등을 이유로 일정 기간 보관됩니다.
                    <br/>- 계약 또는 청약 철회 등에 관한 기록 : 5년
                    <br/>- 대금결제 및 재화 등의 공급에 관한 기록 : 5년
                    <br/>- 소비자의 불만 또는 분쟁 처리에 관한 기록 : 3년<br/>
                - 이미 결제가 완료된 건은 탈퇴로 취소되지 않습니다.<br/>
                <br/>
                </div>
            </div>
            <div className='unregister-contents-message'>계정삭제 시 모든 게시물이 삭제되며 복구 불가능합니다.</div>
            <div className='checkbox-container'>
                <input id = 'unregister-checkbox'type= "checkbox" onChange={onCheckBoxHandler} />
                <label className="unregister-cb" htmlFor="unregister-checkbox">동의합니다.</label>
            </div>
            <button className='final-check-button' onClick={userDeleteClickHandler} disabled={!isChecked}>탈 퇴 하 기</button>
        </div>
    );
}
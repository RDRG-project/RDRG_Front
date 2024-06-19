import { ChangeEvent, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

import InputBox from 'src/components/Inputbox';

import ResponseDto from 'src/apis/response.dto';
import { getUserInfoRequest, patchPasswordRequest } from 'src/apis/user';
import { GetChangePWRequestDto } from 'src/apis/user/dto/request';
import { GetPersonalInfoResponseDto } from 'src/apis/user/dto/response';

import { AUTH_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, HOME_PATH, MYPAGE_UNREGISTER_ABSOLUTE_PATH, PASSWORD_PATTERN } from 'src/constants';

import "./style.css";

//                    component                    //
export default function MypageProfile() {

    //                    state                    //
    const [cookies] = useCookies();

    const [userId, setUserId] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordCheck, setNewPasswordCheck] = useState<string>('');
    const [isPasswordPattern, setPasswordPattern] = useState<boolean>(false);
    const [isEqualPassword, setEqualPassword] = useState<boolean>(false);
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [changePasswordMessage, setChangePasswordMessage] = useState<string>('');

    //                    function                    //
    const navigator = useNavigate();

    const personalInfoResponseDto = (result: GetPersonalInfoResponseDto | ResponseDto | null) => {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 회원정보입니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(HOME_PATH); return;
        }

        const { userId, userEmail } = result as GetPersonalInfoResponseDto;

        setUserId(userId);
        setUserEmail(userEmail);
    };

    const patchPasswordResponse = (result: ResponseDto | null) => {
        
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 형식입니다.' :
            result.code === 'PCF' ? '비밀번호 변경에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(HOME_PATH); return;
        } else alert('비밀번호가 변경되었습니다.');

        setNewPassword(newPassword);
        navigator(HOME_ABSOLUTE_PATH);
    };

    //                     effect                    //
    useEffect(() => {
        if (!cookies.accessToken) {
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            setUserId('');
            setUserEmail('');

            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }

        getUserInfoRequest(userId, cookies.accessToken).then(personalInfoResponseDto);

    }, [cookies.accessToken, userId]);

    //                    event handler                    //
    const onUnRegisterClickHandler = () => navigator(MYPAGE_UNREGISTER_ABSOLUTE_PATH);

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setMessage('');
    };

    const onNewPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const passwordPattern = PASSWORD_PATTERN;
        const isPasswordPattern = passwordPattern.test(value);

        const passwordMessage =
            isPasswordPattern ? '' :
                value ? '영어 대소문자, 숫자, 특수문자(~.!@#$%^&*()_-=+[])를 각 1개씩 포함해서 9자 이상의 비밀번호를 입력하세요' : '';

        const isEqualPassword = newPasswordCheck === value;

        const passwordCheckMessage =
            isEqualPassword ? '' :
                newPasswordCheck ? '비밀번호가 일치하지 않습니다.' : '';
        
        setNewPassword(value);
        setPasswordPattern(isPasswordPattern);
        setPasswordMessage(passwordMessage);
        setEqualPassword(isEqualPassword);
        setPasswordCheckMessage(passwordCheckMessage);
    };

    const onNewPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const isEqualPassword = newPassword === value;

        const passwordCheckMessage =
            isEqualPassword ? '' :
                value ? '비밀번호가 일치하지 않습니다.' : '';

        setNewPasswordCheck(value);
        setEqualPassword(isEqualPassword);
        setPasswordCheckMessage(passwordCheckMessage);
    };

    const onChangePasswordClickHandler = () => {
        if (!isPasswordPattern || !isEqualPassword) {
            setChangePasswordMessage('비밀번호를 올바르게 입력해주세요.');
            return;
        }

        if(!cookies.accessToken) return;
        const requestBody : GetChangePWRequestDto = {
            userId: userId, 
            userPassword: password, 
            newUserPassword: newPassword
        }

        patchPasswordRequest(requestBody, cookies.accessToken).then(patchPasswordResponse);
    };

    //                    render                    //
    return (
        <div id='mp-profile-wrapper'>
            <div className='profile-detail'>
                <div className='profile-detail-content'>
                    <div className='profile-detail-title-id'>아이디</div>
                    <div className='mp-profile-detail-information'>{userId}</div>
                </div>
                <div className='profile-detail-content'>
                    <div className='profile-detail-title-email'>이메일</div>
                    <div className='mp-profile-detail-information'>{userEmail}</div>
                </div>
                <div className='profile-detail-content-password'>
                    <div className='profile-detail-title-password'>비밀번호</div>
                    <div className='profile-detail-password-input-container'>
                        <InputBox label="현재 비밀번호" type="password" value={password} placeholder="현재 비밀번호를 입력해주세요" onChangeHandler={onPasswordChangeHandler} message={message} error />
                        <InputBox label="새비밀번호" type="password" value={newPassword} placeholder="새비밀번호를 입력해주세요"
                            onChangeHandler={onNewPasswordChangeHandler} message={passwordMessage} error />
                        <InputBox label="비밀번호 확인" type="password" value={newPasswordCheck} placeholder="새비밀번호를 입력해주세요"
                            onChangeHandler={onNewPasswordCheckChangeHandler} message={passwordCheckMessage} error />
                        {changePasswordMessage && <div className='password-change-message'>{changePasswordMessage}</div>}
                    </div>
                </div>
            </div>
            <div className='mp-profile-button-container'>
                <div className='customer-support-button' onClick={onUnRegisterClickHandler}>회원탈퇴</div>
                <div className='customer-support-button' onClick={onChangePasswordClickHandler}>변경완료</div>
            </div>
        </div>
    );
};
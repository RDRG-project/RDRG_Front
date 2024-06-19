import './style.css'

//                    component                    //
export default function BranchInformation() {

    //                    render                    //
    return (
        <div id='place-wrapper'>
            <div>
                <h1 className='title'><strong>지점안내</strong></h1>
                <div className='place'>
                    <div className='place-seoul'>
                        <div className='place-seoul-title'>서울역 지점</div>
                        <div className='place-seoul-box'>
                            <div className='place-seoul-image'></div>
                            <div className='place-seoul-text'>
                                <h3><b>RDRG - 서울역 1번 출구</b></h3>
                                <hr /><p className='number-font'>TEL_02.0000.0000</p><p className='number-font'>FAX_02.0101.0101</p><hr />
                                <p>주소 : 서울 용산구 한강대로 405 서울역 1번 출구</p>
                                <p>운영시간 : 24시 연중무휴</p>
                                <p className='text-color'>※ 홈페이지를 통해 예약하시면 서비스 이용이 원활합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='place'>
                    <div className='place-busan'>
                        <div className='place-busan-title'>부산역 지점</div>
                        <div className='place-busan-box'>
                            <div className='place-busan-text'>
                                <h3><b>RDRG - 부산역 1번 출구</b></h3>
                                <hr /><p className='number-font'>TEL_051.0000.0000</p><p className='number-font'>FAX_051.0101.0101</p><hr />
                                <p>주소 : 부산 동구 중앙대로 206 부산역 1번 출구</p>
                                <p>운영시간 : 24시 연중무휴</p>
                                <p className='text-color'>※ 홈페이지를 통해 예약하시면 서비스 이용이 원활합니다.</p>
                            </div>
                            <div className='place-busan-image'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
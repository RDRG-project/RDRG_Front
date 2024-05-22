import React from 'react'
import './style.css'

export default function CompanyIntroduction() {
  return (
    <div id='company-wrapper'>
      <div className='company-main'>
        <h1 className='title'><strong>회사소개</strong></h1>
        <div className='sub-title'>CEO's MESSAGE
          <p className='sub-title-message'>최고의 서비스를 제공하기 위해 고민하고,<br></br>최상의 만족을 드리기 위해 최선을 다하겠습니다</p>
        </div>
        <div className='text'>
          <div className='company-image'></div>
          <div>IT 시대, 이제 사지말고 대여하세요</div> 
        </div>
      </div>
    </div>
  )
}

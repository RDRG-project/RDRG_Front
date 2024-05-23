import React from 'react'
import './style.css'

export default function CompanyIntroduction() {
  return (
    <div id='company-wrapper'>
      <div>
        <h1 className='title'><strong>회사소개</strong></h1>
        <div className='sub-title'>CEO's MESSAGE
          <p className='sub-title-message'>최고의 서비스를 제공하기 위해 고민하고,<br></br>최상의 만족을 드리기 위해 최선을 다하겠습니다</p>
        </div>
        <div className='text'>
          <div className='company-image'></div>
          <div className='text-message'>
            <b className='text-size'>안녕하십니까?<br></br>RDRG 서비스를 이용해주셔서 진심으로 감사합니다.</b>
            <p>저희 RDRG는 IT 기기 대여 서비스를 전문으로 하는 선도 기업입니다.</p>
            <p>저희 회사는 최신 기술과 트렌드를 반영한 다양한 IT 기기를 제공하여, 
              고객 여러분의 비즈니스와 개인 생활을 더욱 편리하고 효율적으로 만들어 드립니다. 
              노트북, 태블릿, 스마트폰, 데스크톱 등 다양한 제품군을 보유하고 있으며, 짧은 기간의 렌탈부터 
              장기 대여까지 고객의 필요에 맞춘 맞춤형 서비스를 제공합니다.</p>
            <p>저희 RDRG는 고객 만족을 최우선으로 생각하며, 최고의 품질과 신뢰성을 보장하기 위해 철저한 유지 보수와 관리에 힘쓰고 있습니다. 
              또한, 전문 상담사와 기술 지원 팀이 언제나 고객의 문의와 문제 해결을 도와드리며, IT 기기 사용에 대한 최적의 솔루션을 제안해드립니다.</p>
            <p>혁신적인 IT 솔루션으로 고객 여러분의 성공을 함께 만들어가는 파트너, RDRG를 믿고 선택해 주십시오. 감사합니다.</p>
          </div> 
        </div>
      </div>
    </div>
  )
}

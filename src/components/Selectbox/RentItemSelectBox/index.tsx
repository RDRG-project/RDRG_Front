import './style.css'

import React, { useState } from 'react'

//                    component                    //
export default function RentSelectBox() {

    const RentItemListItem = [
        { name : '노트북', value: 'noteBook'},
        { name : '태블릿', value: 'tablet'},
        { name : '게임기', value: 'game'},
        { name : '보조배터리', value: 'externalBattery'}
    ];

    //                    state                    //
    const [selectItItem, setSelectItItem] = useState<string>('');

    //                    event handler                    //
    const onSelectItemChangeHandler = (selectItItem: string ) => {
        setSelectItItem(selectItItem);
    }

    //                    render                    //
    return (
    <div>index</div>
    )
}

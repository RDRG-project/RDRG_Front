import React, { useState } from 'react'
import './style.css'
import { BasketListItems } from 'src/types';


//                    component                    //
export default function BasketBox() {

    //                    state                    //
    const [basketItems, setBasketItems] = useState<BasketListItems[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Example items
    const items = [
        { serialNumber: 1, type: 'noteBook', name: '삼성 노트북', price: 300000 },
        { serialNumber: 2, type: 'table', name: '아이패드', price: 200000 },
        { serialNumber: 3, type: 'game', name: '플레이스테이션', price: 480000 },
        { serialNumber: 4, type: 'battery', name: '샤오미배터리', price: 20000 },
    ];

    //                    event handler                    //
    const addItemToBasket = (item: BasketListItems) => {
        setBasketItems([...basketItems, item]);
        setTotalAmount(totalAmount + item.price);
    };

    // const removeItemFromBasket = (index: BasketListItems) => {
    //     const itemToRemove = basketItems[index];
    //     setBasketItems(basketItems.filter((_, i) => i !== index));
    //     setTotalAmount(totalAmount - itemToRemove.price);
    // };

    const clearBasket = () => {
        setBasketItems([]);
        setTotalAmount(0);
    };

    //                    render                    //
    return (
        <div id='selected-type-wrapper'>
            <div className='select-type-box'>
                {items.map((item) => (
                    <div key={item.serialNumber} className='selected-it'>
                        {item.type} 선택
                        <div className='selected-type'>type: {item.type}</div>
                        <button onClick={() => addItemToBasket(item)}>Add to Basket</button>
                    </div>
                ))}
            </div>
            <div className='payment-box'>
                <div className='payment-top-box'>
                    <div className='payment-count'>총 선택된 품목 개수: {basketItems.length}</div>
                    <div className='payment-basket-delete'>
                        <button onClick={clearBasket}>전체 삭제 버튼</button>
                    </div>
                </div>
                <div className='payment-sum'>금액: {totalAmount.toLocaleString()}원</div>
                <div className='basket-items'>
                    {basketItems.map((item, index) => (
                        <div key={index} className='basket-item'>
                            {item.type}: {item.price.toLocaleString()}원
                            {/* <button onClick={() => removeItemFromBasket(index)}>Remove</button> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

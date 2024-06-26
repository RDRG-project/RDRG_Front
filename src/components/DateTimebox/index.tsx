import { forwardRef } from 'react';

import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';

import { useRentDateStore } from 'src/stores';

import './style.css';
import 'react-datepicker/dist/react-datepicker.css';

//                    interface                    //
interface DateInputProps {
    value?: string;
    onClick?: () => void;
};

interface RentSiteDateProps {
    rentSite: string;
};

//                    component                    //
const DateCustomInput = forwardRef<HTMLButtonElement, DateInputProps>(
    ({ value, onClick }, ref) => (
        <button className="date-custom-input" onClick={onClick} ref={ref}>
            {value || '날짜 선택'}
        </button>
    )
);

//                    function                    //
const datePickerProps = (
    startDate: Date | null,
    endDate: Date | null,
    onChange: (dates: [Date | null, Date | null]) => void,
    placeholderText: string
) => ({
    locale: ko,
    selected: startDate,
    startDate,
    endDate,
    selectsRange: true,
    onChange,
    showPopperArrow: false,
    minDate: new Date(),
    dateFormat: "yyyy년 MM월 dd일",
    customInput: <DateCustomInput value={startDate ? `${startDate.toLocaleDateString()} - ${endDate ? endDate.toLocaleDateString() : ''}` : placeholderText} />,
    monthsShown: 2
});

//                    component                    //
export default function ReactDatePicker({rentSite}:RentSiteDateProps) {

    //                    state                    //
    const { startDate, setStartDate, endDate, setEndDate, totalRentTime } = useRentDateStore();

    //                    event handler                    //
    const onChangeHandler = (dates: [Date | null, Date | null]) => {
        if (!rentSite) {
            alert('먼저 대여지점을 선택해주세요.');
            return;
        }
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    //                    render                    //
    return (
        <div className='date-picker-wrapper'>
            <div className='date-picker-range-box'>
                <div className="rental-date">대여 기간</div>
                <div>
                    <DatePicker {...datePickerProps(startDate, endDate, onChangeHandler, "대여 및 반납 날짜 선택")} />
                </div>
            </div>
            {totalRentTime && <div className="total-rent-time">총 대여기간 : {totalRentTime}</div>}
        </div>
    );
};

import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import './style.css';
import { addDays, isAfter, differenceInDays } from 'date-fns';
import { useRentDateStore, useTotalRentTimeStore } from 'src/stores';

interface CustomInputProps {
    value?: string;
    onClick?: () => void;
}

const DateCustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
        <button className="date-custom-input" onClick={onClick} ref={ref}>
            {value || '날짜 선택'}
        </button>
    )
);

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
    monthsShown: 2 // 두 달력을 동시에 표시
});

const ReactDatePicker: React.FC = () => {
    const { startDate, setStartDate, endDate, setEndDate } = useRentDateStore();
    const { totalRentTime, setTotalRentTime } = useTotalRentTimeStore();

    const onChangeHandler = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            calculateTotalRentTime(start, end);
        }
    };

    const calculateTotalRentTime = (start: Date, end: Date) => {
        if (isAfter(end, start)) {
            const days = differenceInDays(end, start);
            setTotalRentTime(`${days}일`);
        } else {
            setTotalRentTime(null);
        }
    };

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

export default ReactDatePicker;

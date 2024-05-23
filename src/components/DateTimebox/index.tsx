import React from 'react';
import DatePicker from 'react-datepicker';
import './style.css';

interface ReservationCalendarProps {
    selectedDate: Date | null;
    selectedTime: Date | null;
    onDateChange: (date: Date | null) => void;
    onTimeChange: (time: Date | null) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
    selectedDate,
    selectedTime,
    onDateChange,
    onTimeChange
}) => {
    return (
        <div>
            <div>예약 날짜 및 시간 선택</div>
            <div>
                <label>예약 날짜 선택: </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={onDateChange}
                    dateFormat="yyyy/MM/dd"
                    minDate={new Date()}
                    inline
                />
            </div>
            <div>
                <label>예약 시간 선택: </label>
                <DatePicker
                    selected={selectedTime}
                    onChange={onTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                />
            </div>
        </div>
    );
};

export default ReservationCalendar;
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import './testStyle.css';
import { useTotalRentTimeStore } from 'src/stores';
import { differenceInDays, differenceInHours, isBefore } from 'date-fns';

const TestCalenderApp: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<string>('00시');
    const [endTime, setEndTime] = useState<string>('00시');
    const { totalRentTime, setTotalRentTime } = useTotalRentTimeStore();
  
    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}시`);

    // const calculateRentalDuration = () => {
    //     if (startDate && endDate) {
    //         const startHour = parseInt(startTime);
    //         const endHour = parseInt(endTime);
    //         const start = new Date(startDate);
    //         const end = new Date(endDate);
    //         start.setHours(startHour);
    //         end.setHours(endHour);

    //         const durationMs = end.getTime() - start.getTime();
    //         const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    //         const remainingHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    //         return `${durationDays}일 ${remainingHours}시간`;
    //     }
    //     return '0일 0시간';
    // };

    const calculateTotalRentTime = (start: Date, end: Date) => {
        if (isBefore(start, end)) {
            const days = differenceInDays(end, start);
            const hours = differenceInHours(end, start) % 24;
            setTotalRentTime(`${days}일 ${hours}시간`);
        } else {
            setTotalRentTime(null);
        }
    }

    return (
        <div className="calendar-container">
            <div className="date-time-picker">
                <h3>대여일과 반납일을 선택해주세요.</h3>
                <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    minDate={new Date()} // 오늘 이전 날짜는 선택 불가
                    locale={ko}
                    dateFormat="yyyy.MM.dd"
                    inline
                    className="custom-datepicker"
                    calendarClassName="custom-calendar"
                    renderCustomHeader={({
                        monthDate,
                        customHeaderCount,
                        decreaseMonth,
                        increaseMonth,
                    }) => (
                        <div>
                            <button
                                aria-label="Previous Month"
                                className={
                                    "react-datepicker__navigation react-datepicker__navigation--previous"
                                }
                                style={customHeaderCount === 1 ? { visibility: "hidden" } : undefined}
                                onClick={decreaseMonth}
                            >
                                <span
                                    className={
                                        "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                                    }
                                >
                                    {"<"}
                                </span>
                            </button>
                            <span className="react-datepicker__current-month">
                                {monthDate.toLocaleString("ko-KR", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <button
                                aria-label="Next Month"
                                className={
                                    "react-datepicker__navigation react-datepicker__navigation--next"
                                }
                                style={customHeaderCount === 0 ? { visibility: "hidden" } : undefined}
                                onClick={increaseMonth}
                            >
                                <span
                                    className={
                                        "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                                    }
                                >
                                    {">"}
                                </span>
                            </button>
                        </div>
                    )}
                    monthsShown={2}
                />
            </div>
            <div className="time-picker">
                <div>
                    <label>대여 시간: </label>
                    <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                        {hours.map((hour, index) => (
                            <option key={index} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>반납 시간: </label>
                    <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                        {hours.map((hour, index) => (
                            <option key={index} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="summary">
                <p>
                    대여 기간: {startDate ? startDate.toLocaleDateString() : '선택되지 않음'} {startTime} ~{' '}
                    {endDate ? endDate.toLocaleDateString() : '선택되지 않음'} {endTime}
                </p>
                {totalRentTime !== null && (
                <div className="total-rent-time">총 대여시간: {totalRentTime}</div>
            )}
            </div>
        </div>
    );
};

export default TestCalenderApp;
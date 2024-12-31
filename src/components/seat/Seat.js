import React, { useEffect, useMemo } from 'react'

export const SeatStatus = {
    EMPTY: "EMPTY", // Màu xám
    HOLD: "HOLD", // Màu vàng
    SUCCESS: "SUCCESS", // Màu đỏ (Đã bị người khác mua)
}

export const SeatType = {
    NORMAL: 1,
    VIP: 2,
}

export const Seat = ({ seat, isSelected, ...props }) => {
    const status = useMemo(() => {
        // Nếu còn trống thì ưu tiên lầy màu theo loại ghế
        if (seat.seatStatus === SeatStatus.EMPTY) {
            return isSelected ? 'selected' : `type-${seat.seatType_id}`;
        }
        // Nếu không còn trống thì ưu tiên lầy màu theo trạng thái ghế
        return `status-${seat.seatStatus}`
    });
    return <button
        disabled={seat.seatStatus !== SeatStatus.EMPTY}
        {...props}
        className={`seat ${status}`}>
        {seat.seatColumn + seat.seatRow}
    </button>;
};

export const SeatWrap = ({ seats, onSelect, selectedSeats, children }) => {
    const seatsByRow = useMemo(() => {
        if (!seats) return {};
        return Object.values(seats).reduce((acc, seat) => {
            if (!acc[seat.seatColumn]) {
                acc[seat.seatColumn] = [];
            }
            acc[seat.seatColumn].push(seat);
            return acc;
        }, {});
    }, [seats])

    /**
     * Xử lí chọn chỗ
     */
    const handleSelectSeat = (seat) => {
        // Nếu chỗ trống thì mới được chọn
        seat.seatStatus === SeatStatus.EMPTY && onSelect(seat);
    }

    return (
        <div className="cinema-seat-layout">
            {Object.keys(seatsByRow).map(column => (
                <div key={column} className="seat-row">
                    {seatsByRow[column].map(seat => (
                        <Seat
                            isSelected={selectedSeats.some(({ seatId }) => seat.seatId == seatId)}
                            onClick={() => handleSelectSeat(seat)}
                            key={seat.scheduleSeatId}
                            seat={seat} />
                    ))}
                </div>
            ))}
        </div>
    );
};
const formatBookingData = createdTrip => {
	const formatted = createdTrip.bookingDetails.map(
		({ id, roomImage, bookingAmount, hotelName, roomName, roomUnitCost }) => ({
			id,
			roomImage,
			hotelName,
			roomName,
			roomUnitCost,
			bookingAmount,
			days: bookingAmount / roomUnitCost,
		}),
	);

	const total = formatted.reduce(
		(acc, { bookingAmount }) => acc + Number(bookingAmount),
		0,
	);

	return {
		total,
		requestId: createdTrip.request.id,
		bookings: formatted,
	};
};

export const formatBooking = bookedRooms => {
	const formatted = bookedRooms.map(bookedRoom => {
		const { bookingId, room } = bookedRoom;
		const { amount } = bookedRoom.bookingDetails;
		const { name } = bookedRoom.hotelDetails;
		return {
			id: bookingId,
			roomImage: room.image,
			hotelName: name,
			roomName: room.name,
			roomUnitCost: room.cost,
			bookingAmount: amount,
			days: amount / room.cost,
		};
	});

	const total = formatted.reduce(
		(acc, { bookingAmount }) => acc + Number(bookingAmount),
		0,
	);

	const bookingsId = formatted.map(({ id }) => id);

	return {
		total,
		bookingsId,
		bookings: formatted,
	};
};

export default formatBookingData;

import { RequestHandler } from "express";
import { IReservation, IReservationDTO } from "../Interfaces/IReservation";
import Reservation from "../Models/Reservation.model";
import Restaurant from "../Models/Restaurant.model";
import Table from "../Models/Table.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const getReservationsByTable: RequestHandler = async (req, res) => {
	try {
		const { tableId }: { tableId?: string } = req.params;
		if (!isValidObjectId(tableId)) return res.status(400).json({ message: "Invalid Table id" });

		const reservations = await Reservation.find({ tableId });
		if (!reservations) return res.status(404).json({ message: "Reservations not found" });

		return res.json({ message: "Reservations of specifed table", reservations });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const createReservation: RequestHandler = async (req, res) => {
	try {
		const tableId: string = req.body.tableId;
		if (!isValidObjectId(tableId)) return res.status(400).json({ message: "Invalid table id" });

		const table = await Table.findById(tableId);
		if (!table) return res.status(404).send("Table not found");

		const restaurantId = await Restaurant.findById(table.restaurantId);
		if (!restaurantId) return res.status(404).send("Restaurant not found");

		const reservationData: IReservationDTO = req.body;

		const previousReservations = await Reservation.find({
			tableId,
			$or: [
				{
					$and: [
						{ reservedSince: { $lte: reservationData.reservedSince } },
						{ reservedUntil: { $gt: reservationData.reservedSince } },
					],
				},
				{
					$and: [
						{ reservedSince: { $gt: reservationData.reservedUntil } },
						{ reservedUntil: { $lte: reservationData.reservedUntil } },
					],
				},
				{
					$and: [
						{ reservedSince: { $gt: reservationData.reservedSince } },
						{ reservedUntil: { $lt: reservationData.reservedUntil } },
					],
				},
			],
		});

		if (previousReservations.length)
			return res.status(400).json({ message: "Table is unavaliable at this time" });

		const reservationDuration =
			new Date(reservationData.reservedUntil).getHours() -
			new Date(reservationData.reservedSince).getHours();

		const cost = reservationDuration * table.rate;

		const reservation: IReservation = new Reservation({
			...reservationData,
			reservedBy: req.user._id,
			restaurantId,
			cost,
		});
		await reservation.save();

		table.reservations.push(reservation._id);
		await table.save();

		return res.json({ message: "Table Reserved Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

// export const getTableReservations: RequestHandler = async(req, res) => {
// try{
// 	const reservations = await Reservation.find({})

// }catch (error) {
// 	console.error(error);
// 	return res.status(500).send(errorHandlers(error));
// }
// }

// export const getReservationById: Reque

export const getReservationsByRestaurant: RequestHandler = async (req, res) => {
	try {
		const { restaurantId }: { restaurantId?: string } = req.params;
		console.log(restaurantId);
		if (!isValidObjectId(restaurantId))
			return res.status(400).json({ message: "Invalid Table id" });

		const reservations = await Reservation.find({ restaurantId });
		console.log(reservations);
		if (!reservations.length) return res.status(404).json({ message: "Reservations not found" });

		return res.json({ message: "Reservations of specifed restaurant", reservations });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

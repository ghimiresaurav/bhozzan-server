import { RequestHandler } from "express";
import { IReservation, IReservationDTO } from "../Interfaces/IReservation";
import Reservation from "../Models/Reservation.model";
import Restaurant from "../Models/Restaurant.model";
import Table from "../Models/Table.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";
import mongoose from "mongoose";
import { roleEnum } from "../enums/roleEnum";

// Returns all the reservations that have ever been created
// For restaurant managers
export const getAllReservationsByTable: RequestHandler = async (req, res) => {
	try {
		const { tableId }: { tableId?: string } = req.params;
		if (!isValidObjectId(tableId)) return res.status(400).json({ message: "Invalid Table id" });

		const reservations = await Reservation.aggregate([
			{ $match: { tableId: new mongoose.Types.ObjectId(tableId) } },
			{
				$lookup: {
					from: "tables",
					localField: "tableId",
					foreignField: "_id",
					as: "table",
				},
			},
			{ $unwind: "$table" },
			{
				$lookup: {
					from: "users",
					localField: "reservedBy",
					foreignField: "_id",
					as: "customer",
				},
			},
			{ $unwind: "$customer" },
			{
				$project: {
					tableId: 0,
					"table.reservations": 0,
					"table.__v": 0,
					"customer.password": 0,
				},
			},
			{ $sort: { reservedSince: -1 } },
		]);

		if (!reservations) return res.status(404).json({ message: "Reservations not found" });

		return res.json({ message: "Reservations of specifed table", tableId, reservations });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const createReservation: RequestHandler = async (req, res) => {
	try {
		// Only customers can create reservations
		if (req.user.role !== roleEnum.CUSTOMER) return res.status(400).send("Invalid user role");

		const tableId: string = req.body.tableId;
		if (!isValidObjectId(tableId)) return res.status(400).json({ message: "Invalid table id" });

		const table = await Table.findById(tableId);
		if (!table) return res.status(404).send("Table not found");

		const restaurantId = await Restaurant.findById(table.restaurantId);
		if (!restaurantId) return res.status(404).send("Restaurant not found");

		const reservationData: IReservationDTO = req.body;

		// Explicitly type cast the incoming dates into Date format
		reservationData.reservedSince =
			reservationData && reservationData.reservedSince && new Date(reservationData.reservedSince);

		reservationData.reservedUntil =
			reservationData && reservationData.reservedUntil && new Date(reservationData.reservedUntil);

		const previousReservations = await Reservation.find({
			tableId,
			// Make sure to include colliding reservations
			$or: [
				{
					// Non-overlappting
					// New reservation starts during existing reservation
					$and: [
						{ reservedSince: { $lte: reservationData.reservedSince } },
						{ reservedUntil: { $gt: reservationData.reservedSince } },
					],
				},
				{
					// New reservation ends during existing reservation
					$and: [
						{ reservedSince: { $lt: reservationData.reservedUntil } },
						{ reservedUntil: { $gte: reservationData.reservedUntil } },
					],
				},
				{
					// Overlaping
					// Existing reservation is within new reservation
					$and: [
						{ reservedSince: { $gt: reservationData.reservedSince } },
						{ reservedUntil: { $lt: reservationData.reservedUntil } },
					],
				},
				{
					// New reservation is within or same as existing reservation
					$and: [
						{ reservedSince: { $lte: reservationData.reservedSince } },
						{ reservedUntil: { $gte: reservationData.reservedUntil } },
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
			restaurantId, //reservation object
			cost,
		});
		await reservation.save();

		table.reservations.push(reservation._id);
		await table.save();

		return res.json({
			message: "Table Reserved Successfully",
			reservations: table.reservations,
			reservation,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const cancleReservation: RequestHandler = async (req, res) => {
	try {
		const { reservationId }: { reservationId?: string } = req.params;
		if (!isValidObjectId(reservationId))
			return res.status(400).json({ message: "Invalid Table Id" });

		const reservation: IReservation | null = await Reservation.findById(reservationId);
		if (!reservation) return res.status(404).json({ message: "Reservations not found" });

		if (reservation.reservedSince.getTime() - new Date().getTime() <= 3600000)
			return res.status(403).json({ message: "Unable to cancle reservation" });

		await Table.findByIdAndUpdate(reservation.tableId, { $pull: { reservations: reservationId } });
		await Reservation.findByIdAndRemove(reservationId);

		return res.json({ message: "Reservation cancle successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

// Returns only the reservations whose starting time is greater than or equal to current time
// For customers
export const getReservationsByTable: RequestHandler = async (req, res) => {
	try {
		const { tableId }: { tableId?: string } = req.params;
		if (!isValidObjectId(tableId)) return res.status(400).json({ message: "Invalid Table id" });

		const reservations = await Reservation.aggregate([
			{
				$match: {
					tableId: new mongoose.Types.ObjectId(tableId),
					reservedSince: { $gte: new Date() },
				},
			},
			{
				$lookup: {
					from: "tables",
					localField: "tableId",
					foreignField: "_id",
					as: "table",
				},
			},
			{ $unwind: "$table" },
			{
				$project: {
					tableId: 0,
					"table.reservations": 0,
					"table.__v": 0,
				},
			},
			{ $sort: { reservedSince: -1 } },
		]);
		if (!reservations) return res.status(404).json({ message: "Reservations not found" });

		return res.json({ message: "Reservations of specifed table", tableId, reservations });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getMyReservations: RequestHandler = async (req, res) => {
	try {
		if (req.user.role !== roleEnum.CUSTOMER)
			return res.status(400).json({ message: "Invalid user role" });

		const reservations = await Reservation.find({ reservedBy: req.user._id })
			.populate("restaurant", "name address imageLink primaryPhoneNumber phoneNumbers")
			.populate("tableId", "name seats rate")
			.sort({
				reservedSince: -1,
			})
			.select("reservedSince reservedUntil cost");
		if (!reservations) return res.status(404).json({ message: "Reservations not found" });

		return res.json({ message: "Your reservations", reservations });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

import { RequestHandler } from "express";
import { ObjectId } from "mongoose";
import { IReservation, IReservationDTO } from "../Interfaces/IReservation";
import { ITable, ITableDTO } from "../Interfaces/ITable";
import Reservation from "../Models/Reservation.model";
import Restaurant from "../Models/Restaurant.model";
import Table from "../Models/Table.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const addNewTable: RequestHandler = async (req, res) => {
	try {
		const restaurantId = req.user.restaurant;
		const tableData: ITable = { ...req.body, restaurantId };

		const table = new Table(tableData);
		await table.save();

		// Also save the table's id to the restaurant's tables list
		await Restaurant.findByIdAndUpdate(restaurantId, { $push: { tables: table._id } });

		return res.json({ message: "Table Added Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const deleteTable: RequestHandler = async (req, res) => {
	try {
		const { tableId }: { tableId?: string } = req.params;
		const restaurantId = req.user.restaurant;
		if (!isValidObjectId(tableId)) return res.status(400).send("Invalid Dish ID");

		const deletedTable = await Table.findOneAndDelete({
			_id: tableId,
			restaurant: req.user.restaurant,
		});

		if (!deletedTable) return res.status(404).send("Table not found");

		await Restaurant.findByIdAndUpdate(restaurantId, {
			$pull: { tables: tableId },
		});

		return res.json({ message: "Table Deleted Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const reserveTable: RequestHandler = async (req, res) => {
	try {
		const reservedBy = req.user._id;

		const table = await Table.findById(req.body.tableId);
		if (!table) return res.status(404).send("Table not found");

		const restaurantId = await Restaurant.findById(table.restaurantId);
		const cost: Number =
			(new Date(req.body.reservedUntil).getHours() - new Date(req.body.reservedSince).getHours()) *
			table.rate;

		const previousReservations = await Reservation.find({
			_id: { $in: table.reservations },
			$or: [
				{
					$and: [
						{ reservedSince: { $lt: req.body.reservedUntil } },
						{ reservedUntil: { $gte: req.body.reservedUntil } },
					],
				},
				{
					$and: [
						{ reservedSince: { $lte: req.body.reservedSince } },
						{ reservedUntil: { $gt: req.body.reservedSince } },
					],
				},
				{
					$and: [
						{ reservedSince: { $gt: req.body.reservedSince } },
						{ reservedUntil: { $lt: req.body.reservedUntil } },
					],
				},
			],
		});

		if (previousReservations.length)
			return res.json({ message: "Table is unavaliable at this time" });

		const reservationData: IReservation = { ...req.body, reservedBy, restaurantId, cost };

		const reservations = new Reservation(reservationData);
		await reservations.save();

		await Table.findByIdAndUpdate(req.body.tableId, { $push: { reservations: reservations._id } });

		return res.json({ message: "Table Reserved Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

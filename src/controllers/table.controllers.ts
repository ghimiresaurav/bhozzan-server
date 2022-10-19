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
		const userId = req.user._id;
		const { tableId, reservedSince, reservedUntil } = req.body;

		const table = await Table.findById(tableId);
		if (!table) return res.status(404).send("Table not found");

		const previousReservations = await Reservation.find({
			_id: { $in: table.reservations },
			$or: [{ reservedSince: { $gte: reservedUntil } }, { reservedUntil: { $lte: reservedSince } }],
		});

		if (!previousReservations.length) {
			return res.json({ message: "Table is unavaliable at this time" });
		}

		const totalTime = new Date(reservedUntil).getHours() - new Date(reservedSince).getHours();
		const cost = totalTime * table.rate;

		const reservations: IReservation = new Reservation({
			tableId: tableId,
			reservedBy: userId,
			reservedSince: reservedSince,
			reservedUntil: reservedUntil,
			cost: cost,
		});

		await reservations.save();
		table.reservations.push(reservations._id);
		await table.save();

		return res.json({ message: "!!! Table Reserved Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

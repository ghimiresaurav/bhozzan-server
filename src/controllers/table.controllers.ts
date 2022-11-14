import { RequestHandler } from "express";
import { roleEnum } from "../enums/roleEnum";
import { ITable } from "../Interfaces/ITable";
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

export const getTablesByRestaurant: RequestHandler = async (req, res) => {
	try {
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId)) return res.status(400).send("Invalid Restaurant ID.");

		const tables = await Table.find({ restaurantId });
		if (!tables.length) return res.status(404).json({ message: "Reservations not found" });

		return res.json({ message: "Reservations of specifed restaurant", tables });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

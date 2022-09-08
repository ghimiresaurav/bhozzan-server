import { RequestHandler } from "express";
import { ITable, ITableDTO } from "../Interfaces/ITable";
import Restaurant from "../Models/Restaurant.model";
import Table from "../Models/Table.model";
import errorHandlers from "../utils/error-handlers";

export const addNewTable: RequestHandler = async (req, res) => {
	try {
		const restaurantId = req.user.restaurant;
		const tableData: ITableDTO = req.body;

		const tableInfo: ITable = { ...tableData, restaurantId };
		const table = new Table(tableInfo);
		await table.save();

		// Also save the table's id to the restaurant's tables list
		await Restaurant.findByIdAndUpdate(restaurantId, { $push: { tables: table._id } });

		return res.json({ message: "Table Added Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

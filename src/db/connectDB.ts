import mongoose from "mongoose";
import createSuperAdmin from "./initDB";

const connectDB = async () => {
	let uri = process.env.NODE_ENV === "prod" ? process.env.DB_REMOTE : process.env.DB_LOCAL;
	try {
		if (!uri) throw new Error("DB URI not found");
		await mongoose.connect(uri);
		console.log("DB CONNECTED SUCCESS!");
		createSuperAdmin();
	} catch (error) {
		process.exit(1);
	}
};

export default connectDB;

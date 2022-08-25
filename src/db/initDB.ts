import { roleEnum } from "../enums/roleEnum";
import { IUser } from "../Interfaces/IUser";
import User from "../Models/User.model";

const createSuperAdmin = async (): Promise<void> => {
	try {
		const admin: IUser | null = await User.findOne({
			phoneNumber: process.env.ADMIN_PHONE_NUMBER,
		});

		if (!admin) {
			const user: IUser = new User({
				phoneNumber: process.env.ADMIN_PHONE_NUMBER,
				firstName: "Bhozzan",
				lastName: "Admin",
				password: process.env.ADMIN_PASSWORD,
				role: roleEnum.ADMIN,
				address: "Bhozzan HQ",
			});
			await user.save();
			console.log("Admin Created");
		}
	} catch (error) {
		console.error(error);
	}
};

export default createSuperAdmin;

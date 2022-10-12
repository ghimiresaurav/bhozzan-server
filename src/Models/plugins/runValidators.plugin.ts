import mongoose from "mongoose";

export const runValidators = (schema: mongoose.Schema) => {
	schema.pre("findOneAndUpdate", function () {
		this.setOptions({ runValidators: true, new: true });
	});
	schema.pre("update", function () {
		this.setOptions({ runValidators: true, new: true });
	});
	schema.pre("updateOne", function () {
		this.setOptions({ runValidators: true, new: true });
	});
	schema.pre("updateMany", function () {
		this.setOptions({ runValidators: true, new: true });
	});
};

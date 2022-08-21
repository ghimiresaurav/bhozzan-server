import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import database models
import IUser from "../Models/User.model";

const login = async (req: Request, res: Response) => {
  // Extract user inputs
  const { phoneNumber, password }: { phoneNumber: number; password: string } =
    req.body;
  // Connect to the atlas database
  mongoose
    .connect(<string>process.env.DB_URI)
    .catch((e) => console.log(`Error: ${e.message}`));

  // Find if the user exists
  const user = await IUser.findOne({ phoneNumber });

  //If the user does not exist, send an error message
  if (!user)
    return res.json({
      success: false,
      message: "User with this Phone Number does not exist",
    });

  // Check if the user entered correct password
  const isPasswordCorrect: boolean = await bcrypt.compare(
    password,
    <string>user.password
  );

  // If password is incorrect, send an error message
  if (!isPasswordCorrect)
    return res.json({ success: false, message: "Incorrect Password" });

  // If everything is okay, sign a token with the user's information
  const token = jwt.sign(
    {
      phoneNumber: user.phoneNumber,
      id: user._id,
    },
    <string>process.env.TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Return a success message with the token and other useful information
  return res.json({
    success: true,
    message: "Login Successful :)",
    token,
    id: user._id,
  });
};

export default login;

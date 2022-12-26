import { Router } from "express";
import { sample_foods, sample_users } from "../data";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";

const router = Router();

router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seeding is Done...");
      return;
    } else {
      await UserModel.create(sample_users);
      res.send("Seeding is Done...");
    }
  })
);

router.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateTokenResponse(user),
      });
    } else {
      res.status(400).send("User Name or Password is NOT Valid");
    }
  })
);

router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      res.status(400).send("User Already Exist");
      return;
    }
    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: password,
      address,
      isAdmin: false,
      token: "",
    };
    const dbUser = await UserModel.create(newUser);
    if (dbUser) {
      res.status(201).json({
        _id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        password: dbUser.password,
        isAdmin: dbUser.isAdmin,
        address: dbUser.address,
        token: generateTokenResponse(dbUser),
      });
      if (dbUser) {
        res.send(generateTokenResponse(dbUser));
      }
    } else {
      res.status(400).send("Invalid User Data");
    }
  })
);

const generateTokenResponse = (user: User) => {
  const token = jwt.sign(
    { email: user.email, isAdmin: user.isAdmin },
    "SomeRamdonText",
    { expiresIn: "30d" }
  );
  user.token = token;
  return user;
};

export default router;

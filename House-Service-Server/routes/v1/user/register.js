import { Router } from "express";
import { prisma } from "../../../lib/db.js";
import { hash } from "bcrypt";

const router = new Router();

router.post("/", async (req, res) => {
  // #swagger.tags = ["User/Register"]
  // #swagger.summary = "Create user profile"
  try {
    const { name, phone, email, password } = req.body;

    // check if email already exists
    const existingUserByEmail = await prisma.customer_profile.findUnique({
      where: {
        email: email,
      },
    });
    const existingUserByPhone = await prisma.customer_profile.findUnique({
      where: {
        phone: phone,
      },
    });
    if (existingUserByEmail && existingUserByPhone) {
      return res.status(409).json({
        user: null,
        message: "User with these email and phone number already",
      });
    } else if (existingUserByPhone) {
      return res.status(409).json({
        user: null,
        message: "User with this phone number already",
      });
    } else if (existingUserByEmail) {
      return res.status(409).json({
        user: null,
        message: "User with this email already",
      });
    }

    // const hashedPassword = await hash(password, 10);
    // const newUser = await prisma.customer_profile.create({
    // 	data: {
    // 		name,
    // 		phone,
    // 		email,
    // 		password: hashedPassword,
    // 	},
    // });

    const newUser = await prisma.customer_profile.create({
      data: {
        name,
        phone,
        email,
        password,
      },
    });

    return res.status(201).json({
      user: newUser,
      message: "User created successully",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;

import { Router } from "express";
import { prisma } from "../../../lib/db.js";
import { compare } from "bcrypt";
const router = new Router();

router.get("/", async (req, res) => {
  try {
    const currentLoginEmail = req.query.email;
    console.log(currentLoginEmail);
    const response = await prisma.customer_profile.findMany({
      where: {
        email: currentLoginEmail,
      },
      select: {
        name: true,
        phone: true,
        email: true,
        avatar_url: true,
      },
    });

    res.json({
      message: "Data fetched successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error fetching profile details:",
      error,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const currentLoginEmail = req.query.email;
    const {
      name,
      phone,
      email,
      password,
      newPassword,
      reNewPassword,
      avatar_url,
    } = req.body;
    console.log(`edit put ${currentLoginEmail}`);

    const user = await prisma.customer_profile.findUnique({
      where: {
        email: currentLoginEmail,
      },
    });

    // Check if the user wants to change the password and if the provided current password matches
    if (
      !newPassword ||
      (newPassword !== "" && user && user.password === password)
    ) {
      const response = await prisma.customer_profile.update({
        where: {
          email: currentLoginEmail,
        },
        data: {
          name: name !== "" ? name : undefined,
          phone: phone !== "" ? phone : undefined,
          email: email !== "" ? email : undefined,
          password: newPassword || undefined, // Update newPassword when provided, or set to undefined if not provided
          avatar_url: avatar_url !== "" ? avatar_url : undefined,
        },
      });

      res.json({
        message: "Update successful!",
        response,
      });
    } else {
      res.status(400).json({
        message: "Current password is incorrect. Cannot update the password.",
      });
    }
  } catch (error) {
    console.log(`edit put ${error}`);

    res.status(400).json({
      message: "Error updating profile details:",
      error,
    });
  }
});

router.get("/passwordcheck", async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.query.password;
    console.log(email, password);

    const getHashPassword = await prisma.Customer_profile.findMany({
      where: {
        email: email,
      },
      select: {
        password: true,
      },
    });
    console.log("getHashPassword", getHashPassword[0].password);

    const passwordMatch = await compare(password, getHashPassword[0].password);

    console.log("passwordMatch", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Password does not match",
      });
    } else {
      return res.status(200).json({
        message: "Login successful",
        data: passwordMatch,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error matching password:",
      error: error.message,
    });
  }
});

export default router;

import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { Company } from "../models/company";
import { User } from "../models/user";
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(req.body.email);

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/users/company", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user.userRole !== "company") {
      throw new Error("You are not authorized.");
    }
    const company = await Company.findOne({ ownerId: user._id });
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;

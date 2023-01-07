import express from "express";
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

export default router;

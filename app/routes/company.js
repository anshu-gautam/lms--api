import express from "express";

import { authMiddleware } from "../middlewares/auth";

import { Company } from "../models/company";

const router = new express.Router();

router.post("/companies", authMiddleware, async (req, res) => {
  const currentUser = req.user;

  try {
    if (currentUser.userRole === "customer") {
      throw new Error("Customers are not authorized to create company.");
    }
    const company = new Company({ ...req.body, ownerId: req.user._id });
    await company.save();
    res.status(200).send({ company });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/companies/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  try {
    let company = await Company.findById(id);

    if (!company.ownerId.equals(currentUser._id)) {
      throw new Error("You are not authorized to update!");
    }

    company = await company.updateOne(req.body);

    res.status(200).send({ company });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;

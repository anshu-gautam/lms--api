import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { Company } from "../models/company";

import { Order } from "../models/order";
// import { orderPlaced } from "../email/email";

const router = new express.Router();

router.post("/orders", authMiddleware, async (req, res) => {
  try {
    if (req.user.userRole === "company") {
      throw new Error("You are not authorized to place orders.");
    }

    if (!Object.keys(req.body?.item).length) {
      throw new Error("Add items to place an order");
    }

    delete req.body.status;

    const order = new Order({
      ...req.body,
      creatorId: req.user._id,
    });
    await order.save();
    // const itemsOrdered = Object.keys(order.item)
    //   .map((key) => `${key}: ${order.item[key]}`)
    //   .join(", ");

    // orderPlaced(
    //   req.user.email,
    //   `Your order has been placed with the following items: ${itemsOrdered}`
    // );

    res.status(201).send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/orders", authMiddleware, async (req, res) => {
  let orders;
  try {
    if (req.user.userRole === "company") {
      const company = await Company.findOne({ ownerId: req.user._id });

      orders = await Order.find({ companyId: company?._id });
    } else {
      orders = await Order.find({ creatorId: req.user._id });
    }
    res.status(200).send({ orders });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/orders/:id/status_update", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order.creatorId.equals(req.user._id)) {
      throw new Error("You are not authorized");
    }
    const status = req.body.status;
    await order.updateOne({ status }, { runValidators: true });

    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/orders/statistics", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const company = await Company.findOne({ ownerId: user._id });
    const orderStatuses = [
      "requested",
      "accepted",
      "rejected",
      "inProcess",
      "delivered",
    ];

    let statistics = {};

    if (company) {
      const promises = orderStatuses.map(async (status) => {
        const count = await Order.countDocuments({
          companyId: company._id,
          status,
        });

        statistics[status] = count;
      });

      await Promise.all(promises);
    } else {
      const promises = orderStatuses.map(async (status) => {
        const count = await Order.countDocuments({
          creatorId: req.user._id,
          status,
        });

        statistics[status] = count;
      });

      await Promise.all(promises);
    }

    res.status(200).send({ statistics });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/orders/:id/status", authMiddleware, async (req, res) => {
  try {
    if (!req.user.userRole == "company ") {
      throw new Error("You are not authorized");
    }
    const order = await Order.findById(req.params.id);
    const company = await Company.findOne({ ownerId: req.user._id });

    if (!order.companyId.equals(company._id)) {
      throw new Error("You are not authorized");
    }
    const status = req.body.status;
    await order.updateOne({ status });
    res.status(200).send({ message: "Updated" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;

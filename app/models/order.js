import mongoose from "mongoose";

const orderStatuses = [
  "requested",
  "accepted",
  "rejected",
  "inProcess",
  "delivered",
];

const orderSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  status: {
    type: String,
    enum: orderStatuses,
    default: "requested",
    required: true,
    validate(value) {
      if (!orderStatuses.includes(value)) {
        throw new Error("Invalid order status");
      }
    },
  },

  address: {
    type: String,
    requied: true,
  },

  items: [
    {
      clothType: {
        type: String,
        requied: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalCost: {
    type: Number,
  },
  pickUpDate: {
    type: Date,
    requied: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

export { Order };

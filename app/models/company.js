import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rate: [
    {
      clothType: {
        type: String,
        requied: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Company = mongoose.model("Company", companySchema);

export { Company };

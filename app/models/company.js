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
  rate: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Company = mongoose.model("Company", companySchema);

export { Company };

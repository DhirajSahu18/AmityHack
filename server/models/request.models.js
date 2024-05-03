import mongoose from "mongoose";

const donationReq = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  type : {
    type: String,
    enum : ["money", "volunteer" , "food"],
    default : "money",
    required: true, 
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DonationRequest = mongoose.model("DonationRequest", donationReq);

export default DonationRequest;

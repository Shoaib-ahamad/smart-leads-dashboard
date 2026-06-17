import mongoose, { Document, Schema } from "mongoose";

import {
  LeadStatus,
  LeadSource,
} from "../types/lead.types";

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: mongoose.Types.ObjectId;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Lost",
      ],
      default: "New",
    },

    source: {
      type: String,
      enum: [
        "Website",
        "Instagram",
        "Referral",
      ],
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model<ILead>(
  "Lead",
  leadSchema
);

export default Lead;
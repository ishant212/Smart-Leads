import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "lost";

  source:
    | "website"
    | "instagram"
    | "referral";

  createdBy: mongoose.Types.ObjectId;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "lost",
      ],
      default: "new",
    },

    source: {
      type: String,
      enum: [
        "website",
        "instagram",
        "referral",
      ],
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
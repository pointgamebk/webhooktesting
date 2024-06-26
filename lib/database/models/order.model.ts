import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  createdAt: Date;
  stripeId: string;
  totalAmount: number;
  event: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  instructor: {
    _id: string;
    stripeAccountId: string;
  };
}

export type IOrderItem = {
  _id: string;
  totalAmount: number;
  createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
  instructor: {
    _id: string;
    stripeAccountId: string;
    firstName: string;
    lastName: string;
  };
  event: {
    _id: string;
    endDateTime: Date;
  };
};

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: Number,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "pending",
    required: true,
  },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;

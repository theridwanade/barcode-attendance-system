import mongoose, { Schema } from "mongoose";

interface IInvitedContact {
  contact: mongoose.Types.ObjectId;
  checkInTime?: Date;
  eventPassObjectId?: string;
}

interface IEventDate {
  start: Date;
  end?: Date;
}

interface IVenue {
  name: string;
  address: string;
}

export interface IEvent extends mongoose.Document {
  admin: mongoose.Types.ObjectId;
  eventPassClassId?: string;
  title: string;
  description?: string;
  date: IEventDate;
  venue: IVenue;
  invitedContacts: IInvitedContact[];
  createdAt: Date;
  updatedAt: Date;
}
const invitedContactsSchema = new Schema<IInvitedContact>(
  {
    contact: {
      type: Schema.Types.ObjectId,
      ref: "Contacts",
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    eventPassObjectId: {
      type: String,
    },
  },
  { _id: false },
);

const eventDateSchema = new Schema<IEventDate>(
  {
    start: { type: Date, required: true },
    end: { type: Date },
  },
  { _id: false },
);

const venueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false },
);

const eventsSchema = new Schema<IEvent>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admins",
      required: true,
    },
    eventPassClassId: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    date: eventDateSchema,
    venue: venueSchema,
    invitedContacts: [invitedContactsSchema],
  },
  { timestamps: true },
);

const Events: mongoose.Model<IEvent> =
  mongoose.models.Events || mongoose.model<IEvent>("Events", eventsSchema);

export default Events;

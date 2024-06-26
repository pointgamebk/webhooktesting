"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByOrganizerParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
};

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);
    if (!organizer) throw new Error("Organizer not found");

    if (event.price === 0) {
      event.isFree = true;
    }

    if (event.limit === 0 && !event.noLimit) {
      event.noLimit = true;
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId));

    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.attendees.length > 0) {
      await Event.findByIdAndUpdate(eventId, { canceled: true });
      revalidatePath(path);
    } else {
      const deletedEvent = await Event.findByIdAndDelete(eventId);
      if (deletedEvent) revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const currentDate = new Date();
    const pastDay = new Date(currentDate.getTime() - 13 * 60 * 60 * 1000);

    const locationCondition = query
      ? { location: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const conditions = {
      $and: [
        locationCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
        { startDateTime: { $gte: pastDay } },
        { canceled: false },
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ startDateTime: "asc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS BY ORGANIZER
export async function getAllEventsByOrganizer({
  organizerId,
  limit = 3,
  page = 1,
}: GetEventsByOrganizerParams) {
  try {
    await connectToDatabase();

    const conditions = { organizer: organizerId };
    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ startDateTime: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET ALL UPCOMING EVENTS BY ORGANIZER
export async function getFutureEventsByOrganizer({
  organizerId,
  limit = 3,
  page = 1,
}: GetEventsByOrganizerParams) {
  try {
    await connectToDatabase();

    const currentDate = new Date();
    const pastDay = new Date(currentDate.getTime() - 13 * 60 * 60 * 1000);

    const conditions = {
      $and: [
        { organizer: organizerId },
        { startDateTime: { $gte: pastDay } },
        { canceled: false },
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ startDateTime: "asc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase();

    const currentDate = new Date();
    const pastDay = new Date(currentDate.getTime() - 13 * 60 * 60 * 1000);

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [
        { category: categoryId },
        { _id: { $ne: eventId } },
        { startDateTime: { $gte: pastDay } },
      ],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ startDateTime: "asc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

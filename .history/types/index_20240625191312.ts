// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName?: string | null;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName?: string | null;
  username: string;
  photo: string;
  profileSchool: string;
  profileContact: string;
  profileDescription: string;
  profilePhoto: string;
};

export type UpdateProfileParams = {
  description: string;
  profilePhoto: string;
  profileSchool: string;
  profileContact: string;
};

export type LinkStripeAccountParams = {
  account: string;
  refreshUrl: string;
  returnUurl: string;
  type: string;
};

// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string;
  event: {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: number;
    isFree: boolean;
    limit: number;
    noLimit: boolean;
  };
  path: string;
};

export type UpdateEventParams = {
  userId: string;
  event: {
    _id: string;
    title: string;
    imageUrl: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: number;
    isFree: boolean;
    limit: number;
    noLimit: boolean;
  };
  path: string;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type GetEventsByOrganizerParams = {
  organizerId: string;
  limit?: number;
  page: number | string;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  imageUrl: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  limit: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    _id: string;
    name: string;
  };
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

export type CheckoutOrderParams = {
  eventTitle: string;
  event: string;
  price: number;
  isFree: boolean;
  buyer: string;
  instructor: string;
};

export type CreateOrderParams = {
  stripeId: string;
  event: string;
  buyer: string;
  instructor: string;
  totalAmount: number;
  createdAt: Date;
};

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};

export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};

export type CreateTransferParams = {
  amount: number;
  destination: string;
  transfer_group: string;
  path: string;
};

export type sendOrderConfirmationEmailParams = {
  name: string;
  product: string;
  email: string;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

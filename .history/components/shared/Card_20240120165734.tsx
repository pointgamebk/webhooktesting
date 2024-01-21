import { IEvent } from "@/lib/database/models/event.model";
import Link from "next/link";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />
      {/* IS EVENT CREATOR... */}
      <Link
        href={`/events/${event._id}`}
        className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"
      />
    </div>
  );
};

export default Card;
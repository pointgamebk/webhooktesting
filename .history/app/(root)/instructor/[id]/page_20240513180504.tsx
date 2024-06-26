import Collection from "@/components/shared/Collection";
import { getUserById } from "@/lib/actions/user.actions";
import { getFutureEventsByOrganizer } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";

const InstructorDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const instructorId = id;
  const instructor = await getUserById(instructorId);

  const page = Number(searchParams?.page) || 1;

  const relatedEvents = await getFutureEventsByOrganizer({
    organizerId: instructorId,
    page,
  });

  return (
    <>
      <section className="flex justify-center bg-slate bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <div className="grid mt-10">
            <Image
              src={instructor.profilePhoto}
              alt="hero image"
              width={500}
              height={500}
              className="h-full min-h-[200px] object-cover object-center rounded-3xl"
            />
          </div>

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold text-tan">
                {instructor.firstName} {instructor.lastName}
              </h2>

              {instructor.profileSchool.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-3">
                    <p className="p-medium-16 rounded-full bg-white/10 px-4 py-2.5 text-tan">
                      {instructor.profileSchool}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0 text-tan">
                  {instructor.profileDescription}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="p-medium-20 ml-2 mt-2 sm:mt-0 text-green">
                  {instructor.profileContact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold text-tan">Upcoming Camps</h2>

        <Collection
          data={relatedEvents?.data}
          emptyTitle="No events created yet"
          emptyStateSubtext="Go create some now!"
          collectionType="Events_Organized"
          limit={3}
          page={page}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default InstructorDetails;

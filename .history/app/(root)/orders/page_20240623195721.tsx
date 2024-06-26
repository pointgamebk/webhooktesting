import Search from "@/components/shared/Search";
import { getOrdersByEvent } from "@/lib/actions/order.actions";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { IOrderItem } from "@/lib/database/models/order.model";

const Orders = async ({ searchParams }: SearchParamProps) => {
  const eventId = (searchParams?.eventId as string) || "";
  const searchText = (searchParams?.query as string) || "";

  const orders = await getOrdersByEvent({ eventId, searchString: searchText });

  console.log(orders);

  return (
    <>
      <section className=" bg-slate bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center text-tan sm:text-left ">
          Order Details
        </h3>
      </section>

      <section className="wrapper mt-8">
        <Search placeholder="Search buyer name..." />
      </section>

      <section className="wrapper overflow-x-auto text-tan">
        <table className="w-full border-collapse border-t">
          <thead>
            <tr className="p-medium-14 border-b text-grey-500">
              <th className="min-w-[250px] py-3 text-left text-tan">
                Order ID
              </th>
              {/* <th className="min-w-[200px] flex-1 py-3 pr-4 text-left text-tan">
                Event Title
              </th> */}
              <th className="min-w-[150px] py-3 text-left text-tan">Buyer</th>
              <th className="min-w-[100px] py-3 text-left text-tan">
                Order Date
              </th>
              <th className="min-w-[100px] py-3 text-right text-tan">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length === 0 ? (
              <tr className="border-b">
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              <>
                {orders &&
                  orders.map((row: IOrderItem) => (
                    <tr
                      key={row._id}
                      className="p-regular-14 lg:p-regular-16 border-b "
                      style={{ boxSizing: "border-box" }}
                    >
                      <td className="min-w-[250px] py-4 text-green">
                        {row._id}
                      </td>
                      {/* <td className="min-w-[200px] flex-1 py-4 pr-4">
                        {row.eventTitle}
                      </td> */}
                      <td className="min-w-[150px] py-4">
                        {row.buyer.firstName} {row.buyer.lastName}
                      </td>
                      <td className="min-w-[100px] py-4">
                        {formatDateTime(row.createdAt).dateOnly}
                      </td>
                      <td className="min-w-[100px] py-4 text-right">
                        {formatPrice(row.totalAmount.toString())}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Orders;

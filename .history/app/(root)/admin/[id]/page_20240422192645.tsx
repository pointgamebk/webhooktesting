import DeleteStripeAccountForm from "@/components/shared/DeleteStripeAccountForm";
import { getOrders } from "@/lib/actions/order.actions";
import { IOrderItem } from "@/lib/database/models/order.model";
import { formatPrice } from "@/lib/utils";

type AdminPageProps = {
  params: { id: string };
};

const AdminPage = async ({ params: { id } }: AdminPageProps) => {
  const orders = await getOrders();

  console.log(orders);

  return (
    <>
      <section className=" bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-tan">
          Admin Dashboard
        </h3>

        <div className="wrapper my-8">
          <DeleteStripeAccountForm />
        </div>
      </section>

      <section className=" bg-dotted-pattern bg-cover bg-center py-5 px-10 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-tan">
          Transfers
        </h3>

        <table className="w-full border-collapse border-t">
          <thead>
            <tr className="p-medium-14 border-b text-grey-500">
              <th className="min-w-[100px] flex-1 py-3 pr-4 text-left text-grey-400">
                Order ID
              </th>
              <th className="min-w-[75px] flex-1 py-3 pr-4 text-left text-grey-400">
                Amount
              </th>
              <th className="min-w-[75px] flex-1 py-3 pr-4 text-left text-grey-400">
                Account ID
              </th>
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
                  orders.map((row: any) => (
                    <tr
                      key={row._id}
                      className="p-regular-14 lg:p-regular-16 border-b "
                      style={{ boxSizing: "border-box" }}
                    >
                      <td className="min-w-[250px] py-4 text-green">
                        {row._id}
                      </td>
                      <td className="min-w-[100px] py-4 text-right">
                        {formatPrice(row.totalAmount)}
                      </td>
                      <td className="min-w-[150px] py-4">
                        {row.instructor.stripeAccountId}
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

export default AdminPage;

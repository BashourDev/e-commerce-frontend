import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  MdOutlineDone,
  MdOutlineLocalShipping,
  MdOutlinePendingActions,
} from "react-icons/md";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const getOrders = async () => {
    const res = await api.get("/orders/my-orders");
    console.log(res);
    setOrders(res.data.orders);
  };

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <>
      <div className="w-full max-w-5xl px-4 mx-auto my-10">
        <div className="border rounded-lg pb-6 border-gray-200">
          <div className="flex items-center border-b border-gray-200 justify-between px-6 py-3">
            <p className="text-sm lg:text-xl font-semibold leading-tight text-gray-800">
              Previous Orders
            </p>
            <div className="flex cursor-pointer items-center justify-center px-3 py-2.5 border rounded border-gray-100">
              {/* <p className="text-xs md:text-sm leading-none text-gray-600">
                Filter by: Latest
              </p> */}
            </div>
          </div>
          <div className="px-6 pt-6 overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <tbody>
                {orders?.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <td>
                      <div className="flex items-center">
                        <p className="font-semibold text-gray-800">
                          # {order?.id}
                        </p>
                        <div className="pl-3">
                          <div className="flex items-center text-sm leading-none">
                            {/* <p className="text-blue-500 ml-3">
                              (ID 879-10-940)
                            </p> */}
                          </div>
                          <p className="text-xs md:text-sm leading-none text-gray-600 mt-2">
                            placed{" "}
                            {moment(order?.created_at).format(
                              "dddd, MMMM Do YYYY, h:mm a"
                            )}
                          </p>
                          <p className="text-xs md:text-sm leading-none text-gray-600 mt-2">
                            last updated{" "}
                            {moment(order?.updated_at).format(
                              "dddd, MMMM Do YYYY, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="pl-16">
                      <div>
                        <p className="text-sm font-semibold leading-none text-right px-1 text-gray-800">
                          {order?.currency} {order.totalPrice}
                        </p>
                        <div className="flex items-center justify-end py-1 mt-2">
                          {order?.status === 0 ? (
                            <span className="flex w-fit text-dark items-center justify-start space-x-2 px-3 py-1 rounded-lg bg-warning/20">
                              <MdOutlinePendingActions /> <span>Pending</span>
                            </span>
                          ) : order?.status === 1 ? (
                            <span className="flex w-fit text-dark items-center justify-start space-x-2 px-3 py-1 rounded-lg bg-info/10">
                              <MdOutlineLocalShipping />
                              <span>Shipped</span>
                            </span>
                          ) : (
                            <span className="flex w-fit text-dark items-center justify-start space-x-2 px-3 py-1 rounded-lg bg-success/20">
                              <MdOutlineDone />
                              <span>Delivered</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyOrders;

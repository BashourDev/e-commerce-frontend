import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import api from "../../api/api";
import AppButton from "../../components/AppButton";
import SearchInput from "../../components/SearchInput";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const getOrders = async () => {
    const res = await api.get(`/orders?search=${search}`);
    setOrders(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      getOrders();
    }
  };
  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2 lg:space-y-0 lg:space-x-3 w-full bg-white ring-1 ring-lightGray/30 h-16 px-3 lg:px-36 py-2 lg:py-0 flex flex-col md:flex-row justify-between items-center">
        <div className="flex w-64 md:w-[28rem] items-center h-full">
          <SearchInput
            onKeyPress={onKeyPress}
            onChange={setSearch}
            placeholder={"search orders..."}
            Icon={MdSearch}
          />
          <AppButton className="rounded-l-none">search</AppButton>
        </div>
      </div>
      <div className="flex flex-col mx-2 lg:mx-10 ring-2 ring-[#ecebeb] rounded-lg overflow-hidden shadow-lg bg-white">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-center">
                <thead className="border-b bg-[#f9fafb]">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-dark px-6 py-4"
                    >
                      Tracking number
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-dark px-6 py-4"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-dark px-6 py-4"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-dark px-6 py-4"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="bg-white border-b">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order?.id}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {order?.user?.name}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {order?.status}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        change status
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

import React, { Fragment, useEffect, useState } from "react";
import {
  MdOutlineDone,
  MdOutlineLocalShipping,
  MdOutlinePendingActions,
  MdPending,
  MdSearch,
} from "react-icons/md";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AppButton from "../../components/AppButton";
import Loading from "../../components/Loading";
import SearchInput from "../../components/SearchInput";

const Orders = () => {
  // const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getOrders = ({ pageParam = 1 }) => {
    return api.get(`/orders?search=${search}&page=${pageParam}`);
    // setOrders(res.data.data);
  };

  const {
    data: orders,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery(["admin-orders", search], (props) => getOrders(props), {
    getNextPageParam: (pages) => {
      if (pages.data.current_page === pages.data.last_page) {
        return undefined;
      } else {
        return +pages.data.current_page + 1;
      }
    },
    onSettled: (data) => console.log(data),
  });

  const changeStatus = async (id, status) => {
    setIsChangingStatus(true);
    try {
      // let newOrders = orders.map((o) => {
      //   if (o.id === id) {
      //     o.status = status;
      //   }
      //   return o;
      // });
      await api.put(`/orders/${id}/status`, { status: status });

      queryClient.setQueryData(["admin-orders", search], (oldQueryData) => {
        return {
          ...oldQueryData,
          pages: oldQueryData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map((d) => {
                if (d.id === id) {
                  d.status = status;
                }
                return d;
              }),
            },
          })),
        };
      });
      // setOrders(newOrders);
    } catch (error) {
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollingElement.scrollHeight -
        e.target.scrollingElement.scrollTop ===
      e.target.scrollingElement.clientHeight;
    if (bottom) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", (e) => handleScroll(e));

    return () => {
      window.removeEventListener("scroll", (e) => handleScroll(e));
    };
  }, []);

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      refetch();
    }
  };
  return (
    <div className="pb-10 relative">
      {isChangingStatus && (
        <div className="fixed m-auto inset-0 w-screen h-[70vh] flex items-center justify-center">
          <Loading />
        </div>
      )}
      <div className="space-y-2 lg:space-y-0 lg:space-x-3 w-full bg-white ring-1 ring-lightGray/30 h-16 px-3 lg:px-36 py-2 lg:py-0 flex flex-col md:flex-row justify-between items-center">
        <div className="flex w-64 md:w-[28rem] items-center h-full">
          <SearchInput
            onKeyPress={onKeyPress}
            onChange={setSearch}
            placeholder={"search orders..."}
            Icon={MdSearch}
          />
          <AppButton onClick={getOrders} className="rounded-l-none">
            search
          </AppButton>
        </div>
      </div>
      <div className="flex flex-col mx-2 lg:mx-20 mt-6 ring-2 ring-[#ecebeb] rounded-lg overflow-hidden shadow-lg bg-white">
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
                    >
                      Mark as
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.pages?.map((group, i) => (
                    <Fragment key={i}>
                      {group.data.data.map((order) => (
                        <tr
                          key={order.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="cursor-pointer px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                          >
                            {order?.id}
                          </td>
                          <td
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="cursor-pointer text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                          >
                            {order?.user?.name}
                          </td>
                          <td
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="cursor-pointer text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                          >
                            {order?.status === 0 ? (
                              <span className="flex items-center justify-center space-x-2">
                                <MdOutlinePendingActions /> <span>Pending</span>
                              </span>
                            ) : order?.status === 1 ? (
                              <span className="flex items-center justify-center space-x-2">
                                <MdOutlineLocalShipping />
                                <span>Shipped</span>
                              </span>
                            ) : (
                              <span className="flex items-center justify-center space-x-2">
                                <MdOutlineDone />
                                <span>Delivered</span>
                              </span>
                            )}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex items-center justify-center">
                            {order?.status === 0 ? (
                              <button
                                onClick={() => changeStatus(order.id, 1)}
                                className="z-50 flex items-center justify-center space-x-2 px-3 py-2 rounded-md bg-warning/20 hover:bg-warning/30"
                              >
                                <MdOutlineLocalShipping /> <span>Shipped</span>
                              </button>
                            ) : (
                              order?.status === 1 && (
                                <button
                                  onClick={() => changeStatus(order.id, 2)}
                                  className="z-50 flex items-center justify-center space-x-2 px-3 py-2 rounded-md bg-info/10 hover:bg-info/20"
                                >
                                  <MdOutlineDone />
                                  <span>Delivered</span>
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      ))}{" "}
                    </Fragment>
                  ))}
                </tbody>
              </table>
              {isFetchingNextPage && <Loading />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

import React, { useContext, useEffect, useState } from "react";
import {
  MdCircle,
  MdOutlineDone,
  MdOutlineLocalShipping,
  MdOutlinePendingActions,
  MdOutlinePhone,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import moment from "moment";
import CurrencyContext from "../../contexts/currencyContext";
import { toast } from "react-toastify";

const OrderSummary = () => {
  let { id } = useParams();
  const [order, setOrder] = useState({});
  const currencyContext = useContext(CurrencyContext);
  const navigate = useNavigate();

  const getOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error("this order doesn't belong to this user");
      } else if (error?.response?.status === 404) {
        toast.error("this order doesn't exist");
      }
      navigate(-1);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="pt-10 pb-14 px-4 md:px-6 2xl:container 2xl:mx-auto max-w-7xl 2xl:max-w-7xl">
      <div className="flex justify-start item-start space-y-2 flex-col ">
        <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
          Order # {order?.id}
        </h1>
        <p className="text-base font-medium leading-6 text-gray-600">
          created at{" "}
          {moment(order.created_at).format("dddd, MMMM Do YYYY, h:mm a")}
        </p>
        <p className="text-base font-medium leading-6 text-gray-600">
          updated at{" "}
          {moment(order.updated_at).format("dddd, MMMM Do YYYY, h:mm a")}
        </p>
        {order?.status === 0 ? (
          <span className="flex w-fit text-dark items-center justify-start space-x-2 px-3 py-2 rounded-md bg-warning/20">
            <MdOutlinePendingActions /> <span>Pending</span>
          </span>
        ) : order?.status === 1 ? (
          <span className="flex w-fit text-dark items-center justify-start space-x-2 px-3 py-2 rounded-md bg-info/10">
            <MdOutlineLocalShipping />
            <span>Shipped</span>
          </span>
        ) : (
          <span className="flex w-fit text-dark items-center justify-start space-x-2 px-3 py-2 rounded-md bg-success/20">
            <MdOutlineDone />
            <span>Delivered</span>
          </span>
        )}
      </div>
      <div className="mt-7 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
            <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
              Customer’s Cart
            </p>
            {order?.sold_items?.map((si, i) => (
              <div
                key={i}
                className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full "
              >
                <div className="pb-4 md:pb-8 w-full md:w-40">
                  <img
                    className="w-full hidden md:block"
                    src={si.specific?.product?.first_media_only?.original_url}
                    alt="dress"
                  />
                  <img
                    className="w-full md:hidden"
                    src={si.specific?.product?.first_media_only?.original_url}
                    alt="dress"
                  />
                </div>
                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                  <div className="w-full flex flex-col justify-start items-start space-y-8">
                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                      {si.specific?.product?.name}
                    </h3>
                    <div className="flex justify-start items-start flex-col space-y-2">
                      <p className="text-sm leading-none text-gray-800">
                        <span className="text-gray-400">Brand: </span>{" "}
                        {si.specific?.product?.brand?.name}
                      </p>
                      <p className="text-sm leading-none text-gray-800">
                        <span className="text-gray-400">Size: </span>{" "}
                        {si.specific?.size}
                      </p>
                      <p className="text-sm leading-none text-gray-800 flex items-center">
                        <span className="text-gray-400">Color: </span>{" "}
                        <MdCircle color={si.specific?.color} className="mt-1" />
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between space-x-8 items-start w-full">
                    <p className="text-base xl:text-lg leading-6">
                      {order?.currency}{" "}
                      {Number.parseFloat(si.sellPrice).toFixed(2)}
                    </p>
                    <p className="text-base xl:text-lg leading-6 text-gray-800">
                      {si?.quantity}
                    </p>
                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                      {order?.currency}{" "}
                      {Number.parseFloat(si?.quantity * si.sellPrice).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
              <h3 className="text-xl font-semibold leading-5 text-gray-800">
                Summary
              </h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                <div className="flex justify-between  w-full">
                  <p className="text-base leading-4 text-gray-800">Subtotal</p>
                  <p className="text-base leading-4 text-gray-600">
                    {order?.currency}{" "}
                    {Number.parseFloat(order?.totalPrice).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-semibold leading-4 text-gray-800">
                  Total
                </p>
                <p className="text-base font-semibold leading-4 text-gray-600">
                  {order?.currency}{" "}
                  {Number.parseFloat(order?.totalPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
          <h3 className="text-xl font-semibold leading-5 text-gray-800">
            Customer
          </h3>
          <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
            <div className="flex flex-col justify-start items-start flex-shrink-0">
              <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                <div className=" flex justify-start items-start flex-col space-y-2">
                  <p className="text-base font-semibold leading-4 text-left text-gray-800">
                    {order?.user?.name}
                  </p>
                  <p className="text-sm leading-5 text-gray-600">
                    {order?.user?.orders_count} Previous Orders
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center  md:justify-start items-center py-4 space-y-2 border-b border-gray-200 w-full">
                <div className="flex items-center space-x-4 w-full">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                      stroke="#1F2937"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 7L12 13L21 7"
                      stroke="#1F2937"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm leading-5 text-gray-800">
                    {order?.user?.email}
                  </p>
                </div>
                <div className="flex items-center space-x-5 w-full">
                  <MdOutlinePhone className="text-gray-500 w-5 h-5" />
                  <p className="text-sm leading-5 text-gray-800">
                    {order?.user?.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
              <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8">
                  <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                    Shipping Address
                  </p>
                  <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                    {order?.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

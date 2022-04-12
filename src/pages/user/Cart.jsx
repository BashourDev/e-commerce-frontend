import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import api from "../../api/api";
import { MdCircle } from "react-icons/md";
import LoadingCard from "../../components/LoadingCard";
import Loading from "../../components/Loading";
import UserContext from "../../contexts/userContext";
import CurrencyContext from "../../contexts/currencyContext";
import { useNavigate } from "react-router-dom";

export default function Cart({ open, setOpen }) {
  const [specifics, setSpecifics] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isCheckingout, setIsCheckingout] = useState(false);
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const userContext = useContext(UserContext);
  const currencyContext = useContext(CurrencyContext);
  const navigate = useNavigate();

  const calcTotal = () => {
    let tot = 0;
    specifics?.map((spe) => {
      tot +=
        spe.product.discount > 0
          ? (spe.product.sellPrice -
              (spe.product.sellPrice * spe.product.discount) / 100) *
            spe.pivot.quantity
          : spe.product.sellPrice * spe.pivot.quantity;
    });

    tot = Number.parseFloat(tot * currencyContext?.currency?.rate).toFixed(2);

    setTotal(tot);
  };

  const getSpecifics = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/cart");
      setSpecifics(res.data);

      calcTotal();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/cart/${id}/delete`);
      getSpecifics();
    } catch (error) {}
  };

  const handleCheckout = async () => {
    setIsCheckingout(true);
    let soldItems = [];
    specifics.map((spe) =>
      soldItems.push({
        specific_id: spe.id,
        sellPrice:
          spe.product.discount > 0
            ? (spe.product.sellPrice -
                (spe.product.sellPrice * spe.product.discount) / 100) *
              currencyContext?.currency?.rate
            : spe.product.sellPrice * currencyContext?.currency?.rate,
        quantity: spe.pivot.quantity,
      })
    );
    try {
      await api.post("/order/checkout", {
        totalPrice: total,
        currency: currencyContext?.currency?.name,
        address: address,
        phone: phone,
        soldItems: soldItems,
      });
      setShowOrderPlaced(true);
      calcTotal();
    } catch (error) {
    } finally {
      setIsCheckingout(false);
      getSpecifics();
    }
  };

  useEffect(() => {
    getSpecifics();
    setShowOrderPlaced(false);
    calcTotal();
  }, [open]);

  useEffect(() => {
    setAddress(userContext.user.address);
    setPhone(userContext.user.phone);
  }, []);

  useEffect(() => {
    calcTotal();
  }, [specifics]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-20"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {" "}
                        Shopping cart{" "}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          <li className="h-10 m-1 bg-primary text-dark flex items-center justify-center rounded-lg">
                            <button
                              className="w-full h-full"
                              onClick={() => navigate("/my-orders")}
                            >
                              Previous Orders
                            </button>
                          </li>
                          {showOrderPlaced && (
                            <li className="h-10 m-1 bg-primary text-dark flex items-center justify-center rounded-lg">
                              <span>Your order has been placed</span>
                            </li>
                          )}
                          {isLoading ? (
                            <Loading />
                          ) : (
                            specifics.map((specific) => (
                              <li key={specific.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={
                                      specific?.product?.first_media_only
                                        ?.original_url
                                    }
                                    alt={specific?.product?.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={specific.href}>
                                          {" "}
                                          {specific?.product?.name}{" "}
                                        </a>
                                      </h3>
                                      {specific.product.discount > 0 ? (
                                        <div>
                                          <p className="ml-4 line-through text-red-400">
                                            {currencyContext?.currency?.name}{" "}
                                            {Number.parseFloat(
                                              specific?.product?.sellPrice *
                                                currencyContext?.currency?.rate
                                            ).toFixed(2)}
                                          </p>
                                          <p className="ml-4">
                                            {currencyContext?.currency?.name}{" "}
                                            {Number.parseFloat(
                                              (specific?.product?.sellPrice -
                                                (specific?.product?.sellPrice *
                                                  specific.product.discount) /
                                                  100) *
                                                currencyContext?.currency?.rate
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                      ) : (
                                        <p className="ml-4">
                                          {currencyContext?.currency?.name}{" "}
                                          {Number.parseFloat(
                                            specific?.product?.sellPrice *
                                              currencyContext?.currency?.rate
                                          ).toFixed(2)}
                                        </p>
                                      )}
                                    </div>
                                    <span className="mt-1 text-sm flex space-x-2 items-center">
                                      <span>color</span>
                                      <MdCircle color={specific.color} />
                                    </span>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {specific?.pivot?.quantity}
                                    </p>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemove(specific.id)
                                        }
                                        className="font-medium text-primaryDark hover:text-primaryDark/90"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>
                        {currencyContext?.currency?.name} {total}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {/* Shipping and taxes calculated at checkout. */}
                    </p>
                    <div className="mt-6">
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          placeholder="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-1/2 h-10 ring-0 focus:ring-0 outline-none focus:outline-none border rounded-md border-lightGray focus:border-primary"
                        />
                        <input
                          type="text"
                          placeholder="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-1/2 h-10 ring-0 focus:ring-0 outline-none focus:outline-none border rounded-md border-lightGray focus:border-primary"
                        />
                      </div>
                      <button
                        disabled={isCheckingout}
                        onClick={() => handleCheckout()}
                        className="flex items-center justify-center w-full rounded-md border border-transparent bg-primaryDark px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primaryDark/90"
                      >
                        {isCheckingout ? (
                          <Loading className="w-8 h-8" />
                        ) : (
                          "Checkout"
                        )}
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{" "}
                        <button
                          type="button"
                          className="font-medium text-primaryDark hover:text-primaryDark/90"
                          onClick={() => setOpen(false)}
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

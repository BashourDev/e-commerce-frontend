import React, { useContext, useEffect, useState } from "react";
import { MdCircle, MdOutlineShoppingBag, MdShoppingBag } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import AppInput from "../../components/AppInput";
import AppSizeSelect from "../../components/AppSizeSelect";
import Loading from "../../components/Loading";
import CurrencyContext from "../../contexts/currencyContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const currencyContext = useContext(CurrencyContext);
  let addedColors = [];

  const checkColors = (color) => {
    if (addedColors.includes(color)) {
      return false;
    } else {
      addedColors.push(color);
      return true;
    }
  };

  const getProduct = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      setSelectedColor(res.data.specifics[0].color);
      setSelectedImage(res.data?.media[0]?.link);
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error("product does not exist!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleAddToCart = async () => {
    if (
      selectedSize === "" ||
      selectedSize === undefined ||
      selectedSize === null
    ) {
      toast.info("You have to select a size!");
      return;
    }
    setIsAdding(true);
    let selectedSpecific = 0;
    product.specifics.map((spe) => {
      if (spe.color === selectedColor && spe.size === selectedSize) {
        selectedSpecific = spe.id;
      }
    });

    console.log(selectedSpecific);

    try {
      await api.post(`/add-to-cart/${selectedSpecific}`, {
        quantity: qty,
      });
    } catch (error) {
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <section className="text-gray-700 body-font overflow-hidden bg-white">
        <div className="container px-5 py-24 mx-auto">
          {isLoading && <Loading />}
          <div className="lg:w-4/5 mx-auto flex flex-wrap justify-center">
            <div className="space-y-2">
              <img
                alt="ecommerce"
                className="h-[26rem] max-w-sm xl:max-w-md 2xl:max-w-lg object-cover object-center rounded border border-gray-200"
                src={selectedImage}
              />
              <div className="flex space-x-3 items-center">
                {product?.media?.map((media, i) => (
                  <img
                    key={i}
                    src={media?.link}
                    alt=""
                    onClick={() => setSelectedImage(media?.link)}
                    className={`w-20 h-24 object-cover object-center rounded border border-gray-200 cursor-pointer hover:opacity-95 ${
                      selectedImage === media?.link
                        ? "ring-4 ring-primaryDark/60"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 space-y-3">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {product?.brand?.name}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product?.name}
              </h1>

              <p className="leading-relaxed">{product?.description}</p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <span className="mr-3">Color</span>
                  {product?.specifics?.map(
                    (specific, i) =>
                      checkColors(specific.color) && (
                        <MdCircle
                          key={i}
                          onClick={() => setSelectedColor(specific.color)}
                          color={specific.color}
                          className={`${
                            selectedColor === specific.color
                              ? "border-2 border-gray-300"
                              : ""
                          } ml-1 rounded-full w-6 h-6 cursor-pointer focus:outline-none`}
                        ></MdCircle>
                      )
                  )}
                </div>
                <div className="flex ml-6 items-center">
                  <span className="mr-3">Size</span>
                  <div className="relative">
                    <AppSizeSelect
                      value={selectedSize}
                      selectedColor={selectedColor}
                      options={product?.specifics}
                      setFieldValue={setSelectedSize}
                    />
                  </div>
                </div>
                <div className="space-x-3 px-5">
                  <label htmlFor="qty">Quantity</label>
                  <input
                    id="qty"
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    min={1}
                    className="h-10 w-20 rounded-md border-[1px] border-lightGray focus:border-primary transition outline-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row">
                {product?.discount > 0 ? (
                  <div className="flex items-center space-x-3">
                    <span className="title-font font-medium text-2xl text-gray-900">
                      {currencyContext?.currency?.name}{" "}
                      {Number.parseFloat(
                        (product?.sellPrice -
                          (product?.sellPrice * product?.discount) / 100) *
                          currencyContext?.currency?.rate
                      ).toFixed(2)}
                    </span>
                    <span className="title-font font-medium text-lg text-red-400 line-through">
                      {currencyContext?.currency?.name}{" "}
                      {Number.parseFloat(
                        product?.sellPrice * currencyContext?.currency?.rate
                      ).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="title-font font-medium text-2xl text-gray-900">
                    {currencyContext?.currency?.name}{" "}
                    {Number.parseFloat(
                      product?.sellPrice * currencyContext?.currency?.rate
                    ).toFixed(2)}
                  </span>
                )}

                <button
                  disabled={isAdding}
                  onClick={handleAddToCart}
                  className="flex ml-auto w-36 md:w-40 h-10 justify-center items-center text-white bg-primaryDark border-0 py-2 px-3 md:px-6 mt-2 lg:mt-0 focus:outline-none hover:bg-primary hover:text-dark rounded"
                >
                  {isAdding ? (
                    <Loading className={"w-8 h-8"} />
                  ) : (
                    <span className="flex items-center space-x-2">
                      <MdOutlineShoppingBag className="w-4 h-4" />
                      <span className="text-sm">Add To Cart</span>
                    </span>
                  )}
                </button>
                {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;

import React, { useContext, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CurrencyContext from "../contexts/currencyContext";

const ProductsHorizontalList = ({ title, products = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const currencyContext = useContext(CurrencyContext);
  const navigate = useNavigate();
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className}`}
        style={{
          ...style,
          display: props.onClick === null ? "none" : "block",
          background: "white",
          colorAdjust: "black",
          width: props.onClick === null ? "0px" : "60px",
          height: props.onClick === null ? "0px" : "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
          zIndex: props.onClick === null ? 0 : 1000,
          right: props.onClick === null ? "0px" : "15px",
        }}
        onClick={onClick}
      >
        <MdChevronRight
          className={`fixed text-primaryDark ${
            props.onClick === null ? "w-0 h-0" : "w-7 h-7"
          }`}
        />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className}`}
        style={{
          ...style,
          display: props.onClick === null ? "none" : "block",
          background: "white",
          colorAdjust: "black",
          width: props.onClick === null ? "0px" : "60px",
          height: props.onClick === null ? "0px" : "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
          zIndex: props.onClick === null ? 0 : 1000,
          left: props.onClick === null ? "0px" : "15px",
        }}
        onClick={onClick}
      >
        <MdChevronLeft
          className={`fixed text-primaryDark ${
            props.onClick === null ? "w-0 h-0" : "w-7 h-7"
          }`}
        />
      </div>
    );
  }

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    adaptiveHeight: true,
    arrows: true,
    className: "slider variable-width",
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
          dots: false,
          arrows: true,
        },
      },
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
          arrows: true,
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          initialSlide: 0,
          infinite: false,
          dots: false,
          arrows: true,
          adaptiveHeight: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
          infinite: false,
          dots: false,
          arrows: false,
          adaptiveHeight: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.3,
          slidesToScroll: 1,
          initialSlide: 0,
          infinite: false,
          arrows: false,
          adaptiveHeight: false,
          //   centerMode: true,
          //   centerPadding: "20%",
        },
      },
    ],
  };

  return (
    <div className="bg-primary/10 shadow-sm shadow-primaryDark/30 border-[2px] border-primary/70 rounded-md py-4">
      <div className="px-2 sm:px-6 lg:px-8 xl:px-28 pb-4 flex justify-between">
        <h2 className="text-dark font-semibold text-xl">{title}</h2>
        {/* <button className="text-primaryDark hover:text-primaryDark/90">
          show more
        </button> */}
      </div>
      <Slider {...settings}>
        {products.map((product) => (
          <div
            onDragStartCapture={() => setIsDragging(true)}
            onDragEndCapture={() =>
              setTimeout(() => setIsDragging(false), 1000)
            }
            key={product.id}
            className="group relative px-3 w-56"
          >
            <div className="min-h-72 h-72 w-56 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 lg:aspect-none">
              <img
                src={product?.first_media_only?.original_url}
                alt={product?.first_media_only?.name}
                draggable={false}
                className="w-full h-full drag object-center object-cover lg:w-full lg:h-full"
              />
            </div>
            <div className="mt-4 flex justify-between w-56">
              <div>
                <h3 className="text-sm text-gray-700">
                  <button
                    onClick={() =>
                      !isDragging && navigate(`/products/${product.id}`)
                    }
                  >
                    <span
                      aria-hidden="true"
                      draggable={false}
                      className="absolute inset-0"
                    />
                    {product.name}
                  </button>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.brand?.name}
                </p>
              </div>
              {product.discount > 0 ? (
                <div>
                  <p className="text-sm font-medium line-through text-red-400">
                    {currencyContext?.currency?.name}{" "}
                    {Number.parseFloat(
                      product.sellPrice * currencyContext?.currency?.rate
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {currencyContext?.currency?.name}{" "}
                    {Number.parseFloat(
                      (product.sellPrice -
                        (product.sellPrice * product.discount) / 100) *
                        currencyContext?.currency?.rate
                    ).toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-900">
                  {currencyContext?.currency?.name}{" "}
                  {Number.parseFloat(
                    product.sellPrice * currencyContext?.currency?.rate
                  ).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductsHorizontalList;

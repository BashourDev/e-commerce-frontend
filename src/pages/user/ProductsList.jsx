import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import LoadingCard from "../../components/LoadingCard";
import CurrencyContext from "../../contexts/currencyContext";

const ProductsList = ({ products = [], isLoading, isFetchingNextPage }) => {
  const currencyContext = useContext(CurrencyContext);
  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-4 px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Customers also purchased
        </h2> */}

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {isLoading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : (
            products?.pages?.map((group, i) => (
              <Fragment key={i}>
                {group.data.data.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                      <img
                        src={product?.first_media_only?.original_url}
                        alt={product.imageAlt}
                        className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <Link to={`/products/${product.id}`}>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {product.name}
                          </Link>
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
                              product.sellPrice *
                                currencyContext?.currency?.rate
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
              </Fragment>
            ))
          )}
        </div>
        {isFetchingNextPage && <Loading />}
      </div>
    </div>
  );
};

export default ProductsList;

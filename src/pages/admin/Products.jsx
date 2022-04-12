import React, { Fragment, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { NavLink } from "react-router-dom";
import ProductCard from "../../components/admin/ProductCard";
import AppButton from "../../components/AppButton";
import SearchInput from "../../components/SearchInput";
import api from "../../api/api";
import Currencies from "./Currencies";
import UpdateSpecifics from "../../components/admin/UpdateSpecifics";
import { useInfiniteQuery } from "react-query";
import LoadingCard from "../../components/LoadingCard";
import Loading from "../../components/Loading";

const Products = () => {
  // const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isCurrenciesOpen, setIsCurrenciesOpen] = useState(false);
  const [isSpecificsOpen, setIsSpecificsOpen] = useState(false);
  const [productID, setProductID] = useState(0);

  const getProducts = ({ pageParam = 1 }) => {
    return api.get(`/products?search=${search}&page=${pageParam}`);
    // setProducts(res.data);
    // console.log("====================================");
    // console.log("products", products);
    // console.log("====================================");
  };

  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    ["admin-products", search],
    (props) => getProducts(props),
    {
      getNextPageParam: (pages) => {
        if (pages.data.current_page === pages.data.last_page) {
          return undefined;
        } else {
          return +pages.data.current_page + 1;
        }
      },
      onSettled: (data) => console.log(data),
    }
  );

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      refetch();
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

  return (
    <>
      <div className="w-full min-h-full">
        <div className="space-y-2 lg:space-y-0 lg:space-x-3 w-full bg-white ring-1 ring-lightGray/30 h-24 lg:h-16 px-3 lg:px-36 py-2 lg:py-0 flex flex-col md:flex-row justify-between items-center">
          <div className="flex w-64 md:w-[28rem]">
            <SearchInput
              onKeyPress={onKeyPress}
              onChange={setSearch}
              placeholder={"search products..."}
              Icon={MdSearch}
            />
            <AppButton className="rounded-l-none">search</AppButton>
          </div>
          <div className="flex items-center space-x-3">
            <NavLink
              to={"add"}
              className="bg-primaryDark text-white px-3 py-1 h-10 rounded-md text-sm lg:text-base flex items-center justify-center"
            >
              Add Product
            </NavLink>
            <AppButton onClick={() => setIsCurrenciesOpen(true)}>
              Currencies
            </AppButton>
          </div>
        </div>
        <div className="w-full place-items-center px-3 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {isLoading ? (
            <>
              <LoadingCard className="w-3/4 md:w-2/4 lg:w-3/5" />
              <LoadingCard className="w-3/4 md:w-2/4 lg:w-3/5" />
              <LoadingCard className="w-3/4 md:w-2/4 lg:w-3/5" />
              <LoadingCard className="w-3/4 md:w-2/4 lg:w-3/5" />
            </>
          ) : (
            products?.pages?.map((group, i) => (
              <Fragment key={i}>
                {group.data.data.map((product) => (
                  <ProductCard
                    key={product?.id}
                    id={product?.id}
                    name={product?.name}
                    description={product?.description}
                    img={product?.first_media_only?.original_url}
                    // setProducts={setProducts}
                    setProductID={setProductID}
                    setIsSpecificOpen={setIsSpecificsOpen}
                    search={search}
                  />
                ))}
              </Fragment>
            ))
          )}
          {/* {products?.data?.map((product) => (
            <ProductCard
              key={product?.id}
              id={product?.id}
              name={product?.name}
              description={product?.description}
              img={product?.first_media_only?.original_url}
              // setProducts={setProducts}
              setProductID={setProductID}
              setIsSpecificOpen={setIsSpecificsOpen}
            />
          ))} */}
          {/* <ProductCard name={"sdsadsa"} description={"sadsadas"} img={"#"} /> */}
        </div>
        {isFetchingNextPage && <Loading />}
      </div>
      <Currencies isOpen={isCurrenciesOpen} setIsOpen={setIsCurrenciesOpen} />
      <UpdateSpecifics
        isOpen={isSpecificsOpen}
        setIsOpen={setIsSpecificsOpen}
        productID={productID}
      />
    </>
  );
};

export default Products;

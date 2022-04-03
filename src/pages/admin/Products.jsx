import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { NavLink } from "react-router-dom";
import ProductCard from "../../components/admin/ProductCard";
import AppButton from "../../components/AppButton";
import SearchInput from "../../components/SearchInput";
import api from "../../api/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      getProducts();
    }
  };

  const getProducts = async () => {
    const res = await api.get(`/products?search=${search}`);
    setProducts(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="w-full min-h-full overflow-y-auto">
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
        <NavLink
          to={"add"}
          className="bg-primaryDark text-white px-3 py-1 h-10 rounded-md text-sm lg:text-base flex items-center justify-center"
        >
          Add Product
        </NavLink>
      </div>
      <div className="w-full place-items-center px-3 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {products?.data?.map((product) => (
          <ProductCard
            key={product?.id}
            id={product?.id}
            name={product?.name}
            description={product?.description}
            img={product?.media[0]?.link}
            setProducts={setProducts}
          />
        ))}
        {/* <ProductCard name={"sdsadsa"} description={"sadsadas"} img={"#"} /> */}
      </div>
    </div>
  );
};

export default Products;

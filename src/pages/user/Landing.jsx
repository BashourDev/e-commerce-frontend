import React, { useEffect, useState } from "react";
import ProductsHorizontalList from "../../components/ProductsHorizontalList";
import api from "../../api/api";
import Loading from "../../components/Loading";

const Landing = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTags = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/home/tags");
      setTags(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTags();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-5 space-y-10 overflow-x-hidden">
      {isLoading ? (
        <Loading />
      ) : (
        tags?.map((tag, i) => (
          <ProductsHorizontalList
            key={tag.id}
            title={tag.name}
            products={tag.products}
          />
        ))
      )}
    </div>
  );
};

export default Landing;

import React from "react";
import { MdPreview, MdEdit, MdDelete, MdCollections } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { conf } from "../appConfirm";

const ProductCard = ({
  id,
  img = "",
  name = "",
  description = "",
  setProducts,
  setProductID,
  setIsSpecificOpen,
  search = "",
}) => {
  const queryClient = useQueryClient();

  const handleSpecifics = () => {
    setProductID(id);
    setIsSpecificOpen(true);
  };

  const handleDelete = async () => {
    let result = await conf(`Are you sure you want to delete ${name}?`);

    if (!result) {
      return;
    }
    try {
      await api.delete(`/products/${id}/delete`);
      // setProducts((old) => ({
      //   ...old,
      //   data: old?.data?.filter((product) => product.id !== id),
      // }));
      toast.success("product deleted successfully");
      queryClient.setQueryData(["admin-products", search], (oldQueryData) => {
        return {
          ...oldQueryData,
          pages: oldQueryData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.filter((d) => d.id !== id),
            },
          })),
        };
      });
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error("Unauthorized");
      } else if (error?.response?.status === 404) {
        toast.error("Product does not exist");
      } else {
        toast.error("An internal error occured");
      }
    }
  };
  return (
    <div className="flex flex-col overflow-hidden justify-between pb-3 bg-white ring-1 ring-lightGray/50 shadow-lg shadow-light rounded-md w-64 h-96 transition duration-300 hover:scale-105">
      <img
        className="w-full h-full bg-gradient-to-t from-warning/80 to-info/80"
        src={img}
        alt="product's image is not available"
      />
      <div className="flex flex-col h-36 justify-end px-2 ">
        <h3 className="text-lg font-medium">{name}</h3>
        <h5 className="text-base text-dark mb-2">{description}</h5>
        <div className="flex gap-4 items-center justify-center">
          {/* <MdPreview className="text-info w-7 h-7 cursor-pointer" /> */}
          <MdCollections
            onClick={handleSpecifics}
            className="text-info w-7 h-7 cursor-pointer"
          />
          <Link to={`/admin/products/edit/${id}`}>
            <MdEdit className="text-warning w-7 h-7 cursor-pointer" />
          </Link>
          <MdDelete
            onClick={handleDelete}
            className="text-danger w-7 h-7 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

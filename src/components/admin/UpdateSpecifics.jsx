import React, { useEffect, useState } from "react";
import { MdArrowDropUp, MdCancel, MdCircle } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../../api/api";
import AppButton from "../AppButton";
import AppModal from "../AppModal";

const UpdateSpecifics = ({ isOpen, setIsOpen, productID }) => {
  const [color, setColor] = useState("#000000");
  const [colorText, setColorText] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [QNS, setQNS] = useState([]);
  const [deletedQNS, setDeletedQNS] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveQNS = (i, id) => {
    setQNS((old) => old.filter((_qns, j) => j !== i));
    if (id) {
      setDeletedQNS((old) => [...old, id]);
    }
  };

  const handleEdit = (i, item) => {
    handleRemoveQNS(i, item.id);
    setColor(item.color);
    setColorText(item.colorText);
    setSize(item.size);
    setQuantity(item.quantity);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await api.put(`/products/${productID}/specifics/update`, {
        new_qns: QNS,
        deleted: deletedQNS,
      });
      toast.success("Update successfully");
      onClose();
    } catch (error) {
      toast.error("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const getSpecifics = async () => {
    const res = await api.get(`/products/${productID}/specifics`);
    setQNS(res.data);
  };

  useEffect(() => {
    setDeletedQNS([]);
    setQNS([]);
    setColor("#000000");
    setColorText("");
    setSize("");
    setQuantity(0);
    if (productID !== 0) {
      getSpecifics();
    }
  }, [productID]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"Colors and Sizes"}>
      <div className="flex flex-col space-y-5 flex-wrap">
        <label className="text-sm text-dark">
          Choose Colors and Sizes and Their Quantites:
        </label>

        <div className="space-x-0 lg:space-x-0 flex flex-col lg:flex-row flex-wrap space-y-2 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <label htmlFor={`color`}>Color:</label>
            <input
              id={`colorText`}
              type="text"
              value={colorText}
              onChange={(e) => setColorText(e.target.value)}
              placeholder="White"
              className="border-[1px] p-1 border-lightGray rounded-md w-20 md:w-28 focus:outline-none focus:border-primary"
            />
            <input
              id={`color`}
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
              }}
              className="w-7 h-7 rounded-full overflow-hidden border-0 outline-none bg-transparent"
            />
            <label htmlFor={`size`}>Size:</label>
            <input
              id={`size`}
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="XL"
              className="border-[1px] p-1 border-lightGray rounded-md w-20 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-3 py-3">
            <label htmlFor={`quantity`}>Quantity:</label>
            <input
              id={`quantity`}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="quantity"
              className="border-[1px] p-1 border-lightGray rounded-md w-20 focus:outline-none focus:border-primary"
            />
            <AppButton
              className="w-36 lg:w-44"
              onClick={() =>
                setQNS((old) => [
                  ...old,
                  {
                    color: color,
                    colorText: colorText,
                    size: size,
                    quantity: quantity,
                  },
                ])
              }
            >
              Add
            </AppButton>
          </div>
        </div>
        <div className="flex flex-wrap max-h-[50vh] overflow-y-scroll">
          {QNS.map((item, i) => (
            <div
              key={i}
              className="bg-primary text-dark h-7 rounded-full m-1 px-2 flex justify-between items-center space-x-3 w-fit"
            >
              <span className="flex items-center">
                <MdCircle color={item.color} className={`text-lg`} />
                {" / "} {item.colorText}
                {" / "}
                {item.size} {" / "} {item.quantity}
              </span>
              <MdArrowDropUp
                onClick={() => handleEdit(i, item)}
                className="text-lg cursor-pointer"
              />
              <MdCancel
                onClick={() => handleRemoveQNS(i, item.id)}
                className="text-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
        <AppButton isLoading={isLoading} onClick={handleSubmit}>
          Submit
        </AppButton>
      </div>
    </AppModal>
  );
};

export default UpdateSpecifics;

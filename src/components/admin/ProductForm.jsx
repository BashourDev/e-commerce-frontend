import React, { useEffect, useState } from "react";
import AppSubmitButton from "../AppSubmitButton";
import AppForm from "../AppForm";
import AppFormTextArea from "../AppFormTextArea";
import AppInput from "../AppInput";
import AppSelect from "../AppSelect";
import Categories from "../../pages/admin/Categories";
import AppButton from "../AppButton";
import { AiOutlinePlus } from "react-icons/ai";
import AppFileInput from "../AppFileInput";
import { MdCancel, MdCircle, MdDelete } from "react-icons/md";
import * as Yup from "yup";
import api from "../../api/api";
import AppSelectProductCategory from "./AppSelectProductCategory";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Brands from "../../pages/admin/Brands";
import AppSelectTags from "./AppSelectTags";
import Tags from "../../pages/admin/Tags";
import ProgressBar from "@ramonak/react-progress-bar";

const ProductForm = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [photosURLs, setPhotosURLs] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [QNS, setQNS] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  const onPhotosChange = (e) => {
    setPhotos((old) => [...old, ...e.target.files]);
    let array = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      array.push(URL.createObjectURL(file));
    }
    setPhotosURLs((old) => [...old, ...array]);
  };

  const removeImage = async (i) => {
    setPhotosURLs((old) => old.filter((_photo, j) => j !== i));
    setPhotos((old) => old.filter((photo, j) => old.indexOf(photo) !== i));
  };

  const getCategories = async () => {
    const res = await api.get("/categories/items");
    setCategories(res.data);
  };

  const getBrands = async () => {
    const res = await api.get("/brands");
    setBrands(res.data);
  };

  const getTags = async () => {
    const res = await api.get("/tags");
    setTags(res.data);
  };

  const handleTagsChange = (tag) => {
    setSelectedTags((old) => [...old, tag]);
  };

  const handleTagsRemove = (sTag) => {
    setSelectedTags((old) => old.filter((tag) => tag.id !== sTag.id));
  };

  const handleRemoveQNS = (i) => {
    setQNS((old) => old.filter((_qns, j) => j !== i));
  };

  useEffect(() => {
    getBrands();
  }, [isBrandsOpen]);

  useEffect(() => {
    getTags();
  }, [isTagsOpen]);

  useEffect(() => {
    getCategories();
  }, [isCategoriesOpen]);

  const create = async (values) => {
    // let fl = new FileListItems(photos);
    try {
      let formData = new FormData();

      for (let i = 0; i < photos.length; i++) {
        let file = photos[i];
        formData.append("photo" + i, file);
      }

      formData.append("photosCount", photos.length);

      console.log("====================================");
      console.log("length", photos.length);
      console.log("====================================");

      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      console.log("QNS", QNS);

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("buyPrice", values.buyPrice);
      formData.append("sellPrice", values.sellPrice);
      formData.append("discount", values.discount);
      formData.append("category", JSON.stringify(values.category));
      formData.append("brand", JSON.stringify(values.brand));
      formData.append("tags", JSON.stringify(selectedTags));
      formData.append("specifics", JSON.stringify(QNS));
      // formData.append("photos", fl);
      // console.log(fl);
      const res = await api.post("/products/create", formData, {
        onUploadProgress: (progressEvent) =>
          setUploadProgress(
            Number.parseInt((progressEvent.loaded / progressEvent.total) * 100)
          ),
      });
      toast.success("product added successfully");
      setUploadProgress(0);
      navigate("/admin/products");

      // const resI = await api.post(`/products/${"18"}/add-images`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // console.log(resI);

      console.log(res);
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error("Unauthorized");
      } else if (error?.response?.status === 404) {
        toast.error("Product does not exist");
      } else {
        toast.error("An internal error occured");
        console.log("====================================");
        console.log("error", error);
        console.log("====================================");
      }
    }
  };

  const addimages = async (event) => {
    let formData = new FormData();
    console.log("====================================");
    console.log(event.target.files);
    console.log("====================================");

    for (let i = 0; i < event.target.files.length; i++) {
      let file = event.target.files[i];
      formData.append("photo" + i, file);
    }

    formData.append("photosCount", event.target.files.length);

    // for (var key of formData.entries()) {
    //   console.log(key[0] + ", " + key[1]);
    // }

    // console.log(formData);

    // return;

    // formData.append("photos", [...event.target.files]);

    const resI = await api.post(`/products/${"18"}/add-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(resI);
  };

  return (
    <div className="h-fit mx-3 xl:mx-52 px-1 lg:px-10 ring-1 rounded-lg ring-lightGray/50 bg-white py-6 my-5 shadow-lg grid grid-cols-1 lg:grid-cols-2 lg:gap-x-20 gap-y-4  justify-center">
      {uploadProgress !== 0 && (
        <ProgressBar
          height="14px"
          completed={uploadProgress}
          className="w-full col-span-1 lg:col-span-2"
          labelClassName="text-xs text-white mx-2 font-semibold font-lato"
          bgColor="#f3dac2"
        />
      )}
      <AppForm
        initialValues={{
          name: "",
          keywords: "",
          description: "",
          buyPrice: +"",
          sellPrice: +"",
          discount: +"",
          category: "",
          brand: {},
        }}
        validationSchema={Yup.object().shape({})}
        onSubmit={create}
      >
        <div className="col-span-1 lg:col-span-2 space-y-2 lg:space-y-0 lg:space-x-2 flex flex-col lg:flex-row flex-start items-center">
          <AppFileInput
            id={"photos"}
            label={"Select Photos:"}
            containerClassName={"w-full lg:w-72"}
            onChange={onPhotosChange}
          />
          <div className="flex overflow-x-auto">
            {photosURLs.map((photo, i) => (
              <div key={i} className="relative mx-1 rounded-md overflow-hidden">
                <img
                  src={photo}
                  alt={"photos"}
                  className="w-52 h-28 object-cover"
                />
                <div className="absolute top-1 left-1 w-full h-full">
                  <MdDelete
                    className="text-danger text-2xl cursor-pointer"
                    onClick={() => removeImage(i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
          <AppInput
            id={"name"}
            label="Product Name:"
            placeholder={"product name"}
          />
          <AppInput
            id={"keywords"}
            label="Product Search Keywords:"
            placeholder={"product search keywords"}
          />
        </div>
        <div className="col-span-2 grid grid-cols-6 lg:grid-cols-12 lg:gap-x-20 items-center justify-center">
          <div className="grid grid-cols-6 items-center col-span-6 gap-x-1">
            <AppSelectTags
              label="Product Tags:"
              placeholder={"product tags"}
              className={"col-span-5"}
              options={tags}
              handleChange={handleTagsChange}
            />
            <AppButton
              className="col-span-1 mt-8 px-0 flex items-center justify-center"
              onClick={() => setIsTagsOpen(true)}
            >
              {<AiOutlinePlus className="self-center" />}
            </AppButton>
          </div>
          <div className="grid grid-cols-6 items-center col-span-6 gap-x-1">
            <AppSelect
              name={"brand"}
              label={"Select Brand:"}
              options={brands}
              className="col-span-5"
            />
            <AppButton
              className="col-span-1 mt-8 px-0 flex items-center justify-center"
              onClick={() => setIsBrandsOpen(true)}
            >
              {<AiOutlinePlus className="self-center" />}
            </AppButton>
          </div>
        </div>
        <div className="flex flex-wrap">
          {selectedTags.map((item, i) => (
            <div
              key={i}
              className="bg-primary text-dark h-7 rounded-full m-1 px-2 flex justify-between items-center space-x-3 w-fit"
            >
              <span className="flex items-center">{item?.name}</span>
              <MdCancel
                onClick={() => handleTagsRemove(item)}
                className="text-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
        <div className="col-span-2 lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-4">
          <AppInput
            id={"buyPrice"}
            label="Product Buy Price:"
            placeholder={"product buy price"}
            type={"number"}
          />
          <AppInput
            id={"sellPrice"}
            label="Product Sell Price:"
            placeholder={"product sell price"}
            type={"number"}
          />
          <AppInput
            id={"discount"}
            label="Product Discount (%):"
            placeholder={"product discount"}
            type={"number"}
          />
        </div>

        <AppFormTextArea
          id={"description"}
          label="Product Description:"
          placeholder={"product description"}
          containerClassName="col-span-2"
        />
        <div className="col-span-2 grid grid-cols-12 gap-x-1 items-center justify-center">
          <AppSelectProductCategory
            name={"category"}
            label={"Select Category:"}
            options={categories}
            className="col-span-10 lg:col-span-11"
          />
          <AppButton
            className="col-span-2 lg:col-span-1 mt-8 px-0 flex items-center justify-center"
            onClick={() => setIsCategoriesOpen(true)}
          >
            {<AiOutlinePlus className="self-center" />}
          </AppButton>
        </div>
        <div className="flex flex-col space-y-5">
          <label>Choose Colors and Sizes and Their Quantites:</label>

          <div className="space-x-0 lg:space-x-3 flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <label htmlFor={`color`}>Color:</label>
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
                placeholder="size"
                className="border-[1px] p-1 border-lightGray rounded-md w-20 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center space-x-3">
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
                onClick={() =>
                  setQNS((old) => [
                    ...old,
                    { color: color, size: size, quantity: quantity },
                  ])
                }
              >
                Add
              </AppButton>
            </div>
          </div>
          <div className="flex flex-wrap">
            {QNS.map((item, i) => (
              <div
                key={i}
                className="bg-primary text-dark h-7 rounded-full m-1 px-2 flex justify-between items-center space-x-3 w-fit"
              >
                <span className="flex items-center">
                  <MdCircle color={item.color} className={`text-lg`} />
                  {" / "}
                  {item.size} {" / "} {item.quantity}
                </span>
                <MdCancel
                  onClick={() => handleRemoveQNS(i)}
                  className="text-lg cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        <AppSubmitButton className="col-span-2">Add</AppSubmitButton>
      </AppForm>
      <Categories isOpen={isCategoriesOpen} setIsOpen={setIsCategoriesOpen} />
      <Brands isOpen={isBrandsOpen} setIsOpen={setIsBrandsOpen} />
      <Tags isOpen={isTagsOpen} setIsOpen={setIsTagsOpen} />
    </div>
  );
};

export default ProductForm;

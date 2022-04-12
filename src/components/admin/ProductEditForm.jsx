import React, { useContext, useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import Brands from "../../pages/admin/Brands";
import AppSelectTags from "./AppSelectTags";
import Tags from "../../pages/admin/Tags";
import ProgressBar from "@ramonak/react-progress-bar";
import CurrencyContext from "../../contexts/currencyContext";

const ProductEditForm = () => {
  const [product, setProduct] = useState({});
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [photosURLs, setPhotosURLs] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [QNS, setQNS] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    keywords: "",
    description: "",
    buyPrice: +"",
    sellPrice: +"",
    discount: +"",
    category: "",
    brand: "",
  });
  const currencyContext = useContext(CurrencyContext);
  const navigate = useNavigate();
  let { pID } = useParams();

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

  const removeExistingPhoto = async (imageID) => {
    try {
      await api.delete(`/products/${product?.id}/images/delete/${imageID}`);
      setProduct((old) => ({
        ...old,
        media: old.media.filter((o) => o.id !== imageID),
      }));
    } catch (error) {}
  };

  const getProduct = async () => {
    const res = await api.get(`/products/${pID}`);
    setProduct(res.data);
    setInitialValues({
      name: res?.data?.name,
      keywords: res?.data?.keywords,
      description: res?.data?.description,
      buyPrice: +res?.data?.buyPrice * currencyContext?.currency?.rate,
      sellPrice: +res?.data?.sellPrice * currencyContext?.currency?.rate,
      discount: +res?.data?.discount,
      category: res?.data?.categories[0][0],
      brand: res?.data?.brand,
    });
    setSelectedTags((old) => [...old, ...res?.data?.tags]);
    console.log(res.data);
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

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    getBrands();
  }, [isBrandsOpen]);

  useEffect(() => {
    getTags();
  }, [isTagsOpen]);

  useEffect(() => {
    getCategories();
  }, [isCategoriesOpen]);

  const update = async (values) => {
    try {
      let formData = new FormData();

      for (let i = 0; i < photos.length; i++) {
        let file = photos[i];
        formData.append("photo" + i, file);
      }

      formData.append("photosCount", photos.length);

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append(
        "buyPrice",
        values.buyPrice / currencyContext?.currency?.rate
      );
      formData.append(
        "sellPrice",
        values.sellPrice / currencyContext?.currency?.rate
      );
      formData.append("discount", values.discount);
      formData.append("category", JSON.stringify(values.category));
      formData.append("brand", JSON.stringify(values.brand));
      formData.append("tags", JSON.stringify(selectedTags));

      const res = await api.post(`/products/${product.id}/update`, formData, {
        onUploadProgress: (progressEvent) =>
          setUploadProgress(
            Number.parseInt((progressEvent.loaded / progressEvent.total) * 100)
          ),
      });
      console.log("====================================");
      console.log(res);
      console.log("====================================");
      toast.success("product updated successfully");
      setUploadProgress(0);
      navigate("/admin/products");
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
        initialValues={initialValues}
        validationSchema={Yup.object().shape({})}
        onSubmit={update}
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
                  className="max-w-xs h-28 object-cover"
                />
                <div className="absolute top-1 left-1 w-full h-full">
                  <MdDelete
                    className="text-danger text-2xl cursor-pointer"
                    onClick={() => removeImage(i)}
                  />
                </div>
              </div>
            ))}
            {product?.media?.map((photo, i) => (
              <div key={i} className="relative mx-1 rounded-md overflow-hidden">
                <img
                  src={photo?.original_url}
                  alt={"photos"}
                  className="max-w-xs h-28 object-cover"
                />
                <div className="absolute top-1 left-1 w-full h-full">
                  <MdDelete
                    className="text-danger text-2xl cursor-pointer"
                    onClick={() => removeExistingPhoto(photo?.id)}
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

        <AppSubmitButton className="col-span-2">Update</AppSubmitButton>
      </AppForm>
      <Categories isOpen={isCategoriesOpen} setIsOpen={setIsCategoriesOpen} />
      <Brands isOpen={isBrandsOpen} setIsOpen={setIsBrandsOpen} />
      <Tags isOpen={isTagsOpen} setIsOpen={setIsTagsOpen} />
    </div>
  );
};

export default ProductEditForm;

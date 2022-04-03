import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/admin/CategoryCard";
import AppButton from "../../components/AppButton";
import AppForm from "../../components/AppForm";
import AppInput from "../../components/AppInput";
import AppModal from "../../components/AppModal";
import AppSelect from "../../components/AppSelect";
import * as Yup from "yup";
import AppSubmitButton from "../../components/AppSubmitButton";
import api from "../../api/api";

const CategoryForm = ({ setIsOpen }) => {
  const [roots, setRoots] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const types = [
    {
      id: 0,
      name: "Root",
    },
    {
      id: 1,
      name: "Section",
    },
    {
      id: 2,
      name: "Item",
    },
  ];

  const getSNR = async () => {
    const resR = await api.get("/categories/roots");
    const resS = await api.get("/categories/sections");
    setRoots(resR.data);
    setSections(resS.data);
  };

  useEffect(() => {
    getSNR();
  }, []);

  const create = async (values) => {
    setIsLoading(true);
    try {
      await api.get(
        process.env.REACT_APP_API_ABSOLUTE + "/sanctum/csrf-cookie"
      );
      await api.post("/categories/create", values);
      setIsOpen(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ type: types[0], name: "" }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required().label("Name"),
        })}
        onSubmit={create}
      >
        {({ values }) => (
          <>
            <AppSelect name={"type"} label={"Type:"} options={types} />
            {values["type"]?.id !== 0 && (
              <AppSelect
                name={"parent"}
                label={
                  values["type"]?.id === 1 ? "Parent Root:" : "Parent Section:"
                }
                options={values["type"]?.id === 1 ? roots : sections}
              />
            )}
            <AppInput id={"name"} label={"Name:"} placeholder={"enter name"} />
            <div className="flex justify-around items-center py-3">
              <AppSubmitButton>Add</AppSubmitButton>
              <AppButton className="bg-transparent text-primaryDark">
                Cancel
              </AppButton>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

const Categories = ({ isOpen, setIsOpen }) => {
  const [isCreate, setIsCreate] = useState(true);
  let data = [
    { name: "cat 1", productsCount: 3 },
    { name: "cat 2", productsCount: 4 },
  ];

  const onClose = () => {
    setIsOpen(false);
    // setTimeout(() => setIsCreate(false), 1000);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"Categories"}>
      {!isCreate ? (
        <>
          {data.map((item, i) => (
            <CategoryCard
              key={i}
              name={item.name}
              productsCount={item.productsCount}
            />
          ))}
          <div className="flex justify-around w-full mt-4">
            <AppButton onClick={() => setIsCreate(true)}>create</AppButton>
            <AppButton
              onClick={onClose}
              className="text-primaryDark bg-inherit"
            >
              close
            </AppButton>
          </div>
        </>
      ) : (
        <CategoryForm setIsOpen={setIsOpen} />
      )}
    </AppModal>
  );
};

export default Categories;

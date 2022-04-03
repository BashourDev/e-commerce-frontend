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

const TagForm = ({ setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const create = async (values) => {
    setIsLoading(true);
    try {
      await api.get(
        process.env.REACT_APP_API_ABSOLUTE + "/sanctum/csrf-cookie"
      );
      await api.post("/tags/create", values);
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
        initialValues={{ name: "" }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required().label("Name"),
        })}
        onSubmit={create}
      >
        {({ values }) => (
          <>
            <AppInput id={"name"} label={"Name:"} placeholder={"enter name"} />
            <div className="flex justify-around items-center py-3">
              <AppSubmitButton isLoading={isLoading}>Add</AppSubmitButton>
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

const Tags = ({ isOpen, setIsOpen }) => {
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"Tags"}>
      <TagForm setIsOpen={setIsOpen} />
    </AppModal>
  );
};

export default Tags;

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

const Currencies = ({ isOpen, setIsOpen }) => {
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const create = async (values) => {
    setIsLoading(true);
    try {
      const res = await api.post("/currencies/create", values);
      // setIsOpen(false);
      setCurrencies((old) => [...old, res.data]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (values) => {
    setIsLoading(true);
    try {
      await api.post(`/currencies/${values?.id}/update`, values);
      //   setCurrencies((old) =>
      //     old.map((o) => {
      //       if (o.id === values.id) {
      //         o.name = values.name;
      //         o.rate = values.rate;
      //       }
      //       return o;
      //     })
      //   );
      // setIsOpen(false);
    } catch (error) {}

    setIsLoading(false);
  };

  const getCurrencies = async () => {
    const res = await api.get("/currencies");
    setCurrencies(res.data);
  };

  useEffect(() => {
    getCurrencies();
  }, [isOpen]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"Currencies"}>
      <span className="text-sm text-dark font-normal">USD Exchange Rate</span>
      <Formik
        enableReinitialize
        initialValues={{ name: "", rate: "" }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required().label("Name"),
          rate: Yup.number()
            .positive("Rate must be a number")
            .required()
            .label("Rate"),
        })}
        onSubmit={create}
      >
        {({ values }) => (
          <div className="flex space-x-2 justify-center items-center pb-7">
            <AppInput id={"name"} label={"Name:"} placeholder={"enter name"} />
            <AppInput
              id={"rate"}
              label={"Rate:"}
              placeholder={"enter rate"}
              containerClassName={"m-0 p-0"}
              className={"m-0 p-0"}
            />

            <AppSubmitButton isLoading={isLoading} className={"mt-5"}>
              Create
            </AppSubmitButton>
          </div>
        )}
      </Formik>
      {currencies?.map((currency) => (
        <Formik
          key={currency?.id}
          enableReinitialize
          initialValues={{
            id: currency?.id,
            name: currency?.name,
            rate: currency?.rate,
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required().label("Name"),
            rate: Yup.number()
              .positive("Rate must be a number")
              .required()
              .label("Rate"),
          })}
          onSubmit={update}
        >
          {({ values }) => (
            <div className="flex space-x-2 justify-center items-center  mt-4">
              <AppInput id={"name"} placeholder={"enter name"} />
              <AppInput
                id={"rate"}
                placeholder={"enter rate"}
                containerClassName={"m-0 p-0"}
                className={"m-0 p-0"}
              />

              <AppSubmitButton isLoading={isLoading} className={"mt-2"}>
                Update
              </AppSubmitButton>
            </div>
          )}
        </Formik>
      ))}
    </AppModal>
  );
};

export default Currencies;

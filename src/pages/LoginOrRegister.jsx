import React, { useContext, useState } from "react";
import AppInput from "../components/AppInput";
import AppSubmitButton from "../components/AppSubmitButton";
import AppForm from "../components/AppForm";
import * as Yup from "yup";
import {
  AiOutlineUser,
  AiOutlineKey,
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import Logo from "../assets/logo.webp";
import api from "../api/api";
import UserContext from "../contexts/userContext";
import { setUser } from "../api/user";
import { setToken } from "../api/token";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = ({ isLogin, setIsLogin, isLoading, setIsLoading }) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required().label("Email"),
    password: Yup.string().required().label("Password"),
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      await api.get(
        `${process.env.REACT_APP_API_ABSOLUTE}/sanctum/csrf-cookie`
      );
      const res = await api.post("/login", values);
      userContext.setUser(res?.data?.user);
      setUser(res?.data?.user);
      setToken(res?.data?.token);
      if (res?.data?.user?.isAdmin) {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("error with username or password");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <h2 className="text-dark my-4 text-lg lg:text-xl">Login</h2>
      <div className="grid grid-cols-1 px-7 gap-y-5 lg:gap-y-6 w-5/6 lg:w-2/3">
        <AppForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          <AppInput
            id={"email"}
            label={"Email:"}
            placeholder={"enter your email"}
            type="text"
            Icon={AiOutlineMail}
          />
          <AppInput
            id={"password"}
            label={"Password:"}
            placeholder={"enter your password"}
            type="password"
            Icon={AiOutlineKey}
          />
          <AppSubmitButton isLoading={isLoading}>Login</AppSubmitButton>
        </AppForm>
        <span className="text-sm mx-1 text-dark">
          don't have an account?{" "}
          <button
            className="text-primaryDark"
            onClick={() => setIsLogin(false)}
          >
            register instead
          </button>
        </span>
      </div>
    </>
  );
};

export const Register = ({ isLogin, setIsLogin, isLoading, setIsLoading }) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    email: Yup.string().required().label("Email"),
    password: Yup.string().required().label("Password"),
  });

  const handleRegister = async (values) => {
    setIsLoading(true);
    try {
      await api.get(
        `${process.env.REACT_APP_API_ABSOLUTE}/sanctum/csrf-cookie`
      );
      const res = await api.post("/register", values);
      userContext.setUser(res?.data?.user);
      setUser(res?.data?.user);
      setToken(res?.data?.token);
      if (res?.data?.user?.isAdmin) {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("error with username or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-dark my-4 text-lg lg:text-xl">Register</h2>
      <div className="grid grid-cols-1 px-7 gap-y-5 lg:gap-y-6 w-5/6 lg:w-2/3">
        <AppForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleRegister(values)}
        >
          <AppInput
            id={"name"}
            label={"Name:"}
            placeholder={"enter your name"}
            type="text"
            Icon={AiOutlineUser}
          />
          <AppInput
            id={"email"}
            label={"Email:"}
            placeholder={"enter your email"}
            type="text"
            Icon={AiOutlineMail}
          />
          <AppInput
            id={"password"}
            label={"Password:"}
            placeholder={"enter your password"}
            type="password"
            Icon={AiOutlineKey}
          />
          <AppInput
            id={"address"}
            label={"Address:"}
            placeholder={"enter your address"}
            Icon={MdOutlineLocationOn}
          />
          <AppInput
            id={"phone"}
            label={"Phone Number:"}
            placeholder={"enter your phone number"}
            Icon={AiOutlinePhone}
          />
          <AppSubmitButton isLoading={isLoading}>Register</AppSubmitButton>
        </AppForm>
        <span className="text-sm mx-1 text-dark">
          already have an account?{" "}
          <button className="text-primaryDark" onClick={() => setIsLogin(true)}>
            login instead
          </button>
        </span>
      </div>
    </>
  );
};

const LoginOrRegister = ({ isLogin, setIsLogin, isLoading, setIsLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {isLogin ? (
        <Login
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        <Register
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default LoginOrRegister;

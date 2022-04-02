import React, { useContext, useEffect, useState } from "react";
import { FaUserAstronaut, FaLock, FaSearch } from "react-icons/fa";
import { BsFillChatLeftQuoteFill, BsPeopleFill } from "react-icons/bs";
import Logo from "../assets/logo.webp";
import WindowContext from "../contexts/windowContext";
import LoginOrRegister from "./LoginOrRegister";
import AppButton from "../components/AppButton";

const Auth = () => {
  const windowContext = useContext(WindowContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex">
      {windowContext.width > 767 && (
        <div className="relative flex md:flex-col justify-center items-center max-w-0 md:max-w-none md:w-1/2 flex-grow space-y-10 text-dark text-xl bg-primary rounded-tr-[70px] rounded-br-[70px]">
          <img
            src={Logo}
            draggable={false}
            className="h-52"
            alt="In Need Logo"
          />
          <div className="space-y-7">
            <div className="flex items-center space-x-2 text-base xl:text-lg">
              <FaSearch />
              <p>Find the right fit for you</p>
            </div>
            <div className="flex items-center space-x-2 text-base xl:text-lg">
              <BsPeopleFill />
              <p>become a satisfied customer</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:w-1/2 h-screen relative">
        <div className="flex justify-between items-center h-20 px-5 mt-0 md:mt-3 xl:mt-5 2xl:mt-7 w-full bg-primary md:bg-inherit text-dark">
          {windowContext.width < 767 && (
            <div className="flex flex-col">
              <img
                draggable={false}
                src={Logo}
                className="h-20 w-24"
                alt="In Need mini Logo"
              />
            </div>
          )}
          <div className="flex space-x-2 justify-end w-11/12 lg:w-10/12">
            {isLogin ? (
              <AppButton disabled={isLoading} onClick={() => setIsLogin(false)}>
                Register
              </AppButton>
            ) : (
              <AppButton disabled={isLoading} onClick={() => setIsLogin(true)}>
                Login
              </AppButton>
            )}
          </div>
        </div>
        {windowContext.width > 767 ? (
          <div className="absolute flex justify-center items-center rounded-full border-8 border-white bg-primary md:w-24 md:h-24 md:top-1/2 md:-left-12 md:right-auto md:bottom-auto">
            <img
              draggable={false}
              src={Logo}
              className="h-16 w-12 max-h-16 max-w-12"
              alt="Logo"
            />
          </div>
        ) : (
          <></>
        )}
        <div className="w-screen md:w-auto h-full mb-32">
          <LoginOrRegister
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;

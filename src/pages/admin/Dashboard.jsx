import React, { Fragment, useContext, useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineUnorderedList } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtSharp, IoStatsChart } from "react-icons/io5";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import { Menu as HUMenu, Transition } from "@headlessui/react";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "../../api/api";
import { removeToken } from "../../api/token";
import { removeUser } from "../../api/user";
import Logo from "../../assets/logo.webp";
import AppButton from "../../components/AppButton";
import UserContext from "../../contexts/userContext";
import WindowContext from "../../contexts/windowContext";
import { ChevronDownIcon } from "@heroicons/react/outline";
import CurrencyContext from "../../contexts/currencyContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(true);
  const [activeItem, setActiveItem] = useState("");
  const windowContext = useContext(WindowContext);
  const userContext = useContext(UserContext);
  const currencyContext = useContext(CurrencyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const checkActiveItem = (items) => {
    if (activeItem === items) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (location.pathname.match("/admin/products")) {
      setActiveItem("products");
    } else if (location.pathname.match("/admin/categories")) {
      setActiveItem("categories");
    } else if (location.pathname.match("/admin/orders")) {
      setActiveItem("orders");
    } else if (location.pathname.match("/admin/stats")) {
      setActiveItem("stats");
    }
  }, [location]);

  const handleLogout = async () => {
    await api.get("/logout");
    removeToken();
    removeUser();
    userContext.setUser({});
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full font-lato bg-primary/10">
      <div className="h-16 sticky top-0 z-30 bg-primary px-3 lg:px-36 space-x-2 flex items-center justify-between text-base xl:text-lg text-dark">
        <div className="flex items-center space-x-2 h-full">
          <img src={Logo} alt="" className="bg-contain w-20 h-full" />
          <h1>Admin Dashboard</h1>
        </div>
        <div className="flex space-x-3 items-center">
          <HUMenu as="div" className="relative inline-block text-left">
            <div>
              <HUMenu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                {currencyContext?.currency?.name}
                <ChevronDownIcon
                  className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </HUMenu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HUMenu.Items className="origin-top-right absolute right-0 mt-2 z-[3000] w-32 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {currencyContext?.all?.map((option) => (
                    <HUMenu.Item key={option.name}>
                      {({ active }) => (
                        <button
                          onClick={() => currencyContext.setCurrency(option)}
                          className={classNames(
                            option.current
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm w-full"
                          )}
                        >
                          {option.name}
                        </button>
                      )}
                    </HUMenu.Item>
                  ))}
                </div>
              </HUMenu.Items>
            </Transition>
          </HUMenu>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Sign out
          </button>

          <span className="h-6 w-px bg-gray-400" aria-hidden="true" />
          <Link
            to={"/"}
            className="text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Home
          </Link>
        </div>
      </div>
      <div className="flex h-full z-10 overflow-y-auto">
        {windowContext.width >= 640 && (
          <ProSidebar className="z-10" collapsed={sideBarCollapsed}>
            <Menu iconShape="circle">
              <MenuItem
                icon={<AiOutlineMenu />}
                onClick={() => setSideBarCollapsed(!sideBarCollapsed)}
              ></MenuItem>

              <MenuItem
                className={`${
                  checkActiveItem("products") ? "bg-primaryDark" : ""
                }`}
                icon={<IoShirtSharp />}
              >
                <NavLink to={"/admin/products"}>Products</NavLink>
              </MenuItem>
              <MenuItem
                className={`${
                  checkActiveItem("orders") ? "bg-primaryDark" : ""
                }`}
                icon={<AiOutlineUnorderedList />}
              >
                <NavLink to={"/admin/orders"}>Orders</NavLink>
              </MenuItem>
              {/* <MenuItem
                className={`${
                  checkActiveItem("stats") ? "bg-primaryDark" : ""
                }`}
                icon={<IoStatsChart />}
              >
                <NavLink to={"/admin/stats"}>Statistics</NavLink>
              </MenuItem> */}
            </Menu>
          </ProSidebar>
        )}
        <div className="relative flex flex-col justify-between w-full h-full pb-32">
          <Outlet />
          {windowContext.width < 540 && (
            <div className="fixed bottom-0 z-20 flex justify-around items-center w-full h-16 ring-inset ring-2 ring-lightGray/50 shadow-md bg-white">
              <div className="h-full">
                <NavLink
                  className={({ isActive }) =>
                    `flex flex-col justify-center items-center h-full transition ${
                      isActive
                        ? "text-primaryDark border-t-2 border-t-primaryDark"
                        : "text-dark"
                    }`
                  }
                  to={"/admin/products"}
                >
                  <IoShirtSharp className="" />
                  <span className="text-sm">Products</span>
                </NavLink>
              </div>
              <div className="h-full">
                <NavLink
                  className={({ isActive }) =>
                    `flex flex-col justify-center items-center h-full transition ${
                      isActive
                        ? "text-primaryDark border-t-2 border-t-primaryDark"
                        : "text-dark"
                    }`
                  }
                  to={"/admin/orders"}
                >
                  <AiOutlineUnorderedList className="text-lg" />
                  <span className="text-sm">Orders</span>
                </NavLink>
              </div>
              {/* <div className="h-full">
                <NavLink
                  className={({ isActive }) =>
                    `flex flex-col justify-center items-center h-full transition ${
                      isActive
                        ? "text-primaryDark border-t-2 border-t-primaryDark"
                        : "text-dark"
                    }`
                  }
                  to={"/admin/stats"}
                >
                  <IoStatsChart className="" />
                  <span className="text-sm">Statistics</span>
                </NavLink>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

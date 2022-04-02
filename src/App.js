import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "./api/user";
import SetupInterceptors from "./api/SetupInterceptors";
import api from "./api/api";
import WindowContext from "./contexts/windowContext";
import UserContext from "./contexts/userContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./components/admin/ProductForm";
import Orders from "./pages/admin/Orders";
import LoginOrRegister from "./pages/LoginOrRegister";
import Auth from "./pages/Auth";
import Stats from "./pages/admin/Stats";
import Home from "./pages/user/Home";
import Search from "./pages/user/Search";

function NavigateFunctionComponent(props) {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    if (api.interceptors.response.handlers.length === 0) {
      SetupInterceptors(navigate, location);
    }
  }, []);
  return <></>;
}

function App() {
  const [user, setUser] = useState(() => {
    if (!getUser()) {
      return {};
    }

    return getUser();
  });
  const [windowWidth, setWindowWidth] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // if (Object.keys(user).length === 0) {
    //   navigate("/login");
    //   return;
    // }
    // if (user?.role === 0 && location.pathname === "/") {
    //   navigate("/dashboard/statistics");
    // } else if (user?.role === 1 && location.pathname === "/") {
    //   navigate("/dashboard/monitor-patients");
    // } else if (user?.role === 2 && location.pathname === "/") {
    //   navigate("/dashboard/monitor-hospital");
    // }
  }, [user]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  return (
    <div className="font-lato">
      <NavigateFunctionComponent />
      <WindowContext.Provider value={{ width: windowWidth }}>
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
          <ToastContainer className={"z-50"} autoClose={5000} />
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="" element={<Search />} />
            </Route>

            <Route path="/login" element={<Auth />} />

            {user.isAdmin && (
              <Route path="/admin" element={<Dashboard />}>
                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<ProductForm />} />
                <Route path="orders" element={<Orders />} />
                <Route path="stats" element={<Stats />} />
              </Route>
            )}
          </Routes>
        </UserContext.Provider>
      </WindowContext.Provider>
    </div>
  );
}

export default App;

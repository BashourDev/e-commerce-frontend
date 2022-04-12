import { useEffect, useRef, useState } from "react";
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
import { QueryClient, QueryClientProvider } from "react-query";
import Landing from "./pages/user/Landing";
import ProductDetails from "./pages/user/ProductDetails";
import OrderSummary from "./pages/user/OrderSummary";
import CurrencyContext from "./contexts/currencyContext";
import { getCurrency, setCurrency as setStorageCurrency } from "./api/currency";
import MyOrders from "./pages/user/MyOrders";
import ProductEditForm from "./components/admin/ProductEditForm";

const queryClient = new QueryClient();

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
  const [currency, setCurrency] = useState(() => {
    if (!getCurrency()) {
      return {};
    }

    return getCurrency();
  });

  const [allCurrencies, setAllCurrencies] = useState([]);

  const [windowWidth, setWindowWidth] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  let containerRef = useRef(null);

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

  const getCurrencies = async () => {
    const res = await api.get("/currencies");
    setAllCurrencies(res.data);
    if (Object.keys(currency).length === 0 && res.data.length > 0) {
      setCurrency(res?.data[0]);
    }
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    getCurrencies();

    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  useEffect(() => {
    setStorageCurrency(currency);
  }, [currency]);

  return (
    <div className="font-lato" ref={containerRef}>
      <NavigateFunctionComponent />
      <WindowContext.Provider
        value={{ width: windowWidth, container: containerRef }}
      >
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
          <CurrencyContext.Provider
            value={{
              currency: currency,
              setCurrency: setCurrency,
              all: allCurrencies,
            }}
          >
            <QueryClientProvider client={queryClient}>
              <ToastContainer className={"z-50"} autoClose={5000} />
              <Routes>
                <Route path="/" element={<Home />}>
                  <Route path="" element={<Landing />} />
                  <Route path="search" element={<Search />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="orders/:id" element={<OrderSummary />} />
                  <Route path="my-orders" element={<MyOrders />} />
                </Route>

                <Route path="/login" element={<Auth />} />

                {user.isAdmin && (
                  <Route path="/admin" element={<Dashboard />}>
                    <Route path="products" element={<Products />} />
                    <Route path="products/add" element={<ProductForm />} />
                    <Route
                      path="products/edit/:pID"
                      element={<ProductEditForm />}
                    />
                    <Route path="orders" element={<Orders />} />
                    <Route path="stats" element={<Stats />} />
                  </Route>
                )}
              </Routes>
            </QueryClientProvider>
          </CurrencyContext.Provider>
        </UserContext.Provider>
      </WindowContext.Provider>
    </div>
  );
}

export default App;

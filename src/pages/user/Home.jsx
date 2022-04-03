import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  XIcon,
} from "@heroicons/react/outline";
import Cart from "./Cart";
import Logo from "../../assets/logo.webp";
import SearchInput from "../../components/SearchInput";
import { MdSearch } from "react-icons/md";
import AppButton from "../../components/AppButton";
import { Link, Outlet, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import api from "../../api/api";
import { removeToken } from "../../api/token";
import { removeUser } from "../../api/user";
import { useInfiniteQuery } from "react-query";
import WindowContext from "../../contexts/windowContext";

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        // {
        //   name: "New Arrivals",
        //   href: "#",
        //   imageSrc:
        //     "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
        //   imageAlt:
        //     "Models sitting back to back, wearing Basic Tee in black and bone.",
        // },
        // {
        //   name: "Basic Tees",
        //   href: "#",
        //   imageSrc:
        //     "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
        //   imageAlt:
        //     "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        // },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Dresses", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Denim", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Significant Other", href: "#" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        // {
        //   name: "New Arrivals",
        //   href: "#",
        //   imageSrc:
        //     "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
        //   imageAlt:
        //     "Drawstring top with elastic loop closure and textured interior padding.",
        // },
        // {
        //   name: "Artwork Tees",
        //   href: "#",
        //   imageSrc:
        //     "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg",
        //   imageAlt:
        //     "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        // },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
          ],
        },
      ],
    },
  ],
  pages: [
    // { name: "Company", href: "#" },
    // { name: "Stores", href: "#" },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  // const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const windowContext = useContext(WindowContext);

  const onKeyPress = (e) => {
    // if (e.key === "Enter") {
    //   getProducts();
    // }
  };

  // const getProducts = ({ pageParam = 1 }, search) => {
  //   // await api.get(`${process.env.REACT_APP_API_ABSOLUTE}/sanctum/csrf-cookie`);
  //   return api.get(`/products?search=${search}&page=${pageParam}`);
  // };

  // const {
  //   data: products,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   isLoading,
  // } = useInfiniteQuery(
  //   ["search-products", search],
  //   (props) => getProducts(props, search),
  //   {
  //     getNextPageParam: (pages) => {
  //       if (pages.data.current_page === pages.data.last_page) {
  //         return undefined;
  //       } else {
  //         return +pages.data.current_page + 1;
  //       }
  //     },
  //   }
  // );

  // const handleScroll = (e) => {
  //   const bottom =
  //     e.target.scrollingElement.scrollHeight -
  //       e.target.scrollingElement.scrollTop ===
  //     e.target.scrollingElement.clientHeight;
  //   if (bottom) {
  //     fetchNextPage();
  //     console.log("dasdasdsa");
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", (e) => handleScroll(e));

  //   return () => {
  //     window.removeEventListener("scroll", (e) => handleScroll(e));
  //   };
  // }, []);

  const handleLogout = async () => {
    await api.get("/logout");
    removeToken();
    removeUser();
    userContext.setUser({});
    navigate("/login");
  };

  return (
    <div className="bg-white">
      <Cart open={cartOpen} setOpen={setCartOpen} />
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
              <div className="px-4 pt-5 pb-2 flex">
                <button
                  type="button"
                  className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Links */}
              <Tab.Group as="div" className="mt-2">
                <div className="border-b border-gray-200">
                  <Tab.List className="-mb-px flex px-4 space-x-8">
                    {navigation.categories.map((category) => (
                      <Tab
                        key={category.name}
                        className={({ selected }) =>
                          classNames(
                            selected
                              ? "text-primaryDark border-primaryDark"
                              : "text-gray-900 border-transparent",
                            "flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                          )
                        }
                      >
                        {category.name}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
                <Tab.Panels as={Fragment}>
                  {navigation.categories.map((category) => (
                    <Tab.Panel
                      key={category.name}
                      className="pt-10 pb-8 px-4 space-y-10"
                    >
                      <div className="grid grid-cols-2 gap-x-4">
                        {category.featured.map((item) => (
                          <div
                            key={item.name}
                            className="group relative text-sm"
                          >
                            <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                              <img
                                src={item.imageSrc}
                                alt={item.imageAlt}
                                className="object-center object-cover"
                              />
                            </div>
                            <a
                              href={item.href}
                              className="mt-6 block font-medium text-gray-900"
                            >
                              <span
                                className="absolute z-10 inset-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                            <p aria-hidden="true" className="mt-1">
                              Shop now
                            </p>
                          </div>
                        ))}
                      </div>
                      {category.sections.map((section) => (
                        <div key={section.name}>
                          <p
                            id={`${category.id}-${section.id}-heading-mobile`}
                            className="font-medium text-gray-900"
                          >
                            {section.name}
                          </p>
                          <ul
                            role="list"
                            aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                            className="mt-6 flex flex-col space-y-6"
                          >
                            {section.items.map((item) => (
                              <li key={item.name} className="flow-root">
                                <a
                                  href={item.href}
                                  className="-m-2 p-2 block text-gray-500"
                                >
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>

              <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                {navigation.pages.map((page) => (
                  <div key={page.name} className="flow-root">
                    <a
                      href={page.href}
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      {page.name}
                    </a>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                {Object.keys(userContext.user).length === 0 ? (
                  <>
                    <div className="flow-root">
                      <Link
                        to={"/login"}
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        Sign in
                      </Link>
                    </div>
                    <div className="flow-root">
                      <Link
                        to={"/login"}
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        Create account
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flow-root">
                      <button
                        onClick={handleLogout}
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        Sign out
                      </button>
                    </div>
                    {userContext?.user?.isAdmin && (
                      <div className="flow-root">
                        <Link
                          to={"/admin/products"}
                          className="-m-2 p-2 block font-medium text-gray-900"
                        >
                          Dashboard
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 py-6 px-4">
                <a href="#" className="-m-2 p-2 flex items-center">
                  {/* <img
                    src="https://tailwindui.com/img/flags/flag-canada.svg"
                    alt=""
                    className="w-5 h-auto block flex-shrink-0"
                  /> */}
                  <span className="ml-3 block text-base font-medium text-gray-900">
                    USD
                  </span>
                  <span className="sr-only">, change currency</span>
                </a>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-primary">
        {/* <p className="bg-indigo-600 h-10 flex items-center justify-center text-sm font-medium text-white px-4 sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p> */}
        <nav
          aria-label="Top"
          className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="h-16 flex items-center">
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-1 flex lg:ml-0">
                <Link to={"/"}>
                  <span className="sr-only">Workflow</span>
                  {/* <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                    alt=""
                  /> */}
                  <img src={Logo} alt="logo" className="h-10 lg:h-16" />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch z-20">
                <div className="h-full flex space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-primaryDark text-primaryDark"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute top-full inset-x-0 text-sm text-gray-500">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="max-w-7xl mx-auto px-8">
                                  <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                      {category.featured.map((item) => (
                                        <div
                                          key={item.name}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                                            <img
                                              src={item.imageSrc}
                                              alt={item.imageAlt}
                                              className="object-center object-cover"
                                            />
                                          </div>
                                          <a
                                            href={item.href}
                                            className="mt-6 block font-medium text-gray-900"
                                          >
                                            <span
                                              className="absolute z-10 inset-0"
                                              aria-hidden="true"
                                            />
                                            {item.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            Shop now
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className="font-medium text-gray-900"
                                          >
                                            {section.name}
                                          </p>
                                          <ul
                                            role="list"
                                            aria-labelledby={`${section.name}-heading`}
                                            className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                          >
                                            {section.items.map((item) => (
                                              <li
                                                key={item.name}
                                                className="flex"
                                              >
                                                <a
                                                  href={item.href}
                                                  className="hover:text-gray-800"
                                                >
                                                  {item.name}
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                <div className="flex w-56 sm:w-80 md:w-96 px-2 md:px-4 lg:px-5">
                  <SearchInput
                    onKeyPress={onKeyPress}
                    onChange={setSearch}
                    placeholder={"search products..."}
                    Icon={MdSearch}
                    className="border-primaryDark/70 focus-within:border-primaryDark/80"
                    inputClassName={"placeholder:text-gray-500"}
                  />
                  <AppButton
                    onClick={() => null}
                    className="rounded-l-none hover:bg-primaryDark/90 hover:text-white"
                  >
                    search
                  </AppButton>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {Object.keys(userContext.user).length === 0 ? (
                    <>
                      <Link
                        to={"/login"}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-400"
                        aria-hidden="true"
                      />
                      <Link
                        to={"/login"}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign out
                      </button>
                      {userContext.user.isAdmin && (
                        <>
                          <span
                            className="h-6 w-px bg-gray-400"
                            aria-hidden="true"
                          />
                          <Link
                            to={"/admin/products"}
                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            Dashboard
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="hidden lg:ml-8 lg:flex">
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-800 flex items-center"
                  >
                    {/* <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="w-5 h-auto block flex-shrink-0"
                    /> */}
                    <span className="ml-3 block text-sm font-medium">USD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>

                {/* Search */}
                {/* <div className="flex lg:ml-6">
                  <a href="#" className="p-2 text-gray-500 hover:text-gray-600">
                    <span className="sr-only">Search</span>
                    <SearchIcon className="w-6 h-6" aria-hidden="true" />
                  </a>
                </div> */}

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    onClick={() => setCartOpen(true)}
                    className="group -m-2 p-2 flex items-center"
                  >
                    <ShoppingBagIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-gray-600"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Outlet context={[search]} />
    </div>
  );
}

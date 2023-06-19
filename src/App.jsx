import React from "react";
import Counter from "./features/counter/counter";
import ProductList from "./features/ProductList/Components/ProductList";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";

import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";

import CartPage from "./pages/CartPage";
import CheckOutPage from "./pages/CheckOutPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  },
  {
    path: "cart",
    element: <CartPage />,
  },
  {
    path: "checkout",
    element: <CheckOutPage />,
  },
  
  {
    path: "product-detail",
    element: <ProductDetailPage />,
  },

]);
const App = () => {
  return (
    <div>
      {/* <Home /> */}
      {/* <Login /> */}
      <RouterProvider router={router} />
      {/* <SignUp /> */}
    </div>
  );
};

export default App;

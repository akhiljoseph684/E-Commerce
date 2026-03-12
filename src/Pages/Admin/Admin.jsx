import React, { useContext, useEffect, useState } from "react";
import "./Admin.css";
import { AuthContext } from "../../AuthContext";

import logo from "../../assets/logo.png";
import add_products from "../../assets/add-products-icon.png";
import order from "../../assets/order-icon.png";
import view_products from "../../assets/view-products-icon.png";
import users from "../../assets/users-icon.png";

import {
  Navigate,
  useNavigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AddProducts from "../../Components/AddProducts/AddProducts";
import ViewProducts from "../../Components/ViewProducts/ViewProducts";
import Order from "../../Components/Order/Order";
import Users from "../../Components/users/Users";

function Admin() {
  const { setAdmin, logout, user } = useContext(AuthContext);

  const [menu, setMenu] = useState("");
  const [bar, setBar] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentMenu = pathname.split("/")[2] || "add-products";
    setMenu(currentMenu);
  }, [pathname]);

  useEffect(() => {
    setAdmin(true);

    return () => {
      setAdmin(false);
    };
  }, []);

  const adminLogout = async () => {
    await logout();
    navigate("/login");
  };

  const onsidebarChange = (menu_content) => {
    if (menu === menu_content) return;

    setBar(false);
    setMenu(menu_content);

    navigate(`/admin/${menu_content}`);
  };

  return (
    <div className="admin">
      <nav>
        {menu && (
          <div className="bar-icon" onClick={() => setBar((prev) => !prev)}>
            {bar ? (
              <i className="fa-solid fa-x"></i>
            ) : (
              <i className="fa-solid fa-bars"></i>
            )}
          </div>
        )}

        <div className="nav-left">
          <img src={logo} alt="" />
          <h1>
            <i>Smart Buy</i>
          </h1>
        </div>

        <div className="nav-right">
          <img src={user.image ? user.image : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"} alt=""  />
          {/* <button onClick={adminLogout}></button> */}
        </div>
      </nav>

      <div className="main">
        {menu && (
          <div className={`sidebar ${bar ? "show-sidebar" : ""}`}>
            <div
              className={`menu ${menu === "add-products" ? "active-sidebar" : ""}`}
              onClick={() => onsidebarChange("add-products")}
            >
              <img src={add_products} alt="" />
              <p>Add Products</p>
            </div>

            <div
              className={`menu ${menu === "view-products" ? "active-sidebar" : ""}`}
              onClick={() => onsidebarChange("view-products")}
            >
              <img src={view_products} alt="" />
              <p>View Products</p>
            </div>

            <div
              className={`menu ${menu === "orders" ? "active-sidebar" : ""}`}
              onClick={() => onsidebarChange("orders")}
            >
              <img src={order} alt="" />
              <p>All Orders</p>
            </div>

            <div
              className={`menu ${menu === "users" ? "active-sidebar" : ""}`}
              onClick={() => onsidebarChange("users")}
            >
              <img src={users} alt="" />
              <p>All Users</p>
            </div>
          </div>
        )}

        {bar && (
          <div className="blank" onClick={() => setBar((prev) => !prev)}></div>
        )}

        <div className="content">
          <Routes>
            <Route index element={<Navigate to="add-products" replace />} />

            <Route path="add-products" element={<AddProducts />} />

            <Route path="add-products/:id" element={<AddProducts />} />

            <Route path="view-products" element={<ViewProducts />} />

            <Route path="orders" element={<Order />} />

            <Route path="users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;

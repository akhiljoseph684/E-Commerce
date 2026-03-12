import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "./assets/assets";
import { v4 as generateId } from "uuid";
import api from "./axios";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const [cartChange, setCartChange] = useState(0);
  const [buyNow, setBuyNow] = useState(false);
  const [buyNowProId, setBuyNowProId] = useState(null);
  const [isLoginPage, setisLoginPage] = useState(false);
  const [isCartPage, setIsCartPage] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [cartDot, setCartDot] = useState(false);
  const [payment, setPayment] = useState(false);
  const [blockPage, setBlockPage] = useState(false);
  const [adminLogged, setAdminLogged] = useState(false);

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  let color = `rgb(${Math.floor(Math.random() * 150)}, ${Math.floor(
    Math.random() * 150,
  )}, ${Math.floor(Math.random() * 150)})`;

  const findAllUser = async () => {
    let users = await localStorage.getItem("user");
    return users;
  };

  const userLogged = async () => {
    let email = await localStorage.getItem("email");
    if (email) {
      let res = await userExists(email);
      setUsername(res.user.name);
      return true;
    }
    return false;
  };

  const currentUser = async () => {
    try {
      const res = await api.get("/auth");

      if (res.data.success) {
        setUser(res.data.user);
        setLoading(false);
        return res.data.user;
      }

      setLoading(false);
      return null;
    } catch (error) {
      setLoading(false);
      return null;
    }
  };

  const userExists = async (email) => {
    let user = await findAllUser();
    if (user) {
      user = JSON.parse(user);
      let e = user.find((user) => user.email === email);
      if (e) return { success: true, user: e };
    }
    return { success: false };
  };

  const register = async (data) => {
    try {
      const res = await api.post("/auth/register", data);

      if (!res.data.success) {
        toast.error(res.data.message);
        return false;
      }

      setUser(res.data.user);

      toast.success("Registration successful");

      navigate("/");

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return false;
    }
  };


  const login = async (data) => {
    try {
      const res = await api.post("/auth/login", data);

      if (!res.data.success) {
        toast.error(res.data.message);
        return false;
      }

      setUser(res.data.user);

      if (res.data.user.role === "admin") {
        navigate("/admin/add-products");
      } else {
        navigate("/");
      }

      toast.success("Login successful");

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return false;
    }
  };


  const logout = async () => {
    await localStorage.removeItem("email");
    setUsername("");
    return { success: true, message: "You have been logged out successfully." };
  };

  const addToCart = async (productId) => {
    try {
      const res = await api.post("/cart", { productId });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Added to cart");

      setCartChange((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response.data.message || "Cart error");
    }
  };

  

  const removeFromCart = async (productId) => {
    try {
      const res = await api.patch(`/cart/${productId}`);

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setCartChange((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response.data.message || "Cart error");
    }
  };

 

  const getCartData = async () => {
    try {
      const res = await api.get("/cart");

      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load cart",
      };
    }
  };


  const getProductById = async (id) => {
    try {
      const res = await api.get(`/users/products/${id}`);

      if (res.data.success) {
        return res.data.product;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

 
  const cleanCart = async () => {
    try {
      const res = await api.post("/orders/checkout");

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Order placed successfully");

      setCartChange((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

 
  const buyNowToOrder = async (productId, quantity = 1) => {
    try {
      const res = await api.post("/orders/buynow", {
        productId,
        quantity,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };


  const getAllOrders = async () => {
    try {
      const res = await api.get("/order");

      if (res.data.success) {
        return res.data.orders;
      }

      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };


  const saveUser = async (email, newuser) => {
    let users = await findAllUser();
    users = JSON.parse(users);
    users = users.map((user) => {
      if (user.email === email) {
        return newuser;
      }
      return user;
    });
    await localStorage.setItem("user", JSON.stringify(users));
  };

  const saveProduct = async (id, formData) => {
    try {
      const res = await api.put(`/admin/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  };

  const allOrders = async (cartOrders) => {
    let orderDetails = [];
    cartOrders.map((order) => {
      orderDetails.push(order);
    });
    if (buyNow) buyNowToOrder(orderDetails);
    let order = await localStorage.getItem("order");
    if (order) {
      order = JSON.parse(order);
      order.push(...orderDetails);
      await localStorage.setItem("order", JSON.stringify(order));
      return order;
    } else {
      await localStorage.setItem("order", JSON.stringify(orderDetails));
      return orderDetails;
    }
  };

  const cartTotal = (cart) => {
    let total = cart.reduce((acc, curr) => {
      acc += curr.product.offer_price * curr.quantity;
      return acc;
    }, 0);
    return total;
  };

  const createDate = () => {
    return new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getAllProducts = async () => {
    try {
      const res = await api.get("/users/products");

      if (res.data.success) {
        return res.data.products;
      }

      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

 

  const addProducts = async (formData) => {
    try {
      const res = await api.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message)
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
  };

  const deleteProductById = async (id) => {
    try {
      const res = await api.delete(`/admin/products/${id}`);

      if (!res.data.success) {
        toast.error(res.data.message);
        return [];
      }

      return await getAllProducts();
    } catch (error) {
      toast.error(error.response?.data?.message);
      return [];
    }
  };

  const userOrder = async () => {
    try {
      const res = await api.get("/order/myorders");

      if (res.data.success) {
        return res.data.orders;
      }

      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };



  const checkoutCart = async (address, paymentMethod) => {
    try {
      const res = await api.post("/order/checkout", {
        address,
        paymentMethod,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return false;
      }

      toast.success("Order placed successfully");

      setCartChange((prev) => prev + 1);

      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  const buyNowOrder = async (productId, quantity, address, paymentMethod) => {
    try {
      const res = await api.post("/order/buynow", {
        productId,
        quantity,
        address,
        paymentMethod,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return false;
      }

      toast.success("Order placed successfully");

      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  const adminLogin = async ({ email, password }) => {
    await localStorage.setItem("admin", true);
    if (!email || !password) {
      return { success: false, message: "Fill your Empty Field" };
    }

    let res = await fetch(
      `http://localhost:5000/admins?email=${email}&password=${password}`,
    );
    let data = await res.json();
    if (data.length < 1) {
      return {
        success: false,
        message: "Email and Password will does not match",
      };
    }
    setAdminLogged(true);
    await localStorage.setItem("admin", true);
    return { success: true, message: "Admin Login Success" };
  };

  const checkAdminLogged = async () => {
    let res = await localStorage.getItem("admin");
    if (res) {
      setAdminLogged(true);
      return true;
    } else {
      setAdminLogged(false);
      return false;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await api.patch(`/order/${id}`, { status });

      if (!res.data.success) {
        toast.error(res.data.message);
        return false;
      }

      toast.success("Order status updated");

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return false;
    }
  };
  const getAllUsers = async () => {
    try {
      const res = await api.get("/admin/users");

      if (res.data.success) {
        return res.data.data;
      }

      return [];
    } catch (error) {
      toast.error(error.response?.data?.message);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        register,
        login,
        logout,
        userLogged,
        addToCart,
        removeFromCart,
        isLoginPage,
        setisLoginPage,
        cartDot,
        setCartDot,
        getCartData,
        cartTotal,
        isCartPage,
        setIsCartPage,
        search,
        setSearch,
        cartChange,
        getProductById,
        payment,
        setPayment,
        cleanCart,
        buyNow,
        setBuyNow,
        allOrders,
        buyNowProId,
        setBuyNowProId,
        createDate,
        currentUser,
        admin,
        setAdmin,
        addProducts,
        getAllProducts,
        getAllOrders,
        findAllUser,
        userOrder,
        deleteProductById,
        saveUser,
        blockPage,
        setBlockPage,
        saveProduct,
        adminLogin,
        adminLogged,
        setAdminLogged,
        checkoutCart,
        user,
        setUser,
        buyNowOrder,
        loading,
        setLoading,
        updateOrderStatus,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "./assets/assets";
import { v4 as generateId } from "uuid";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
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
  const [adminLogged, setAdminLogged] = useState(false)
  
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  let color = `rgb(${Math.floor(Math.random() * 150)}, ${Math.floor(
    Math.random() * 150
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
    let email = await localStorage.getItem("email");
    if (email) {
      let res = await userExists(email);
      return res.user;
    } else {
      return false;
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

  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      return { success: false, message: "Fill the Empty fields" };
    }
    let res = await userExists(email);
    if (res.success) {
      return { success: false, message: "User is Already exists" };
    }
    if (password.length < 8) {
      return { success: false, message: "Password Must be a 8 Characters" };
    }

    try {
      let u = await findAllUser();
      if (u) {
        u = JSON.parse(u);
        let user = [...u, { name, email, password, cart: {}, order: [], block: false }];
        await localStorage.setItem("user", JSON.stringify(user));
        await localStorage.setItem("email", email);
      } else {
        await localStorage.setItem(
          "user",
          JSON.stringify([{ name, email, password, cart: {}, order: [], block: false }])
        );
        await localStorage.setItem("email", email);
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
    setUsername(name);
    return {
      success: true,
      message: "User Registered Successfully",
    };
  };

  const login = async ({ email, password }) => {
    if (!email || !password) {
      return { success: false, message: "Fill the Empty fields" };
    }
    let res = await userExists(email);
    if (!res.success) {
      return { success: false, message: "User does not Available" };
    }
    const { user } = res;
    if (password !== user.password) {
      return { success: false, message: "Wrong Password" };
    }
    setUsername(user.name);
    await localStorage.setItem("email", email);
    return { success: true, message: "User Logged Successfully" };
  };

  const logout = async () => {
    await localStorage.removeItem("email");
    setUsername("");
    return { success: true, message: "You have been logged out successfully." };
  };

  const addToCart = async (id) => {
    let res = await currentUser();

    if (!res) {
      navigate("/login");
      return { success: false, message: "Please Login" };
    }
    let users = await JSON.parse(localStorage.getItem("user")) || [];
    users = users.map((user) => {
      if (user.email === res.email) {
        res.cart[id] = res.cart[id] ? res.cart[id] + 1 : 1;
        return res;
      }
      return user;
    });
    await localStorage.setItem("user", JSON.stringify(users));
    toast.success("Added to cart Successfully");
    setCartDot(b  => !b);
    setCartChange((prev) => prev + 1);
  };

  const removeFromCart = async (id) => {
    let res = await currentUser();

    if (!res) {
      navigate("/login");
      return { success: false, message: "Please Login" };
    }
    let users = await JSON.parse(localStorage.getItem("user"));
    users = users.map((user) => {
      if (user.email === res.email) {
        res.cart[id] = res.cart[id] ? res.cart[id] - 1 : 0;
        if (!res.cart[id]) delete res.cart[id];
        return res;
      }
      return user;
    });
    await localStorage.setItem("user", JSON.stringify(users));
    setCartDot((b) => true);
    setCartChange((prev) => prev - 1);
  };

  const getCartData = async () => {
    let res = await currentUser();
    if (!res) {
      navigate("/login");
      return;
    }
    if (Object.keys(res.cart).length === 0)
      return { success: false, message: "Cart is Empty" };

    let cart = [];

    for (let proId in res.cart) {
      let product = await getProductById(proId);
      cart.push({ product, quantity: res.cart[proId] });
    }
    return { success: true, data: cart };
  };

  const getProductById = async (id) => {
    // let product = assets.find((product) => product.id == id);
    // return product;
    let products = await localStorage.getItem('products');
    if(products){
      products = JSON.parse(products);
      let product = products.find((product) => product.id === id)
      if(product){
        return product || {}
      }else{
        return ''
      }
    }
  };

  const cleanCart = async (address) => {
  const res = await currentUser();
  if (!res) return;

  const orderDetails = [];

  for (const proId of Object.keys(res.cart)) {
    const product = await getProductById(proId);

    orderDetails.push({
      id: generateId(),
      product,
      date: createDate(),
      quantity: res.cart[proId],
      address,
      status: "Pending",
    });
  }

  let users = JSON.parse(localStorage.getItem("user"));

  users = users.map((user) => {
    if (user.email === res.email) {
      return {
        ...user,
        cart: {},
        order: [...user.order, ...orderDetails],
      };
    }
    return user;
  });

  const cartOrders = orderDetails.map((order) => ({
    ...order,
    user: {
      name: res.name,
      email: res.email,
    },
  }));

  await localStorage.setItem("user", JSON.stringify(users));
  await allOrders(cartOrders);

  setCartChange(0);
  setCartDot(false);
};


  const buyNowToOrder = async (order) => {
    let res = await currentUser();
    let users = await findAllUser();
    users = JSON.parse(users);
    users = users.map((user) => {
      if (user.email === res.email) {
        order.map((o) => {
          res.order.push(o);
        });
        return res;
      }
      return user;
    });
    await localStorage.setItem("user", JSON.stringify(users));
  };

  const getAllOrders = async () => {
    let res = await localStorage.getItem("order");
    return res ? JSON.parse(res) : false;
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

  const saveProduct = async (id, product) => {
    let products = await getAllProducts();
    products = products.map((pro) => {
      if (pro.id === id) {
        return {
          ...product,
          id
        }
      }
      return pro;
    });
    await localStorage.setItem("products", JSON.stringify(products));
  };

  const allOrders = async (cartOrders) => {
    let orderDetails = [];
    cartOrders.map((order) => {
      orderDetails.push(order);
    });
    if(buyNow)buyNowToOrder(orderDetails);
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
    let products = await localStorage.getItem("products");
    return JSON.parse(products);
  };

  const addProducts = async ({
    name,
    description,
    price,
    offer_price,
    color,
    brand,
    category,
    image,
  }) => {
    if (
      !name ||
      !description ||
      !price ||
      !offer_price ||
      !color ||
      !brand ||
      !category
    ) {
      return { success: false, message: "Fill the Empty fields" };
    }

    if (image.length !== 4) {
      return {
        success: false,
        message: `Please Upload ${
          !image.length ? "Images" : `${4 - image.length} More image`
        }`,
      };
    }
    const id = generateId();
    let product = {
      id,
      name,
      description,
      price,
      offer_price,
      color,
      brand,
      category,
      rating: 4.5,
      image,
    };
    const products = await getAllProducts();
    console.log(products);
    if (!products) {
      await localStorage.setItem("products", JSON.stringify([product]));
    } else {
      await localStorage.setItem(
        "products",
        JSON.stringify([...products, product])
      );
    }
    return { success: true, message: "Product Added" };
  };

  const deleteProductById = async (id) => {
    let products = await getAllProducts();
    products = products.filter((x) => x.id !== id);
    if (products.length) {
      await localStorage.setItem("products", JSON.stringify(products));
    } else {
      await localStorage.removeItem("products");
    }
    return products;
  };

  const userOrder = async () => {
    let res = await currentUser();
    return res.order;
  };

  const adminLogin = async ({email, password}) => {
    await localStorage.setItem('admin', true)
    if(!email || !password){
      return {success: false, message: 'Fill your Empty Field'}
    }

      let res = await fetch(`http://localhost:5000/admins?email=${email}&password=${password}`);
      let data = await res.json();
      if(data.length < 1){
        return {success: false, message: 'Email and Password will does not match'}
      }
      setAdminLogged(true)
      await localStorage.setItem('admin', true)
      return {success: true, message: 'Admin Login Success'} 
  }

  const checkAdminLogged = async () => {
    let res = await localStorage.getItem('admin')
    if(res){
      setAdminLogged(true)
      return true;
    }else{
      setAdminLogged(false)
      return false;
    }
  }

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
        setAdminLogged
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

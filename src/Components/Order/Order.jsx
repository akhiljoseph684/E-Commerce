import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import "./Order.css";

function Order() {
  const { getAllOrders, updateOrderStatus } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function check() {
      let res = await getAllOrders();
      if (res) {
        setOrders(res);
      }
    }
    check();
  }, []);

  if (sort === "latest") {
    orders.reverse();
  }

  const sortedProducts = orders
    ? [...orders].sort((a, b) => {
        switch (sort) {
          case "low":
            return a.items[0].price - b.items[0].price;
          case "high":
            return b.items[0].price - a.items[0].price;
          default:
            return a._id.localeCompare(b._id);
        }
      })
    : [];

  const dropDownChange = async (value, id) => {
    const success = await updateOrderStatus(id, value);

    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus: value } : o)),
      );
    }
  };

  return (
    <div className="orders">
      {sortedProducts.length ? (
        <>
          <h1>View All Orders</h1>

          <div className="filter">
            <input
              type="search"
              placeholder="Search Products..."
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="sort">
              <i className={`fa-solid fa-sort ${sort && "active-sort"}`}></i>

              <select onChange={(e) => setSort(e.target.value)}>
                <option value="">Sort</option>
                <option value="latest">Latest</option>
                <option value="low">Price low to high</option>
                <option value="high">Price High to Low</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      {sortedProducts
        .filter((x) =>
          search.toLowerCase() === ""
            ? x
            : x.items[0].name.toLowerCase().includes(search.toLowerCase()) ||
              x.userId?.name?.toLowerCase().includes(search.toLowerCase()),
        )
        .map((order, index) => (
          <div className="order" key={index}>
            <div className="top">
              <div className="left">
                <img
                  src={`http://localhost:4000/uploads/${order.items[0].image[0]}`}
                  alt=""
                />
              </div>

              <div className="right">
                <h3>{order.items[0].name}</h3>

                <h4>Price: {order.items[0].price}</h4>

                <h4>Quaantity: {order.items[0].quantity}</h4>

                <h4>Total: {order.itemsTotal}</h4>

                {order.orderStatus === "Delivered" ? (
                  <h4 style={{ color: "green" }}>Delivered</h4>
                ) : (
                  <select
                    style={{ color: "red" }}
                    value={order.orderStatus}
                    onChange={(e) => dropDownChange(e.target.value, order._id)}
                  >
                    <option value="Pending">Pending</option>
                    <option style={{ color: "green" }} value="Delivered">
                      Delivered
                    </option>
                  </select>
                )}
              </div>
            </div>

            <hr />

            <div className="bottom">
              <p>User: {order.userId.email}</p>

              <p>Address: {order.address}</p>

              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Order;

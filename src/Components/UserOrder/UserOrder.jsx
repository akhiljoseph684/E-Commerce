import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

function UserOrder() {
  const { userOrder } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    async function check() {
      let order = await userOrder();
      setOrders(order);
    }
    check();
  }, []);
  return (
    <div className="cart">
      {
        orders.length > 0 ? <>
          <h1>Ordered items</h1>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price (quantity)</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                
                orders.map((order, index) =>
                  order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="table-img">
                        <img
                          src={`http://localhost:4000/uploads/${item.image[0]}`}
                          alt=""
                        />
                      </td>

                      <td>{item.name}</td>

                      <td>
                        ₹{`${item.price * item.quantity} (${item.quantity})`}
                      </td>

                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                      <td
                        style={{
                          color:
                            order.orderStatus === "pending" ? "red" : "green",
                        }}
                      >
                        {order.orderStatus}
                      </td>
                    </tr>
                  )),
                )
              }
            </tbody>
          </table>
        </>
        : 
        <p className="cart-error">Order is empty</p>

      }
    </div>
  );
}

export default UserOrder;

import React, { useContext, useEffect, useState } from "react";
import "./Users.css";
import { AuthContext } from "../../AuthContext";

function Users() {
  const { getAllUsers } = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function check() {
      const res = await getAllUsers();

      setUsers(res);
    }

    check();
  }, []);
  return (
    <div className="users">
      {users.length ? <h1>View All Users</h1> : ""}

      {users.length &&
        users.map((user) => {
          return (
            <div className="user-div" key={user._id}>
              <img src={user.image && user.image !== ""  ? user.image : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"} alt="profile" />
              <div className="user-details">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Users;

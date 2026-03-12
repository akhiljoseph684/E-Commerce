import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { toast } from "react-toastify";
import api from "../../axios";

function Profile({ color }) {
  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get("/auth");

        if (!res.data.success) {
          toast.error(res.data.message);
          navigate("/");
          return;
        }

        setUser(res.data.user);
      } catch (error) {
        navigate("/login");
        setUser("");
      }
    };

    check();
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    navigate("/login");
    setUser("");
  };

  const letter = user ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div className="home">
      <img
        src={
          user.image && user.image !== ""
            ? user.image
            : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
        }
        alt="profile"
        className="logo"
      />

      <div className="name">
        <p>Hey👋 {user?.name}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;

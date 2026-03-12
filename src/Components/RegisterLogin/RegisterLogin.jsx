import React, { useContext, useState } from "react";
import "./RegisterLogin.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

function RegisterLogin({ status }) {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");

    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (status === "Login") {
        res = await axios.post(
          "http://localhost:4000/api/auth/login",
          userData,
          { withCredentials: true },
        );

        setUser(res.data.user);
      } else {
        res = await axios.post(
          "http://localhost:4000/api/auth/register",
          userData,
          { withCredentials: true },
        );

        setUser(res.data.user.role);
      }
      
      if (res.data.success) {
        res.data.user.role === "admin" && navigate("/admin");
        toast.success(res.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  const handleSuccess = async (response) => {
    try {
      const googleToken = response.credential;

      const res = await axios.post(
        "http://localhost:4000/api/auth/google-login",
        { token: googleToken },
        { withCredentials: true },
      );

      if (res.data.success) {
        setUser(res.data.user);

        toast.success("Google Login Successful");

        navigate("/");
      }
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="register-login">
      <form onSubmit={handleSubmit}>
        <h1>{status}</h1>

        {error && <div className="error">{error}</div>}

        {status === "Sign Up" && (
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            onChange={handleChange}
            value={userData.name}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          onChange={handleChange}
          value={userData.email}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          onChange={handleChange}
          value={userData.password}
        />

        <button>{status}</button>

        {status === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span style={{ color: "red" }} onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        ) : (
          <p>
            Don’t have an account?{" "}
            <span
              style={{ color: "red" }}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>
        )}

        <GoogleLogin theme="outline" onSuccess={handleSuccess} />
      </form>
    </div>
  );
}

export default RegisterLogin;

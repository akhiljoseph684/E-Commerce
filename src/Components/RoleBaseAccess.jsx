import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Navigate } from "react-router-dom";

function RoleBaseAccess({ children }) {

  const { user, setUser, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkUser = async () => {
      const res = await currentUser();
      setUser(res);
      setLoading(false);
    };

    checkUser();

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleBaseAccess;
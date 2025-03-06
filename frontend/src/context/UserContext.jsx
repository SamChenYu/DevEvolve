import React, { createContext, useState, useEffect } from "react";
import { getUserFromToken } from "../services/AuthenicationService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {

      try {
        const response = await getUserFromToken();
        if (response) {
          setUser(response); 
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
};
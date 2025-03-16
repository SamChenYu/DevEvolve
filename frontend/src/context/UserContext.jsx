import React, { createContext, useState, useEffect } from "react";
import { getUserFromToken, refreshToken } from "../services/AuthenicationService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let response = await getUserFromToken();
        if (response) {
          setUser(response);
          return;
        }
      } catch (error) {
        console.warn("Access token expired, trying to refresh...");
        const refreshed = await refreshToken();
        if (refreshed) {
          try {
            console.log("In here...");
            let response = await getUserFromToken();
            if (response) {
              setUser(response);
              return;
            }
          } catch (error) {
            console.error("Error fetching user after refresh:", error);
          }
        }
      }

      console.warn("User not authenticated, redirecting to login...");
      setUser(null);
    };

    fetchUser().finally(() => setLoading(false));
  }, []);

  return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
};

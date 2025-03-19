import React, { createContext, useState, useEffect } from "react";
import {getAdminFromToken} from "../services/AuthenicationService";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {

            try {
                const response = await getAdminFromToken();
                if (response) {
                    setAdmin(response);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, []);

    return <AdminContext.Provider value={{ admin, setAdmin, loading }}>{children}</AdminContext.Provider>;
};
import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


const UserService = () => {

    const axiosPrivate = useAxiosPrivate()

// ======================================== Product management ========================================

    const getProductData = async () => {
        const response = await axiosPrivate.get("/api/branches");
        return response.data;
    };

    const postProductData = async (data) => {
        const response = await axiosPrivate.post("/api/branches", data);
        return response.data;
    };

    const putProductData = async (branchId, data) => {
        const response = await axiosPrivate.put(`/api/branches/${branchId}`, data);
        return response.data;
    };

    const deleteProductData = async (branchId) => {
        const response = await axiosPrivate.delete(`/api/branches/${branchId}`);
        return response.data;
    };


    return { 
        getProductData,
        postProductData,
        putProductData,
        deleteProductData
       
    };
};

export default UserService;
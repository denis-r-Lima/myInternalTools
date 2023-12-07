"use client";
import React, { useEffect } from "react";

import { useAuth } from "@/context/authContext";

import { useLoading } from "@/context/loadingContext";
import Login from "../Login/login";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, loading } = useAuth();
  const { setLoadingData } = useLoading();
  useEffect(() => {
    setLoadingData(loading);
  }, [authUser, loading]);

  return (
    <>
      {!loading && !authUser && <Login />}
      {!loading && authUser && <>{children}</>}
    </>
  );
};

export default Wrapper;

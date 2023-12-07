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

  const path = window.location.pathname;
  if (path === "/setgym") console.log("Eh aqui");
  return (
    <>
      {!loading && !authUser && <Login />}
      {!loading && authUser && <>{children}</>}
    </>
  );
};

export default Wrapper;

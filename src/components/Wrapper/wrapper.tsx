"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/authContext";

import { useLoading } from "@/context/loadingContext";
import Login from "../Login/login";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, loading } = useAuth();
  const { setLoadingData } = useLoading();
  const router = useRouter();
  useEffect(() => {
    setLoadingData(loading);
    // if (!loading && !authUser) router.push("/login");
  }, [authUser, loading]);
  return (
    <>
      {!loading && !authUser && <Login />}
      {!loading && authUser && <>{children}</>}
    </>
  );
};

export default Wrapper;

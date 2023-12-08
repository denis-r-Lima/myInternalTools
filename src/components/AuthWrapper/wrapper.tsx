"use client";
import React, { useEffect } from "react";

import { useAuth } from "@/context/authContext";

import { useLoading } from "@/context/loadingContext";
import Login from "../Login/login";
import Menu from "../Menu/menu";
import Loading from "../Loader/loader";
import { useRouter } from "next/navigation";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, loading } = useAuth();
  const { loadingData } = useLoading();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !authUser) router.push("/signin");
  }, [authUser, loading]);

  return (
    <>
      {!loading && !authUser && <Login />}
      {!loading && authUser && (
        <>
          {children}
          <Menu />
        </>
      )}
      {(loadingData || loading) && <Loading />}
    </>
  );
};

export default Wrapper;

"use client";
import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const onLogin = async () => {
    try {
      await signIn(loginData.email, loginData.password);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setLoginData((prevState) => ({ ...prevState, [name]: value }));
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Card className="max-w-md w-5/6">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input name="email" placeholder="Email" onChange={handleChange} />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
          />
          <Button onClick={onLogin}>Login</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

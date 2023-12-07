"use client";
import { UserCredential } from "@firebase/auth";
import { createContext, useContext } from "react";
import useFirebaseAuth from "@/lib/auth/useAuth";

type AuthUserType = {
  uid: string;
  email: string | null;
};

type AuthUserContextType = {
  authUser: AuthUserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
};

const authUserContext = createContext({} as AuthUserContextType);

const AuthUserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const auth = useFirebaseAuth();
  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
};

export const useAuth = () => useContext(authUserContext);

export default AuthUserProvider;

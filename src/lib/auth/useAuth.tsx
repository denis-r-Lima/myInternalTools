import { User } from "@firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/createInstance";
import { signInWithEmailAndPassword } from "firebase/auth";

const formatAuthUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
});

const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState<ReturnType<
    typeof formatAuthUser
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: User) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    let formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await auth.signOut();
    clear();
  };

  useEffect(() => {
    //@ts-ignore
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signIn,
    signOut,
  };
};

export default useFirebaseAuth;

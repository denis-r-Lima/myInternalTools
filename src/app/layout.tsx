import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu/menu";
import Header from "@/components/Header/header";
import LoadingProvider from "@/context/loadingContext";
import HabitContextProvider from "@/context/habitContext";
import AuthUserProvider from "@/context/authContext";
import Wrapper from "@/components/AuthWrapper/wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habit Puppy",
  description: "Track your habits. Improve your life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthUserProvider>
          <LoadingProvider>
            <HabitContextProvider>
              <Wrapper>{children}</Wrapper>
            </HabitContextProvider>
          </LoadingProvider>
        </AuthUserProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AppWrapper } from "@/context";



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistMono.variable} light `}>


      <body className="">
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}

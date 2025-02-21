import "./globals.css";
import 'bootstrap/dist/css/bootstrap.css'
import { Geist, Geist_Mono } from "next/font/google";
import { AppWrapper } from "@/context";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistMono.variable}`}>
      <body>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}

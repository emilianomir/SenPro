"use client";
import "./globals.css";
import GoogleMap2 from "../components/GoogleMap2";
import Distance from "../components/Distance";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <>This is root (not groot)</>
        <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
      </main>
    </div>
  );
}

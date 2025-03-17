"use client";
import "./globals.css";
import TravelMode from "@/components/TravelMode";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-4xl mx-auto">
        <TravelMode />
      </main>
    </div>
  );
}

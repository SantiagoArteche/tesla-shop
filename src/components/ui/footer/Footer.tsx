import { titleFont } from "@/config/fonts";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-sm mb-10 ">
      <Link href="/">
        <span className={`${titleFont.className} antialiased font-bold`}>
          Teslo
        </span>
        <span>| shop</span>
        <span>© {new Date().getFullYear()}</span>
      </Link>
      <Link href="/" className="mx-3">
        Privacity and legal
      </Link>
      <Link href="/" className="mx-3">
        Ubications
      </Link>
    </div>
  );
};

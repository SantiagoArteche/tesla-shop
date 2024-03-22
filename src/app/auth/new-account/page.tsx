import { titleFont } from "@/config/fonts";
import Link from "next/link";
import { RegisterForm } from "./ui/RegisterForm";

export default function NewAccountPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${titleFont.className} text-4xl mb-5`}>New Account</h1>

      <RegisterForm />
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">Or</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>
      <Link href="/auth/login" className="btn-secondary text-center">
        Login
      </Link>
    </div>
  );
}

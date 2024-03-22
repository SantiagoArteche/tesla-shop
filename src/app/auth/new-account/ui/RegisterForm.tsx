"use client";

import { login, registerUser } from "@/actions/auth";
import { useFormik } from "formik";
import { MdDangerous } from "react-icons/md";
import Swal from "sweetalert2";
import * as Yup from "yup";

interface FormValues {
  fullName: string;
  password: string;
  email: string;
}

export const RegisterForm = () => {
  const { handleChange, handleSubmit, values, errors, resetForm } =
    useFormik<FormValues>({
      initialValues: {
        fullName: "",
        password: "",
        email: "",
      },
      validateOnChange: false,
      onSubmit: async ({ email, fullName, password }) => {
        const resp = await registerUser(fullName, email, password);

        if (resp.ok) {
          resetForm();
          await login(email.toLowerCase(), password);
          window.location.replace("/");
        } else {
          Swal.fire("Error", resp.msg, "error");
          return;
        }
      },
      validationSchema: Yup.object({
        fullName: Yup.string().required("Name is required"),
        password: Yup.string()
          .required("Password is required")
          .min(6, "Password must have at least 6 characters"),
        email: Yup.string().required("Email is required"),
      }),
    });
  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label htmlFor="name">Full Name</label>
      <input
        className={`px-5 py-2 border ${
          errors.fullName && "border-red-600 mb-1"
        } bg-gray-200 rounded mb-5`}
        type="text"
        name="fullName"
        value={values.fullName}
        onChange={handleChange}
        autoFocus
      />
      {errors?.fullName && (
        <div className="rounded  flex items-center gap-2 mb-3">
          <MdDangerous size={30} className="text-red-600" />
          <div className="text-red-600">{errors.fullName}</div>
        </div>
      )}
      <label htmlFor="email">Email</label>
      <input
        className={`px-5 py-2 border ${
          errors.email && "border-red-600 mb-1"
        } bg-gray-200 rounded mb-5`}
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors?.email && (
        <div className="rounded flex items-center gap-2 mb-3">
          <MdDangerous size={30} className="text-red-600" />
          <div className="text-red-600">{errors.email}</div>
        </div>
      )}
      <label htmlFor="password">Password</label>
      <input
        className={`px-5 py-2 border ${
          errors.password && "border-red-600 mb-1"
        } bg-gray-200 rounded mb-5`}
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
      />
      {errors?.password && (
        <div className="rounded flex items-center gap-2 mb-3">
          <MdDangerous size={30} className="text-red-600" />
          <div className="text-red-600">{errors.password}</div>
        </div>
      )}
      <button className="btn-primary" type="submit">
        Create account
      </button>
    </form>
  );
};

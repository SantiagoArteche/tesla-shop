"use client";

import { deleteUserAddress, setUserAddress } from "@/actions";
import { type Address } from "@/interfaces/address.interface";
import type { Country } from "@/interfaces/country.interface";
import { useAddressStore } from "@/store";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as Yup from "yup";

type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
};

interface Props {
  countries: Country[];
  userId: string;
  userStoredAddress?: Partial<Address>;
}

export const AddressForm = ({
  countries,
  userId,
  userStoredAddress,
}: Props) => {
  const { address, setAddress } = useAddressStore((state) => state);
  const router = useRouter();
  const {
    handleChange,
    handleSubmit,
    resetForm,
    values,
    validateForm,
    isValid,
  } = useFormik<FormInputs>({
    initialValues: userStoredAddress
      ? { ...(userStoredAddress as any), rememberAddress: false }
      : {
          firstName: "",
          lastName: "",
          address: "",
          address2: "",
          postalCode: "",
          city: "",
          country: "",
          phone: "",
          rememberAddress: false,
        },
    validateOnMount: true,

    onSubmit: async (data) => {
      const { rememberAddress, ...rest } = data;
      setAddress({ ...rest });
      if (data.rememberAddress) {
        await setUserAddress(data, userId);
      } else {
        await deleteUserAddress(userId);
      }

      router.push("/checkout");
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      address2: Yup.string().optional(),
      address: Yup.string().required("Address is required"),
      postalCode: Yup.string().required("Postal code is required"),
      city: Yup.string().required("City is required"),
      country: Yup.string().required("Country is required"),
      phone: Yup.string().required("Phone is required"),
      rememberAddress: Yup.boolean().optional().default(false),
    }),
  });
  const valuesFilled =
    values.phone.trim() !== "" &&
    values.address.trim() !== "" &&
    values.city.trim() !== "" &&
    values.country.trim() !== "" &&
    values.firstName.trim() !== "" &&
    values.lastName.trim() !== "" &&
    values.postalCode.trim() !== "";

  useEffect(() => {
    if (address.firstName) {
      resetForm({ values: { ...address, rememberAddress: false } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col mb-2">
        <span>First Name</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          onChange={handleChange}
          name="firstName"
          value={values.firstName}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Last Name</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          onChange={handleChange}
          name="lastName"
          value={values.lastName}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Address</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          onChange={handleChange}
          name="address"
          value={values.address}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Address 2 (optional)</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          onChange={handleChange}
          name="address2"
          value={values.address2}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Postal Code</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          onChange={handleChange}
          name="postalCode"
          value={values.postalCode}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>City</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          onChange={handleChange}
          value={values.city}
          name="city"
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Country</span>
        <select
          className="p-2 border rounded-md bg-gray-200"
          name="country"
          onChange={handleChange}
          value={values.country}
        >
          <option value="">[ Choose ]</option>
          {countries?.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <span>Phone</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200 "
          onChange={handleChange}
          value={values.phone}
          name="phone"
        />
      </div>

      <div className="flex flex-col mb-2 ">
        <div className="inline-flex items-center mb-5">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              onChange={handleChange}
              name="rememberAddress"
              defaultChecked={false}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
          <span>Remember address?</span>
        </div>
        <button
          //   className="btn-primary flex w-full sm:w-1/2 justify-center "
          className={`
            ${valuesFilled ? "btn-primary" : "btn-disabled"} 
            `}
          disabled={!valuesFilled}
          type="submit"
        >
          Next
        </button>
      </div>
    </form>
  );
};

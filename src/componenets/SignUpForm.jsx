import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();



  const onSubmit = async (data) => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/user/signup`, data, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        toast.success("User signed up successfully!");
       
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          toast.error("User already exists. Please use a different email.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
        console.log(error);
       
      });
  };

  return (
    <form
      className="w-full max-w-2xl py-8 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input
          className="border border-slate-400"
          {...register("name", { required: true, maxLength: 50 })}
        />
        {errors.name?.type === "required" && (
          <span className="text-xs text-red-400">Name is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="fatherName">Father's Name</label>
        <input
          className="border border-slate-400"
          {...register("fatherName", { required: true, maxLength: 50 })}
        />
        {errors.fatherName?.type === "required" && (
          <span className="text-xs text-red-400">Father's name is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          className="border border-slate-400"
          {...register("age", { required: true, min: 18 })}
        />
        {errors.age?.type === "required" && (
          <span className="text-xs text-red-400">Age is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="gender">Gender</label>
        <select
          className="border border-slate-400"
          {...register("gender", { required: true })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender?.type === "required" && (
          <span className="text-xs text-red-400">Gender is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="wardNumber">Ward Number</label>
        <input
          type="number"
          className="border border-slate-400"
          {...register("wardNumber", { required: true })}
        />
        {errors.wardNumber?.type === "required" && (
          <span className="text-xs text-red-400">Ward number is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="vidhanSabha">Vidhan Sabha</label>
        <input
          className="border border-slate-400"
          {...register("vidhanSabha", { required: true })}
        />
        {errors.vidhanSabha?.type === "required" && (
          <span className="text-xs text-red-400">Vidhan Sabha is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          className="border border-slate-400"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email?.type === "required" && (
          <span className="text-xs text-red-400">Email is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          className="border border-slate-400"
          {...register("phoneNumber", {
            required: true,
            pattern: /^[0-9]{10}$/,
          })}
        />
        {errors.phoneNumber?.type === "required" && (
          <span className="text-xs text-red-400">Phone number is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="referralCode">Referral Code</label>
        <input
          className="border border-slate-400"
          {...register("referralCode", { maxLength: 20 })}
        />
        {errors.referralCode?.type === "maxLength" && (
          <span className="text-xs text-red-400">
            Referral code cannot exceed 20 characters
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="border border-slate-400"
          {...register("password", { required: true })}
        />
        {errors.password?.type === "required" && (
          <span className="text-xs text-red-400">Password is required</span>
        )}
      </div>

      <div className="flex justify-center">
        <input
          className="bg-green-500 px-4 h-10 text-white hover:bg-green-400 cursor-pointer"
          type="submit"
          value="Signup"
        />
      </div>

      <div className="flex gap-2">
        <p>Already have an account?</p>
        <Link to={"/login"}>
          <span className="text-sm text-red-600 hover:underline">Login</span>
        </Link>
      </div>
    </form>
  );
}

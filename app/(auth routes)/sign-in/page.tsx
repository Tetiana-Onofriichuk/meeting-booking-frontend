"use client";

import { ApiError } from "@/app/api/api";
import { Routes } from "@/types/note";
import { login, type LoginRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import css from "./SignIn.module.css";
import toast from "react-hot-toast";
import Button from "@/components/Button/Button";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    try {
      const values: LoginRequest = {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      };

      const response = await login(values);
      if (response) {
        setUser(response);
        toast.success("You have successfully logged in!");
        router.push(Routes.Profile);
      } else {
        setError("Invalid email or password");
      }
    } catch (e) {
      const err = e as ApiError;
      setError(
        err.response?.data?.error ?? err.message ?? "Oops... some error"
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <Form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <Button type="submit" variant="primary">
            Log in
          </Button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </Form>
    </main>
  );
};

export default SignIn;

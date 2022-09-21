import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { FormProps } from "../types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "@firebase/firestore";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();

  const [mode, setMode] = useState("login");

  const [loading, setloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();

  const onSubmitHandler = (FormData: FormProps) => {
    setloading(true);

    if (mode === "login") {
      signInWithEmailAndPassword(auth, FormData.email, FormData.password)
        .then((user) => {
          setloading(false);

          router.push("/");
        })
        .catch((err) => {
          setloading(false);

          alert("User not found, Create an account");
        });
    } else {
      createUserWithEmailAndPassword(auth, FormData.email, FormData.password)
        .then((user) => {
          setDoc(
            doc(db, "users", user.user.uid),
            {
              firstname: FormData.firstname,
              surname: FormData.surname,
              mail: user.user.email,
              photoUrl: user.user.photoURL || null,
              displayName: `${FormData.firstname} ${FormData.surname}`,
            },
            { merge: true }
          );

          setloading(false);

          router.push("/");
        })
        .catch((err) => {
          setloading(false);

          alert("Unable to create an account, Try again!");
        });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Head>
        <title>Facebook - log in or sign up</title>

        <link rel="icon" href="/assets/facebook-icon.webp" />
      </Head>

      <main className="mt-32">
        <div className="relative h-16">
          <Image
            src="/assets/facebook-logo.svg"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {mode === "login" ? (
          <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-4 shadow-md">
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="flex flex-col space-y-3 border-b border-gray-300 pb-4"
            >
              <div className="input-container">
                <input
                  className="input"
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Email address"
                />

                {errors.email && (
                  <p className="err_text">Please enter a valid email.</p>
                )}
              </div>

              <div className="input-container">
                <input
                  className="input"
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                />

                {errors.password && (
                  <p className="err_text">
                    Your password must contain between 4 and 60 characters.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center justify-center rounded bg-[#4267B2] px-4 py-2.5 text-white"
              >
                {loading ? (
                  <div className="border-left h-5 w-5 animate-spin rounded-full border-t border-white" />
                ) : (
                  <p>Log In</p>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center pt-4">
              <button
                onClick={() => setMode("signup")}
                className="w-8/12 rounded bg-[#42b72a] px-4 py-2 text-white"
              >
                Create New Account
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md rounded-lg bg-white p-4 shadow-md">
            <h1 className="text-center text-2xl font-semibold">
              Create a new account
            </h1>

            <p className="mb-3 text-center text-sm text-gray-500">
              It&apos;s quick and easy
            </p>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="flex flex-col space-y-3 border-t border-gray-300 pt-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="input-container">
                  <input
                    className="input"
                    {...register("firstname", { required: true })}
                    type="text"
                    placeholder="First name"
                  />

                  {errors.firstname && (
                    <p className="err_text">Please enter your first name.</p>
                  )}
                </div>

                <div className="input-container">
                  <input
                    className="input"
                    {...register("surname", { required: true })}
                    type="text"
                    placeholder="Surname"
                  />

                  {errors.surname && (
                    <p className="err_text">Please enter your surname.</p>
                  )}
                </div>
              </div>

              <div className="input-container">
                <input
                  className="input"
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Email address"
                />

                {errors.email && (
                  <p className="err_text">Please enter a valid email.</p>
                )}
              </div>

              <div className="input-container">
                <input
                  className="input"
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                />

                {errors.password && (
                  <p className="err_text">
                    Your password must contain between 4 and 60 characters.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center space-y-2">
                <button
                  type="submit"
                  className="flex w-1/2 items-center justify-center rounded bg-[#42b72a] px-4 py-2 text-lg font-bold text-white"
                >
                  {loading ? (
                    <div className="border-left h-5 w-5 animate-spin rounded-full border-t border-white" />
                  ) : (
                    <p> Sign Up</p>
                  )}
                </button>

                <button
                  onClick={() => setMode("login")}
                  className="font-semibold text-blue-500"
                >
                  Already have an account?
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Login;

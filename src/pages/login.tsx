"use client";

import type React from "react";
import { transitions as t } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AnimatedButton from "@/components/animated-button";
import { useApp } from "@/App";
import axios from "axios";
import Spinner from "@/components/ui/spinner";

const api = process.env.REACT_APP_API;

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [working, setWorking] = useState<boolean>(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    axios
      .post(api + "/auth/login", {
        username: formData.usernameOrEmail,
        password: formData.password,
      })
      .then((res) => {
        if (res.data.user) {
          if (res.data.user.avatar)
            res.data.user.avatar =
              "https://" +
              process.env.REACT_APP_ASSET_LOCATION +
              "/" +
              res.data.user.avatar;
          setUser(res.data.user);
          navigate("/profile");
        }
      })
      .catch((err) => {
        console.log("err", err);
        if (err?.response?.status === 404) return alert("User/Email not found");
        if (err?.response?.status === 401)
          return alert("Invalid user/email/password");

        alert("An error occurred. Please try again later.");
      })
      .finally(() => setWorking(false));
  };

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="container mx-auto px-6 py-8 max-w-md"
    >
      <motion.h1
        transition={t.transition}
        exit={{
          opacity: 0,
          y: 40,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
          y: 40,
        }}
        className="text-2xl font-bold text-center mb-8"
      >
        Login
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 55,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 55,
          }}
        >
          <label className="block text-sm font-medium mb-2">
            Username or Email Address
          </label>
          <input
            type="text"
            name="usernameOrEmail"
            required
            value={formData.usernameOrEmail}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </motion.div>

        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 70,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 70,
          }}
        >
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </motion.div>
        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 85,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 85,
          }}
        >
          <AnimatedButton type="submit" className="w-full">
            <AnimatePresence mode="wait">
              {working ? (
                <motion.div
                  transition={t.transition}
                  exit={{
                    opacity: 0,
                  }}
                  animate={t.normalize}
                  initial={{
                    opacity: 0,
                  }}
                  className="flex items-center justify-center"
                  key="working"
                >
                  <Spinner className="me-2" size="sm" />
                  Working
                </motion.div>
              ) : (
                <motion.div
                  transition={t.transition}
                  exit={{
                    opacity: 0,
                  }}
                  animate={t.normalize}
                  initial={{
                    opacity: 0,
                  }}
                  className="flex items-center justify-center"
                  key="login"
                >
                  Login
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedButton>
        </motion.div>

        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 100,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 100,
          }}
          className="text-center"
        >
          <Link to="/forgot-password">
            <AnimatedButton variant="outline" className="w-full">
              Forgot Password
            </AnimatedButton>
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}

"use client";

import type React from "react";
import { transitions as t } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AnimatedButton from "@/components/animated-button";
import { useApp } from "@/App";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
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
    // Simulate login
    setUser({
      username: formData.usernameOrEmail,
      email: formData.usernameOrEmail.includes("@")
        ? formData.usernameOrEmail
        : "user@example.com",
    });
    navigate("/");
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
            Login
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

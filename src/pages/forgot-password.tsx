import type React from "react";
import { transitions as t } from "../lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedButton from "../components/animated-button";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password reset
    alert("Password reset instructions sent to your email!");
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
        Reset Password
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
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
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
          <label className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
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
            Send Reset Instructions
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
          <Link to="/login">
            <AnimatedButton type="button" variant="outline" className="w-full">
              Back to Login
            </AnimatedButton>
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}

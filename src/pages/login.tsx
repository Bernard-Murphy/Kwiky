"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AnimatedButton from "../components/animated-button";
import { useApp } from "../App";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-6 py-8 max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <AnimatedButton type="submit" className="w-full">
          Login
        </AnimatedButton>

        <div className="text-center">
          <Link to="/forgot-password">
            <AnimatedButton variant="secondary">Forgot Password</AnimatedButton>
          </Link>
        </div>
      </form>
    </motion.div>
  );
}

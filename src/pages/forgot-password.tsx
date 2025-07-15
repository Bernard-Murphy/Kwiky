import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import AnimatedButton from "../components/animated-button"

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate password reset
    alert("Password reset instructions sent to your email!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-6 py-8 max-w-md"
    >
      <h1 className="text-2xl font-bold text-center mb-8">Reset Password</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <AnimatedButton type="submit" className="w-full">
          Send Reset Instructions
        </AnimatedButton>
      </form>
    </motion.div>
  )
}

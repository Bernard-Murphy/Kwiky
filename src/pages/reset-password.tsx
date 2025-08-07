import type React from "react";
import { transitions as t } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/animated-button";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/spinner";
import axios from "axios";
import { useApp } from "@/App";

const api = process.env.REACT_APP_API;

export default function ResetPasswordPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
  });
  const [working, setWorking] = useState<boolean>(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user?.username]);
  const resetId = params.resetId;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setWorking(true);

      const res = await axios.post(api + "/auth/set-password", {
        ...formData,
        resetId,
      });

      setUser(res.data.user);
    } catch (err) {
      setWorking(false);
      console.log("handleSubmit error", err);
      alert("An error occurred. Please try again later");
    }
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
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password1"
            required
            value={formData.password1}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </motion.div>

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
            Re-enter Password
          </label>
          <input
            type="password"
            name="password2"
            required
            value={formData.password2}
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
          <AnimatedButton
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={working}
          >
            <AnimatePresence mode="wait">
              {working ? (
                <motion.div
                  transition={t.transition}
                  exit={t.fade_out_scale_1}
                  animate={t.normalize}
                  initial={t.fade_out}
                  key="working"
                  className="flex items-center justify-center"
                >
                  <Spinner size="sm" className="mr-2" />
                  Processing
                </motion.div>
              ) : (
                <motion.div
                  transition={t.transition}
                  exit={t.fade_out_scale_1}
                  animate={t.normalize}
                  initial={t.fade_out}
                  key="not-working"
                >
                  Submit
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
}

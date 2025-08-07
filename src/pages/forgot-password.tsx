import type React from "react";
import { transitions as t } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/animated-button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import axios from "axios";

const api = process.env.REACT_APP_API;

export default function ForgotPasswordPage() {
  const params = useSearchParams();
  const navigate = useNavigate();
  const altEntranceAnimation = String(params[0].get("fromLogin")) === "true";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [altExit, setAltExit] = useState<boolean>(false);
  const [working, setWorking] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);

  useEffect(() => {
    if (altExit) navigate("/login?fromPassword=true");
  }, [altExit]);

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

      await axios.post(api + "/auth/forgot-password", formData);
      setComplete(true);
      setWorking(false);
    } catch (err) {
      setWorking(false);
      console.log("handleSubmit error", err);
      alert("An error occurred. Please try again later");
    }
  };

  return (
    <motion.div
      transition={t.transition}
      exit={
        altExit
          ? {
              opacity: 0,
              x: 150,
            }
          : t.fade_out_scale_1
      }
      animate={t.normalize}
      initial={
        altEntranceAnimation
          ? {
              opacity: 0,
              x: 75,
            }
          : t.fade_out
      }
      className="container mx-auto px-6 py-8 max-w-md"
    >
      <AnimatePresence mode="wait">
        {complete ? (
          <motion.div
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
            key="complete"
          >
            <h2 className="text-center">
              An email has been sent to {formData.email} with instructions to
              reset your password
            </h2>
          </motion.div>
        ) : (
          <motion.div
            transition={t.transition}
            exit={t.fade_out_scale_1}
            animate={t.normalize}
            initial={t.fade_out}
            key="not-complete"
          >
            <motion.h1
              transition={t.transition}
              exit={
                altExit
                  ? {
                      opacity: 0,
                      x: 75,
                    }
                  : {
                      opacity: 0,
                      y: 40,
                    }
              }
              animate={t.normalize}
              initial={
                altEntranceAnimation
                  ? {
                      opacity: 0,
                      x: 75,
                    }
                  : {
                      opacity: 0,
                      y: 40,
                    }
              }
              className="text-2xl font-bold text-center mb-8"
            >
              Reset Password
            </motion.h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                transition={t.transition}
                exit={
                  altExit
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 55,
                      }
                }
                animate={t.normalize}
                initial={
                  altEntranceAnimation
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 55,
                      }
                }
              >
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
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
                exit={
                  altExit
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 70,
                      }
                }
                animate={t.normalize}
                initial={
                  altEntranceAnimation
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 70,
                      }
                }
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
                exit={
                  altExit
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 85,
                      }
                }
                animate={t.normalize}
                initial={
                  altEntranceAnimation
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 85,
                      }
                }
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
                        Send Reset Instructions
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AnimatedButton>
              </motion.div>

              <motion.div
                transition={t.transition}
                exit={
                  altExit
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 100,
                      }
                }
                animate={t.normalize}
                initial={
                  altEntranceAnimation
                    ? {
                        opacity: 0,
                        x: 75,
                      }
                    : {
                        opacity: 0,
                        y: 100,
                      }
                }
                className="text-center"
              >
                <AnimatedButton
                  onClick={() => setAltExit(true)}
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <ChevronLeft className="mr-2" />
                  Back to Login
                </AnimatedButton>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

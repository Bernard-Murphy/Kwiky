import type React from "react";
import { transitions as t } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import AnimatedButton from "@/components/animated-button";
import { useApp } from "@/App";
import axios from "axios";
import Spinner from "@/components/ui/spinner";

const api = process.env.REACT_APP_API;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    bio: "",
    avatar: null as File | null,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [working, setWorking] = useState<boolean>(false);
  const { setUser, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user?.username]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setWorking(true);

    const fd = new FormData();
    fd.append("username", formData.username.trim());
    fd.append("email", formData.email.trim());
    fd.append("bio", formData.bio.trim());
    fd.append("password1", formData.password.trim());
    fd.append("password2", formData.confirmPassword.trim());
    if (formData.avatar)
      fd.append("avatar", formData.avatar, formData.avatar.name);

    axios
      .post(api + "/auth/register", fd)
      .then((res) => {
        if (res.data.avatar)
          res.data.avatar =
            "https://" +
            process.env.REACT_APP_ASSET_LOCATION +
            "/" +
            res.data.avatar;
        setUser(res.data);
      })
      .catch((err) => {
        console.log("error", err);
        if (err?.response?.status === 409)
          return alert("Username or Email already in use");
        alert("An error occurred. Please try again later");
      })
      .finally(() => setWorking(false));
  };

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="container mx-auto px-6 py-8 max-w-md h-full overflow-y-hidden"
    >
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
        className="text-center mb-6"
      >
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Already have an account? Login
        </Link>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 45,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 45,
          }}
          className="text-center"
        >
          <AnimatedButton
            variant="custom"
            className="relative inline-block rounded-full"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="block w-24 h-24 mx-auto bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors overflow-hidden"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </label>
          </AnimatedButton>
          <p className="text-sm text-gray-400 mt-2">
            {formData.avatar ? formData.avatar.name : "Avatar"}
          </p>
        </motion.div>

        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 50,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 50,
          }}
        >
          <label className="block text-sm font-medium mb-2">Username *</label>
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
            y: 55,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 55,
          }}
        >
          <label className="block text-sm font-medium mb-2">Password *</label>
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
            y: 60,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 60,
          }}
        >
          <label className="block text-sm font-medium mb-2">
            Re-enter Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </motion.div>

        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 65,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 65,
          }}
        >
          <label className="block text-sm font-medium mb-2">
            Email Address *
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
            y: 70,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 70,
          }}
        >
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </motion.div>

        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            y: 75,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            y: 75,
          }}
        >
          <AnimatedButton type="submit" className="w-full" disabled={working}>
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
                  key="not-working"
                >
                  Register
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
}

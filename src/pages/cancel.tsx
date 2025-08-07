import { transitions as t } from "@/lib/utils";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/spinner";
import axios from "axios";

const api = process.env.REACT_APP_API;

export default function CancelPage() {
  const params = useParams();
  const navigate = useNavigate();
  const resetId = params.resetId;

  useEffect(() => {
    axios
      .get(api + "/auth/cancel/" + resetId)
      .catch((err) => {
        console.log("error", err);
        alert("An error occurred. Please try again later.");
      })
      .finally(() => navigate("/"));
  }, []);

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
        Cancelling Request
      </motion.h1>

      <div className="flex items-center justify-center w-full mt-4">
        <Spinner />
      </div>
    </motion.div>
  );
}

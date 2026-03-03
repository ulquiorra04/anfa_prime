import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorComponentPros {
  msg?: string 
}

function ErrorComponent(
  props: ErrorComponentPros
) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f4f9fd] p-4 sm:p-6 md:p-8 dark:bg-[#0a1520]"
    >
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0">
        {/* Ambient blobs */}
        <div className="absolute -right-40 -top-40 h-64 w-64 rounded-full bg-[#f08080]/15 blur-3xl sm:h-96 sm:w-96 dark:bg-[#FF0040]/12" />
        <div className="absolute -bottom-40 -left-40 h-64 w-64 rounded-full bg-[#2a7db5]/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fdf0f0]/60 blur-3xl sm:h-48 sm:w-48 dark:bg-[#FF0040]/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-[92vw] flex-col items-center text-center sm:max-w-sm md:max-w-105"
      >
        {/* Icon */}
        <div className="relative mb-6 sm:mb-8">
          <AlertTriangle
            size={100}
            className="text-[#FF0040] sm:size-15 md:size-20 dark:text-[#f08080]"
            strokeWidth={1.5}
          />
        </div>

        {/* Title */}
        {
          !props.msg && <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-4 text-[1.3rem] font-black leading-tight tracking-tight text-[#ff0040ef] sm:mb-5 sm:text-[1.5rem] md:text-[1.6rem] dark:text-[#f08080]"
        >
          {t("titleError")}{" "}
          <span className="relative inline-block">
            <em className="not-italic text-[#FF0040] dark:text-[#f08080]">
              {t("titleAccent")}
            </em>
          </span>
        </motion.h2>
        }

        {
          props.msg && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-4 text-[1.3rem] font-black leading-tight tracking-tight text-[#ff0040ef] sm:mb-5 sm:text-[1.5rem] md:text-[1.6rem] dark:text-[#f08080]"
            >
              { props.msg }
            </motion.h2>
          )
        }

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="mb-5 text-xs text-[#5c85a0] sm:mb-7 dark:text-[#7a9baf]"
        >
          {t("contact_direction_pre")}{" "}
          <button className="font-bold text-[#2a7db5] underline-offset-2 hover:underline dark:text-[#29e3fc]">
            {t("contact_direction_bold")}
          </button>{" "}
          {t("contact_direction_post")}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`flex w-full flex-col gap-2.5 xs:flex-row sm:gap-3 ${isRtl ? "xs:flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => window.location.replace("/")}
            className="group mt-2 flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#ccdfe9] bg-white py-3 text-sm font-bold text-[#05668d] shadow-sm transition-all duration-200 hover:border-[#2a7db5]/50 hover:bg-[#eaf4fb] hover:shadow-md active:scale-[0.97] sm:py-3.5 dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#29e3fc]"
          >
            <Home
              size={14}
              className="transition-transform group-hover:-translate-y-0.5"
            />
            {t("home")}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ErrorComponent;

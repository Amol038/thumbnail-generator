import { motion } from "motion/react";

const PageHeader = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.p
        className="mx-auto w-max rounded-full border border-pink-800 bg-pink-950/70 px-5 py-2 text-sm font-medium text-pink-500"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.35 }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="mt-4 text-base leading-7 text-slate-300"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.16, duration: 0.35 }}
      >
        {description}
      </motion.p>
    </div>
  );
};

export default PageHeader;

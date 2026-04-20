import {
  DribbbleIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { footerData } from "../data/footer";
import { BRAND_NAME, BRAND_TAGLINE } from "../lib/branding";
import type { IFooterLink } from "../types";

export default function Footer() {
  return (
    <footer className="mt-40 flex flex-wrap justify-center gap-10 overflow-hidden px-6 py-6 text-[13px] text-gray-500 md:justify-between md:gap-20 md:px-16 lg:px-24 xl:px-32">
      <motion.div
        className="flex flex-wrap items-start gap-10 md:gap-20 lg:gap-28"
        initial={{ x: -150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            className="size-8 aspect-square"
            src="/favicon.svg"
            alt={`${BRAND_NAME} logo`}
            width={32}
            height={32}
          />
          <div>
            <p className="font-semibold tracking-[0.08em] text-white">
              {BRAND_NAME}
            </p>
            <p className="text-xs text-slate-400">{BRAND_TAGLINE}</p>
          </div>
        </Link>
        {footerData.map((section, index) => (
          <div key={index}>
            <p className="font-semibold text-slate-100">{section.title}</p>
            <ul className="mt-2 space-y-2">
              {section.links.map((link: IFooterLink, linkIndex: number) => (
                <li key={linkIndex}>
                  <Link
                    to={link.href}
                    className="transition hover:text-pink-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-col items-end gap-2 max-md:items-center max-md:text-center"
        initial={{ x: 150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
      >
        <p className="max-w-60">
          {BRAND_NAME} helps creators move from video idea to click-worthy
          thumbnail without slowing down their publishing flow.
        </p>
        <div className="mt-3 flex items-center gap-4">
          <Link to="/blogs" aria-label={`${BRAND_NAME} blogs`}>
            <DribbbleIcon className="size-5 hover:text-pink-500" />
          </Link>
          <Link to="/company" aria-label={`${BRAND_NAME} company`}>
            <LinkedinIcon className="size-5 hover:text-pink-500" />
          </Link>
          <Link to="/community" aria-label={`${BRAND_NAME} community`}>
            <TwitterIcon className="size-5 hover:text-pink-500" />
          </Link>
          <Link to="/generate" aria-label={`${BRAND_NAME} generate`}>
            <YoutubeIcon className="size-6 hover:text-pink-500" />
          </Link>
        </div>
        <p className="mt-3 text-center">
          &copy; {new Date().getFullYear()}{" "}
          <Link to="/">{BRAND_NAME}</Link>
        </p>
      </motion.div>
    </footer>
  );
}

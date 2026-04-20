'use client'
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import ContactForm from "../components/ContactForm";

export default function ContactSection() {
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Contact"
        text2="Grow your channel"
        text3="Have question about AI? Ready to scale your views ? Let's talk."
      />
      <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-white/10 bg-white/6 p-6 md:p-8">
        <ContactForm
          source="homepage-section"
          showSubject={false}
          submitLabel="Submit"
        />
        <div className="mt-6 border-t border-white/10 pt-6 text-sm text-slate-400">
          Need a full support page, partnership help, or policy information?{" "}
          <Link
            to="/contact"
            className="text-pink-400 transition hover:text-pink-300"
          >
            Visit Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

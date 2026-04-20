import { Link } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import PageHeader from "../components/PageHeader";
import SoftBackdrop from "../components/SoftBackdrop";

const ContactPage = () => {
  return (
    <>
      <SoftBackdrop />
      <div className="min-h-screen px-6 pb-20 pt-32 md:px-16 lg:px-24 xl:px-32">
        <PageHeader
          eyebrow="Contact Us"
          title="Tell us what you need help with"
          description="Questions about the product, pricing, partnerships, support, or your creator workflow are all welcome here."
        />

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-xl md:p-8">
            <ContactForm
              source="contact-page"
              showSubject={true}
              submitLabel="Send message"
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-pink-400">
                Support Hours
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Fast replies for creator-impacting issues
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                Include your video topic, what you expected, what happened
                instead, and any screenshots or exact error messages. That
                helps us respond with something useful, not generic.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-pink-400">
                Common Requests
              </p>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>Thumbnail generation issues or slow responses</li>
                <li>Pricing, affiliate, or partnership questions</li>
                <li>Profile/account help and workflow recommendations</li>
                <li>Feedback on missing features you want next</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-pink-950/35 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-pink-300">
                Prefer self-serve?
              </p>
              <p className="mt-3 leading-7 text-slate-200">
                Explore the product support, pricing, privacy, and terms pages
                for the most common questions first.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/support"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Support
                </Link>
                <Link
                  to="/pricing"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Pricing
                </Link>
                <Link
                  to="/privacy"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

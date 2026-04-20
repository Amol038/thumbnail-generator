import { Link } from "react-router-dom";
import { pricingData } from "../data/pricing";
import { sitePages, type SitePageKey } from "../data/sitePages";
import PageHeader from "../components/PageHeader";
import SoftBackdrop from "../components/SoftBackdrop";

const SitePage = ({ pageKey }: { pageKey: SitePageKey }) => {
  const page = sitePages[pageKey];

  return (
    <>
      <SoftBackdrop />
      <div className="min-h-screen px-6 pb-20 pt-32 md:px-16 lg:px-24 xl:px-32">
        <PageHeader
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
        />

        <div className="mx-auto mt-16 max-w-6xl">
          {pageKey === "pricing" ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {pricingData.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl border p-6 shadow-xl ${
                    plan.mostPopular
                      ? "border-pink-500/30 bg-pink-950/35"
                      : "border-white/10 bg-white/6"
                  }`}
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-pink-400">
                    {plan.name}
                  </p>
                  <p className="mt-4 text-4xl font-semibold text-white">
                    ${plan.price}
                    <span className="ml-1 text-sm font-normal text-slate-400">
                      /{plan.period}
                    </span>
                  </p>
                  <ul className="mt-6 space-y-3 text-slate-300">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {page.sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-xl"
                >
                  <h2 className="text-xl font-semibold text-white">
                    {section.title}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-300">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {pageKey === "pricing" && (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {page.sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-3xl border border-white/10 bg-black/25 p-6"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {section.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-white/10 bg-black/25 p-6 md:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-pink-400">
              Next Step
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Ready to keep moving?
            </h3>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Explore the next page in the flow or jump back into the app and
              continue building with the generator.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={page.ctaHref}
                className="rounded-full bg-pink-600 px-5 py-3 text-white transition hover:bg-pink-700"
              >
                {page.ctaLabel}
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/10 px-5 py-3 text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SitePage;

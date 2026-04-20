'use client'
import SectionTitle from "../components/SectionTitle"
import { pricingData } from "../data/pricing";
import type { IPricing } from "../types";
import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const formatPriceInRupees = (price: number) => {
    if (price === 0) {
        return "Free";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

export default function PricingSection() {
    return (
        <div id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle text1="Pricing" text2="Pricing In INR" text3="Start with one free thumbnail, then move to a paid plan only when you are ready." />
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/6 px-5 py-4 text-center text-sm leading-6 text-slate-300">
                This is a pricing preview for now. The free trial can be used immediately, while paid billing can be connected later without changing the pricing page structure.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-20">
                {pricingData.map((plan: IPricing, index: number) => (
                    <motion.div key={index} className={`w-72 text-center border border-pink-950 p-6 pb-16 rounded-xl ${plan.mostPopular ? 'bg-pink-950 relative' : 'bg-pink-950/30'}`}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        {plan.mostPopular && (
                            <p className="absolute px-3 text-sm -top-3.5 left-3.5 py-1 bg-pink-400 rounded-full">Most Popular</p>
                        )}
                        <p className="font-semibold">{plan.name}</p>
                        <h1 className="text-3xl font-semibold">
                            {formatPriceInRupees(plan.price)}
                            <span className="ml-1 text-gray-500 font-normal text-sm">
                                {plan.price === 0 ? plan.period : `/${plan.period}`}
                            </span>
                        </h1>
                        <ul className="list-none text-slate-300 mt-6 space-y-2">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <CheckIcon className="size-4.5 text-pink-600" />
                                    <p>{feature}</p>
                                </li>
                            ))}
                        </ul>
                        <Link
                            to={plan.price === 0 ? "/generate" : "/pricing"}
                            className={`block w-full rounded-md py-2.5 font-medium mt-7 transition-all ${plan.mostPopular ? 'bg-white text-pink-600 hover:bg-slate-200' : 'bg-pink-500 hover:bg-pink-600'}`}
                        >
                            {plan.price === 0 ? "Start Free" : "View Plan"}
                        </Link>
                        <p className="mt-3 text-xs text-slate-400">
                            {plan.price === 0
                                ? "Use your first free thumbnail before paying anything."
                                : "Shown as future subscription pricing in INR."}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

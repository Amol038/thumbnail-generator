import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Free Trial",
        price: 0,
        period: "1 thumbnail included",
        features: [
            "1 thumbnail free",
            "Core thumbnail styles",
            "Standard export quality",
            "No card required",
            "Best for testing the workflow"
        ],
        mostPopular: false
    },
    {
        name: "Creator",
        price: 299,
        period: "month",
        features: [
            "30 AI thumbnails / month",
            "High-resolution exports",
            "All core styles and color themes",
            "Saved generation history",
            "Email support"
        ],
        mostPopular: true
    },
    {
        name: "Studio",
        price: 999,
        period: "month",
        features: [
            "150 AI thumbnails / month",
            "Priority generation queue",
            "Advanced prompt control",
            "Team-ready workflow",
            "Priority support"
        ],
        mostPopular: false
    }
];

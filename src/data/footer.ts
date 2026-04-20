import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Product",
        links: [
            { name: "Support", href: "/support" },
            { name: "Pricing", href: "/pricing" },
            { name: "Affiliate", href: "/affiliate" },
            { name: "Resources", href: "/resources" },
        ]
    },
    {
        title: "Company",
        links: [
            { name: "Company", href: "/company" },
            { name: "Blogs", href: "/blogs" },
            { name: "Community", href: "/community" },
            { name: "Careers", href: "/careers" },
            { name: "About", href: "/about" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Legal", href: "/legal" },
            { name: "Privacy", href: "/privacy" },
            { name: "Terms", href: "/terms" },
        ]
    }
];

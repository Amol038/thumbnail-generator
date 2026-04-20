export type SitePageKey =
  | "support"
  | "pricing"
  | "affiliate"
  | "resources"
  | "company"
  | "blogs"
  | "community"
  | "careers"
  | "about"
  | "legal"
  | "privacy"
  | "terms";

type SitePageSection = {
  title: string;
  description: string;
};

type SitePageContent = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: SitePageSection[];
  ctaLabel: string;
  ctaHref: string;
};

export const sitePages: Record<SitePageKey, SitePageContent> = {
  support: {
    path: "/support",
    eyebrow: "Support",
    title: "Get help without losing momentum",
    description:
      "We help creators, agencies, and product teams resolve issues fast so thumbnail production never stalls your publishing schedule.",
    sections: [
      {
        title: "What we help with",
        description:
          "Account issues, generation failures, workflow setup, prompt quality, and feedback on getting more consistent thumbnail results.",
      },
      {
        title: "Response expectations",
        description:
          "General questions are handled within one business day, while urgent creator-impacting issues are prioritized first.",
      },
      {
        title: "Best way to reach us",
        description:
          "Use the Contact page with your channel context, screenshots, and the exact result you expected so we can respond with useful guidance.",
      },
    ],
    ctaLabel: "Contact Support",
    ctaHref: "/contact",
  },
  pricing: {
    path: "/pricing",
    eyebrow: "Pricing",
    title: "Simple INR pricing for creators",
    description:
      "Your first thumbnail is free. Paid plans are shown in Indian rupees so creators can understand future pricing before subscriptions go live.",
    sections: [
      {
        title: "Start free",
        description:
          "Every new user can create one thumbnail for free and test the workflow before deciding whether to move to a paid plan.",
      },
      {
        title: "INR-first pricing",
        description:
          "Paid plans are displayed in Indian rupees so the pricing page feels natural for your main audience and easier to compare.",
      },
      {
        title: "Preview for now",
        description:
          "This page is a pricing preview right now. Billing and payment collection can be connected later when subscriptions are ready.",
      },
    ],
    ctaLabel: "Try 1 Thumbnail Free",
    ctaHref: "/generate",
  },
  affiliate: {
    path: "/affiliate",
    eyebrow: "Affiliate",
    title: "Partner with us and earn on every referral",
    description:
      "The affiliate program is designed for creators, educators, and communities who already teach audience growth, YouTube strategy, or AI tooling.",
    sections: [
      {
        title: "Who it fits",
        description:
          "YouTube educators, content coaches, template sellers, newsletter operators, and creator communities with a relevant audience.",
      },
      {
        title: "What affiliates get",
        description:
          "Clear tracking, ready-to-share product angles, campaign ideas, and a product story that is easy to explain to creators.",
      },
      {
        title: "How to apply",
        description:
          "Reach out through the Contact page with your audience details, channels, and how you would present the product.",
      },
    ],
    ctaLabel: "Apply via Contact",
    ctaHref: "/contact",
  },
  resources: {
    path: "/resources",
    eyebrow: "Resources",
    title: "Guides, playbooks, and creator workflow help",
    description:
      "This section is for practical material around prompts, click-through thinking, creative testing, and production habits for faster publishing.",
    sections: [
      {
        title: "Prompting playbooks",
        description:
          "Learn how to describe emotion, composition, contrast, and subject focus so image generations are stronger on the first try.",
      },
      {
        title: "Thumbnail strategy notes",
        description:
          "Use resources to think beyond aesthetics and design around curiosity, clarity, and audience expectations.",
      },
      {
        title: "Workflow templates",
        description:
          "Build a repeatable system for briefing, generating, reviewing, and publishing thumbnails without chaos.",
      },
    ],
    ctaLabel: "Explore Contact Team",
    ctaHref: "/contact",
  },
  company: {
    path: "/company",
    eyebrow: "Company",
    title: "A product team focused on creator speed",
    description:
      "We are building tools that remove friction between a video idea and a thumbnail strong enough to earn the click.",
    sections: [
      {
        title: "What we believe",
        description:
          "Creators should spend more time on ideas and publishing decisions, and less time wrestling with design bottlenecks.",
      },
      {
        title: "What we build for",
        description:
          "Independent creators, agencies, and teams that care about growth but do not want bloated production workflows.",
      },
      {
        title: "How we work",
        description:
          "We prefer fast iteration, clear product feedback, and practical features that matter on real publishing timelines.",
      },
    ],
    ctaLabel: "Learn About Us",
    ctaHref: "/about",
  },
  blogs: {
    path: "/blogs",
    eyebrow: "Blogs",
    title: "Product thinking and creator growth notes",
    description:
      "Our blog area is where updates, thumbnail experiments, prompt ideas, and practical publishing insights will live.",
    sections: [
      {
        title: "Product updates",
        description:
          "Expect notes on new generation capabilities, improved workflows, and support changes that help creators move faster.",
      },
      {
        title: "Creative experiments",
        description:
          "We share learnings on styles, layouts, and concepts that consistently improve thumbnail clarity and click appeal.",
      },
      {
        title: "Audience growth ideas",
        description:
          "The best thumbnails are tied to strategy, so our blog space also covers messaging, testing, and content packaging.",
      },
    ],
    ctaLabel: "Talk to the Team",
    ctaHref: "/contact",
  },
  community: {
    path: "/community",
    eyebrow: "Community",
    title: "A place for creators improving together",
    description:
      "Community is where prompt ideas, thumbnail experiments, lessons learned, and creative wins can be shared openly.",
    sections: [
      {
        title: "Peer learning",
        description:
          "Creators learn faster when they can compare iterations, review what worked, and see how other channels package videos.",
      },
      {
        title: "Feedback loops",
        description:
          "Structured feedback on title-thumbnail combinations can often improve performance before a video even goes live.",
      },
      {
        title: "Future direction",
        description:
          "This page marks the start of a fuller community layer around sharing, critique, and collaborative improvement.",
      },
    ],
    ctaLabel: "Reach Out",
    ctaHref: "/contact",
  },
  careers: {
    path: "/careers",
    eyebrow: "Careers",
    title: "Help build tools that support creators",
    description:
      "We care about thoughtful product work, strong engineering fundamentals, and a genuine respect for the people using what we build.",
    sections: [
      {
        title: "What we value",
        description:
          "Ownership, clear communication, taste, speed with care, and empathy for creators trying to publish consistently.",
      },
      {
        title: "Who thrives here",
        description:
          "People who enjoy practical execution, small-team collaboration, and product decisions grounded in user reality.",
      },
      {
        title: "How to connect",
        description:
          "Send your profile, work samples, and a short note about the kind of role or impact area you are interested in.",
      },
    ],
    ctaLabel: "Send an Intro",
    ctaHref: "/contact",
  },
  about: {
    path: "/about",
    eyebrow: "About",
    title: "Why this product exists",
    description:
      "Thumbnail work is often repetitive, rushed, and inconsistent. We built this platform to help creators package better ideas with less friction.",
    sections: [
      {
        title: "The problem",
        description:
          "Many creators know what makes a strong thumbnail, but they do not have the time or design bandwidth to execute fast enough.",
      },
      {
        title: "The mission",
        description:
          "Our mission is to reduce production drag so creators can spend energy on stories, audience understanding, and better publishing decisions.",
      },
      {
        title: "The outcome we want",
        description:
          "Faster iteration, more confident packaging, and a workflow that helps creators publish more often with less stress.",
      },
    ],
    ctaLabel: "Try the Generator",
    ctaHref: "/generate",
  },
  legal: {
    path: "/legal",
    eyebrow: "Legal",
    title: "Policies and terms in one place",
    description:
      "This page gives you a simple entry point to the core legal and policy documents that govern use of the platform.",
    sections: [
      {
        title: "Privacy",
        description:
          "Explains what data is collected, how it is used, and how we think about protecting creator information.",
      },
      {
        title: "Terms",
        description:
          "Covers acceptable use, account responsibilities, and the general rules for accessing the platform.",
      },
      {
        title: "Transparency",
        description:
          "We aim to keep policy language practical and understandable instead of hiding important decisions in vague wording.",
      },
    ],
    ctaLabel: "Read Privacy Policy",
    ctaHref: "/privacy",
  },
  privacy: {
    path: "/privacy",
    eyebrow: "Privacy",
    title: "How we handle your information",
    description:
      "We collect the information needed to operate accounts, support generation workflows, and respond to contact requests.",
    sections: [
      {
        title: "Account data",
        description:
          "We store basic account details like your name, email address, and generated thumbnail records needed for the product experience.",
      },
      {
        title: "Contact submissions",
        description:
          "Messages sent through the contact form are stored so we can respond, track issues, and improve support quality.",
      },
      {
        title: "Operational use",
        description:
          "Your data is used to run the service, improve reliability, and support your requests. It is not collected just to sit unused.",
      },
    ],
    ctaLabel: "Read Terms",
    ctaHref: "/terms",
  },
  terms: {
    path: "/terms",
    eyebrow: "Terms",
    title: "Rules for using the platform responsibly",
    description:
      "Using the service means you agree to follow reasonable account, content, and platform-use expectations.",
    sections: [
      {
        title: "Account responsibility",
        description:
          "You are responsible for keeping your account credentials secure and for activity performed under your session.",
      },
      {
        title: "Generated content",
        description:
          "You are responsible for ensuring prompts and resulting content comply with applicable laws, platform rules, and third-party rights.",
      },
      {
        title: "Service changes",
        description:
          "Features, quotas, models, and pricing may evolve over time as the product and provider ecosystem changes.",
      },
    ],
    ctaLabel: "Contact Us",
    ctaHref: "/contact",
  },
};

/**
 * トップページの文言（英語）。キーは ../ja/home.js とそろえる。
 */
import P from "../company-profile";

export default {
  title: `${P.siteName} | Systems, Cloud & IT Operations`,
  description: `${P.siteName} is an IT solutions company supporting enterprise DX end to end with system development, AWS-centered cloud adoption and 24/7 operations.`,

  hero: {
    eyebrow: "IT × OT × AI SOLUTIONS",
    titleLine1: "Reliable, high-performance",
    titleAccent: "IT Solutions",
    lead: "Building the systems that support the future of business.\nThirty years of experience, creating value for the next generation.",
    primaryButton: "Our business",
    secondaryButton: "Contact us",
  },

  services: {
    eyebrow: "OUR BUSINESS",
    title: "Our Business",
    sub: "Three solutions that support your business",
  },

  achievements: {
    title: "Our Track Record",
    sub: "Delivering results together with customers across many industries",
    carouselLabel: "Case study slider",
    carouselRole: "carousel",
    prev: "Previous case",
    next: "Next case",
    dot: "Case",
    stats: [
      { id: "projects", value: "1,200", unit: "+", label: "Projects delivered" },
      { id: "clients", value: "350", unit: "+", label: "Client companies" },
      { id: "satisfaction", value: "98", unit: "%", label: "Customer satisfaction" },
      { id: "years", value: "30", unit: " yrs", label: "In business" },
    ],
  },

  columns: {
    heading: "Columns",
    more: "View all columns",
  },
};

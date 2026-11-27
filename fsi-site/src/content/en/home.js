/**
 * トップページの文言（英語）。キーは ../ja/home.js とそろえる。
 */
import P from "../company-profile";

export default {
  title: `${P.siteName} | Facility, Patrol & Event Security`,
  description: `${P.siteName} is a security company providing facility, patrol, safety, traffic control, crowd control and parking lot security. Trained guards keep facilities, roads and events safe 24/7.`,

  hero: {
    eyebrow: "SECURITY SERVICES",
    titleLine1: "Keeping people and cities safe,",
    titleAccent: "24 hours a day",
    lead: "From facilities and roads to events and parking lots.\nTrained guards protect the safety and peace of mind of every site.",
    primaryButton: "Our services",
    secondaryButton: "Contact us",
  },

  services: {
    eyebrow: "SECURITY SERVICES",
    title: "Our Services",
    sub: "Six security services that keep every site safe",
  },

  achievements: {
    title: "Our Track Record",
    sub: "Keeping a wide range of sites safe and secure",
    carouselLabel: "Case study slider",
    carouselRole: "carousel",
    prev: "Previous case",
    next: "Next case",
    dot: "Case",
    stats: [
      { id: "sites", value: "480", unit: "+", label: "Contracted sites" },
      { id: "guards", value: "420", unit: "", label: "Security guards" },
      { id: "satisfaction", value: "98", unit: "%", label: "Customer satisfaction" },
      { id: "years", value: "30", unit: " yrs", label: "In business" },
    ],
  },

  columns: {
    heading: "Columns",
    more: "View all columns",
  },
};

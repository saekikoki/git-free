/**
 * 企業情報ページの文言（英語）。キーは ../ja/company.js とそろえる。
 * 社名・所在地などは ../company-profile.js から自動で入る。
 */
import P, { formatAddress, formatFoundingDate, foundingYear } from "../company-profile";

export default {
  title: "Company",
  description: `Corporate information of ${P.legalName.en} (${P.siteName}): philosophy, profile, executives, history and access.`,

  hero: {
    eyebrow: "COMPANY",
    title: "Company",
    lead: "Supporting the future of society through IT × OT × AI.\nThe technology we have built since our founding creates value for the next generation.",
  },

  philosophy: {
    eyebrow: "PHILOSOPHY",
    title: "Our Philosophy",
    items: [
      { icon: "🎯", title: "Mission", subtitle: "Our purpose", text: "Solve social challenges through technology and create a prosperous future for people." },
      { icon: "🔭", title: "Vision", subtitle: "Where we are heading", text: "A technology company leading DX in every industry through the fusion of IT, OT and AI." },
      { icon: "💎", title: "Values", subtitle: "What we believe", text: "Integrity, challenge and co-creation. Continuously creating value together with our customers." },
    ],
  },

  highlights: {
    eyebrow: "BY THE NUMBERS",
    title: `${P.shortName.en} by the Numbers`,
    items: [
      { value: foundingYear(P), suffix: "", label: "Founded", plain: true },
      { value: "350", suffix: "+", label: "Client companies" },
      { value: "1,200", suffix: "+", label: "Projects delivered" },
      { value: "98", suffix: "%", label: "Customer satisfaction" },
    ],
  },

  profile: {
    eyebrow: "CORPORATE PROFILE",
    title: "Corporate Profile",
    rows: [
      { label: "Company name", value: P.legalName.en },
      { label: "Head office", value: formatAddress(P, "en") },
      { label: "Representative", value: `${P.representative.en.name}, ${P.representative.en.title}` },
      { label: "Founded", value: formatFoundingDate(P, "en") },
      { label: "Capital", value: P.capital.en },
      { label: "Employees", value: P.employees.en },
      { label: "Business", value: "System development, cloud adoption and migration, IT operations and maintenance, DX support" },
      { label: "Banks", value: "XX Bank, YY Bank (sample)" },
    ],
  },

  executives: {
    eyebrow: "EXECUTIVES",
    title: "Executives",
    items: [
      { name: P.representative.en.name, role: P.representative.en.title, initial: "Y" },
      { name: "Hanako Sato", role: "Director & CFO", initial: "S" },
      { name: "Ichiro Suzuki", role: "Director & CTO", initial: "S" },
      { name: "Misaki Tanaka", role: "Executive Officer, Head of Business", initial: "T" },
    ],
  },

  history: {
    eyebrow: "HISTORY",
    title: "History",
    items: [
      { year: foundingYear(P), event: `${P.legalName.en} founded; started contract system development` },
      { year: "2003", event: "Expanded core system development for finance and manufacturing" },
      { year: "2010", event: "Launched 24/7 operations and maintenance services" },
      { year: "2016", event: "Launched cloud adoption and migration services" },
      { year: "2024", event: "Evolving into a comprehensive DX company fusing IT, OT and AI" },
    ],
  },

  access: {
    eyebrow: "ACCESS",
    title: "Access",
    officeName: "Head Office",
    address: formatAddress(P, "en"),
    mapQuery: P.mapQuery,
    routes: P.routes.en,
    mapButton: "Show map",
    mapNotice: "The map is loaded from Google Maps.",
    openInMaps: "Open in Google Maps",
    mapTitle: "Map of the head office",
  },
};

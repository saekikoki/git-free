/**
 * 企業情報ページの文言（英語）。キーは ../ja/company.js とそろえる。
 * 社名・所在地などは ../company-profile.js から自動で入る。
 */
import P, { formatAddress, formatFoundingDate, foundingYear } from "../company-profile";

export default {
  title: "Company",
  description: `Corporate information of ${P.legalName.en} (${P.siteName}): philosophy, profile, security license, executives, history and access.`,

  hero: {
    eyebrow: "COMPANY",
    title: "Company",
    lead: "Protecting people and cities 24 hours a day, 365 days a year.\nExperience and training built since our founding support the safety of every site.",
  },

  philosophy: {
    eyebrow: "PHILOSOPHY",
    title: "Our Philosophy",
    items: [
      { icon: "🎯", title: "Mission", subtitle: "Our purpose", text: "Through security, protect people's safety and peace of mind and support community life." },
      { icon: "🔭", title: "Vision", subtitle: "Where we are heading", text: "A well-trained security company trusted most by customers and communities." },
      { icon: "💎", title: "Values", subtitle: "What we believe", text: "Integrity, responsibility and compassion. Courtesy and discipline at every site." },
    ],
  },

  highlights: {
    eyebrow: "BY THE NUMBERS",
    title: `${P.shortName.en} by the Numbers`,
    items: [
      { value: foundingYear(P), suffix: "", label: "Founded", plain: true },
      { value: "480", suffix: "+", label: "Contracted sites" },
      { value: "420", suffix: "", label: "Security guards" },
      { value: "24", suffix: "/7", label: "Emergency response" },
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
      { label: "Security license", value: P.securityLicense.en },
      { label: "Business", value: "Security services (facility, patrol, safety, traffic control, crowd control and parking lot security)" },
      { label: "Affiliations", value: "Member of the Security Industry Association (sample)" },
      { label: "Banks", value: "XX Bank, YY Bank (sample)" },
    ],
  },

  executives: {
    eyebrow: "EXECUTIVES",
    title: "Executives",
    items: [
      { name: P.representative.en.name, role: P.representative.en.title, initial: "Y" },
      { name: "Hanako Sato", role: "Director, Head of Administration", initial: "S" },
      { name: "Ichiro Suzuki", role: "Director, Head of Security Operations", initial: "S" },
      { name: "Misaki Tanaka", role: "Executive Officer, Head of Training", initial: "T" },
    ],
  },

  history: {
    eyebrow: "HISTORY",
    title: "History",
    items: [
      { year: foundingYear(P), event: `${P.legalName.en} founded; started facility security` },
      { year: "2003", event: "Started traffic control and crowd control security" },
      { year: "2010", event: "Started parking lot security" },
      { year: "2016", event: "Opened a 24-hour emergency response center" },
      { year: "2024", event: "Expanded the guard training facility" },
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

/**
 * 企業情報ページの文言（英語）。キーは ../ja/company.js とそろえる。
 */
export default {
  title: "Company",
  description: "Corporate information of FUJI SOFT INCORPORATED: philosophy, profile, executives, history and access.",

  hero: {
    eyebrow: "COMPANY",
    title: "Company",
    lead: "Supporting the future of society through IT × OT × AI.\nOver half a century of technology, creating value for the next generation.",
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
    title: "FUJI SOFT by the Numbers",
    items: [
      { value: "1970", suffix: "", label: "Founded", plain: true },
      { value: "350", suffix: "+", label: "Client companies" },
      { value: "1,200", suffix: "+", label: "Projects delivered" },
      { value: "98", suffix: "%", label: "Customer satisfaction" },
    ],
  },

  profile: {
    eyebrow: "CORPORATE PROFILE",
    title: "Corporate Profile",
    rows: [
      { label: "Company name", value: "FUJI SOFT INCORPORATED" },
      { label: "Head office", value: "1-1 Sakuragicho, Naka-ku, Yokohama, Kanagawa 231-8008, Japan" },
      { label: "Representative", value: "Mitsuhiro Murooka, President, Executive Officer & CEO" },
      { label: "Founded", value: "May 15, 1970" },
      { label: "Capital", value: "100 million yen" },
      { label: "Employees", value: "18,000 (consolidated, as of 2025)" },
      { label: "Business", value: "System integration, DX, cloud, AI and IoT solutions" },
      { label: "Banks", value: "MUFG Bank, Mizuho Bank, Sumitomo Mitsui Banking Corporation, The Bank of Yokohama" },
    ],
  },

  executives: {
    eyebrow: "EXECUTIVES",
    title: "Executives",
    items: [
      { name: "Mitsuhiro Murooka", role: "President, Executive Officer & CEO", initial: "M" },
      { name: "Taro Yamada", role: "Director, Executive Vice President", initial: "Y" },
      { name: "Hanako Sato", role: "Director, Senior Managing Executive Officer & CFO", initial: "S" },
      { name: "Ichiro Suzuki", role: "Director, Managing Executive Officer & CTO", initial: "S" },
    ],
  },

  history: {
    eyebrow: "HISTORY",
    title: "History",
    items: [
      { year: "1970", event: "Founded as Fuji Software Laboratory" },
      { year: "1985", event: "Launched the embedded software business in earnest" },
      { year: "2000", event: "Listed on the First Section of the Tokyo Stock Exchange; expanded system development" },
      { year: "2015", event: "Entered the cloud and AI businesses" },
      { year: "2023", event: "Evolved into a comprehensive DX company fusing IT, OT and AI" },
    ],
  },

  access: {
    eyebrow: "ACCESS",
    title: "Access",
    officeName: "Head Office",
    address: "1-1 Sakuragicho, Naka-ku, Yokohama, Kanagawa 231-8008, Japan",
    mapQuery: "神奈川県横浜市中区桜木町1-1",
    routes: [
      "3 min walk from Sakuragicho Station (JR / Yokohama Municipal Subway)",
      "8 min walk from Minatomirai Station (Minatomirai Line)",
    ],
    mapButton: "Show map",
    mapNotice: "The map is loaded from Google Maps.",
    openInMaps: "Open in Google Maps",
    mapTitle: "Map of the head office",
  },
};

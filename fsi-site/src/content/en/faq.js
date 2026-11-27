/**
 * よくある質問（FAQ）ページの文言（英語）。キーは ../ja/faq.js とそろえる。
 */
import P, { formatAddress } from "../company-profile";

export default {
  title: "FAQ",
  description: `Frequently asked questions about ${P.siteName}: requesting security, pricing, coverage area, careers and this website.`,
  eyebrow: "FAQ",
  lead: "Please check these answers before contacting us.",
  all: "All",
  searchPlaceholder: "Search questions",
  searchLabel: "Search frequently asked questions",
  noMatch: "No matching questions found.",
  contactLead: "If your question is not answered here, feel free to contact us.",
  contactButton: "Contact us",
  categories: ["Requesting security", "Security services", "Careers", "This website"],
  items: [
    {
      category: "Requesting security",
      q: "How do I request security services?",
      a: "Please contact us by email or phone with the type of security, location and dates you need.\nWe will visit the site and propose a security plan and estimate. Site visits and estimates are free.",
    },
    {
      category: "Requesting security",
      q: "Can I request security for just one day or a short period?",
      a: "Yes. We accept requests from a single day, such as events or construction. Staffing is limited, so please consult us early.",
    },
    {
      category: "Requesting security",
      q: "How is the price determined?",
      a: "It depends on the type of security, number of guards, hours (day or night) and period. After a site visit, we provide an itemized estimate.",
    },
    {
      category: "Security services",
      q: "Do you offer 24-hour service?",
      a: "Yes. On-site security is provided in shifts 24/7. Emergency calls are received by our 24-hour control center.",
    },
    {
      category: "Security services",
      q: "What training do your guards receive?",
      a: "Guards complete the initial training required by the Security Business Act before being assigned, and receive regular ongoing training afterwards. For traffic and crowd control, we assign guards who have passed the qualification exams.",
    },
    {
      category: "Security services",
      q: "Which areas do you cover?",
      a: "We mainly serve the Tokyo metropolitan area. Requests outside it may be possible depending on the content. Please contact us.",
    },
    {
      category: "Security services",
      q: "Where is your head office?",
      a: `Our head office is at ${formatAddress(P, "en")}.\nSee "Access" on the Company page for details.`,
    },
    {
      category: "Careers",
      q: "Can I apply without experience?",
      a: "Yes. Guards complete the legally required initial training after joining before being assigned to a site. Many of our staff started with no experience.",
    },
    {
      category: "Careers",
      q: "Do you support obtaining qualifications?",
      a: "Yes. We support qualifications such as traffic control, crowd control and facility security with training and fee support.",
    },
    {
      category: "This website",
      q: "Is there a Japanese version of this page?",
      a: "Yes. Use the \"JP\" button at the top right of the screen to switch to Japanese.",
    },
  ],
};

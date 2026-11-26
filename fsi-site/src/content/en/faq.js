/**
 * よくある質問（FAQ）ページの文言（英語）。キーは ../ja/faq.js とそろえる。
 */
import P, { formatAddress } from "../company-profile";

export default {
  title: "FAQ",
  description: `Frequently asked questions about ${P.siteName}: our company, services, careers and this website.`,
  eyebrow: "FAQ",
  lead: "Please check these answers before contacting us.",
  all: "All",
  searchPlaceholder: "Search questions",
  searchLabel: "Search frequently asked questions",
  noMatch: "No matching questions found.",
  contactLead: "If your question is not answered here, feel free to contact us.",
  contactButton: "Contact us",
  categories: ["Company", "Services", "Careers", "This website"],
  items: [
    {
      category: "Company",
      q: "Where is your head office?",
      a: `Our head office is at ${formatAddress(P, "en")}.\nSee "Access" on the Company page for details.`,
    },
    {
      category: "Company",
      q: "Where can I find IR information and financial results?",
      a: "Announcements about our latest financial results are published in the \"IR\" category of our news.",
    },
    {
      category: "Services",
      q: "Can I consult you about a small development project?",
      a: "Yes. We welcome projects of any size, even before the requirements are fixed.",
    },
    {
      category: "Services",
      q: "How much does a cloud migration cost?",
      a: "It depends greatly on your current environment and the scope of migration. We will give you an estimate after a hearing.",
    },
    {
      category: "Services",
      q: "Can you also handle operations and maintenance after delivery?",
      a: "Yes. We provide total support, from 24/7 monitoring to incident response and improvement proposals.",
    },
    {
      category: "Careers",
      q: "Can I apply as an engineer without a technical degree?",
      a: "Yes. Our training covers the basics of system development, and many engineers with non-technical backgrounds work with us.",
    },
    {
      category: "Careers",
      q: "Is remote work available?",
      a: "Depending on the role and project, you can combine remote work and office work.",
    },
    {
      category: "Careers",
      q: "How long does the selection process take?",
      a: "It usually takes one to two months from application to offer. See \"Selection Process\" on the Careers page.",
    },
    {
      category: "This website",
      q: "Is there a Japanese version of this page?",
      a: "Yes. Use the \"JP\" button at the top right of the screen to switch to Japanese.",
    },
    {
      category: "This website",
      q: "Can I view the site in dark mode?",
      a: "Yes. Use the moon icon at the top right. On your first visit, the site follows your device settings.",
    },
  ],
};

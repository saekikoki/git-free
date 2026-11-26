/**
 * サイト内検索ページの文言（英語）。キーは ../ja/search.js とそろえる。
 */
import P from "../company-profile";

export default {
  title: "Site Search",
  description: `Search pages, news and columns on the ${P.siteName} website.`,
  eyebrow: "SEARCH",
  placeholder: "Enter keywords (e.g. cloud, careers)",
  label: "Search this site",
  button: "Search",
  hint: "Searches page text, news and columns. Separate words with spaces to find results containing all of them.",
  resultSuffix: "results found",
  noMatch: "No results found. Please try other keywords.",
  loading: "Preparing search...",
  typePage: "Page",
  typeNews: "News",
  typeColumns: "Column",
  typeService: "Service",
  typeCase: "Case study",
  typeJob: "Position",
  pages: {
    home: "Home",
    company: "Company",
    recruit: "Careers",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
  },
};

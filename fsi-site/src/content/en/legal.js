/**
 * 規約系ページの文言（英語）。キーは ../ja/legal.js とそろえる。
 */
import P from "../company-profile";

export default {
  privacy: {
    title: "Privacy Policy",
    description: `The privacy policy of ${P.siteName}.`,
    sections: [
      {
        heading: "Basic Policy",
        paragraphs: [
          "We recognize the protection of our customers' personal information as an important social responsibility, and we strive to protect it properly in accordance with the following policy.",
          "This English translation is provided for reference. If there is any discrepancy, the Japanese version prevails.",
        ],
      },
      {
        heading: "1. Collection of Personal Information",
        paragraphs: ["We collect personal information by lawful and fair means, only to the extent necessary for our business. When collecting it, we state the purpose of use and obtain the consent of the person concerned."],
      },
      {
        heading: "2. Use of Personal Information",
        paragraphs: ["We use personal information only within the scope of the purposes stated in advance, and never for any other purpose."],
        list: ["Responding to inquiries", "Contracting, providing and improving our security services", "Use, within the scope of the contract, of information obtained in security work (entry records, camera footage, etc.)", "Screening and contacting applicants in recruitment", "Responding as required by law"],
      },
      {
        heading: "3. Provision to Third Parties",
        paragraphs: ["We do not provide personal information to third parties without consent, except in the following cases."],
        list: ["When required by law", "When necessary to protect a person's life, body or property", "When especially necessary for public health or the sound upbringing of children"],
      },
      {
        heading: "4. Security Measures",
        paragraphs: ["We take appropriate technical and organizational measures to prevent leakage, loss or damage of personal information, and continuously educate our employees on its protection."],
      },
      {
        heading: "5. Contact",
        paragraphs: ["For inquiries about the handling of personal information, or requests for disclosure, correction or deletion, please contact us below."],
        contact: `${P.legalName.en} Personal Information Manager\nEmail: ${P.privacyEmail}\nPhone: ${P.phoneIntl}`,
      },
    ],
  },

  terms: {
    title: "Terms of Use",
    description: "The terms of use of this website.",
    sections: [
      {
        heading: "Conditions of Use",
        paragraphs: [
          "Please read and agree to the following conditions before using this website (the \"Site\").",
          "This English translation is provided for reference. If there is any discrepancy, the Japanese version prevails.",
        ],
      },
      {
        heading: "1. Copyright",
        paragraphs: ["Copyright of the content on the Site (text, images, video, programs, etc.) belongs to us or to third parties with legitimate rights. Unauthorized reproduction, republication or modification is prohibited."],
      },
      {
        heading: "2. Disclaimer",
        paragraphs: ["We strive for accuracy, but do not guarantee the completeness or accuracy of the information on the Site. We are not responsible for any damage arising from the use of the Site."],
      },
      {
        heading: "3. Links",
        paragraphs: ["You are generally free to link to the Site, but we decline links from the following sites."],
        list: ["Sites that violate or may violate laws", "Sites contrary to public order and morals", "Sites that may damage our reputation"],
      },
      {
        heading: "4. Recommended Browsers",
        paragraphs: ["We recommend the following browsers for viewing the Site."],
        list: ["Google Chrome (latest)", "Microsoft Edge (latest)", "Mozilla Firefox (latest)", "Apple Safari (latest)"],
      },
      {
        heading: "5. Cookies",
        paragraphs: ["The Site may use cookies to improve convenience and analyze access. You can refuse cookies in your browser settings, but some features may not work properly."],
      },
      {
        heading: "6. Governing Law and Jurisdiction",
        paragraphs: ["Any dispute regarding the use of the Site is governed by the laws of Japan, and the Tokyo District Court has exclusive jurisdiction as the court of first instance."],
      },
    ],
  },

  sitemap: {
    title: "Sitemap",
    description: `A list of all pages on the ${P.siteName} website.`,
  },
};

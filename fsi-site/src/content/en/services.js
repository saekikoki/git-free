/**
 * 事業内容（サービス）ページの文言（英語）。キーと slug は ../ja/services.js とそろえる。
 */
export default {
  eyebrow: "OUR BUSINESS",
  title: "Our Business",
  description: "System development, cloud adoption and operations: we support your DX end to end, from planning to operation.",
  lead: "Three solutions that support your business",
  more: "Learn more",
  allServices: "View all services",

  labels: {
    challenges: "Common challenges we solve",
    features: "What we provide",
    process: "How we work",
    relatedCases: "Related case studies",
    faq: "FAQ",
    otherServices: "Other services",
    ctaTitle: "Feel free to contact us",
    ctaText: "We will help you organize your challenges and prepare a proposal and estimate free of charge.",
    ctaButton: "Contact us",
  },

  items: [
    {
      slug: "system-development",
      icon: "💻",
      title: "System Development",
      summary: "High-quality business and core systems, delivered end to end from requirements definition to operation.",
      tags: ["Business systems", "Core systems", "In-house enablement"],
      lead: "Engineers who understand your business handle everything from requirements definition to design, development, testing and operation, building systems that adapt to change and last.",
      description: [
        "We have extensive experience, from business systems such as ordering, inventory, accounting and HR to mission-critical core systems that must run 24/7.",
        "You can consult us even before your requirements are fixed. We interview the people on site to organize your business flow and identify the features you really need before development starts, which means less rework and systems that actually get used.",
        "After development, we also support operation and in-house enablement, helping you build a team that can develop and modify systems on its own.",
      ],
      challenges: [
        "Maintaining an aging system has reached its limit",
        "Work depends on Excel, paper and specific individuals",
        "Requirements are unclear and you don't know where to start",
        "Everything is left to the vendor and no know-how stays in-house",
      ],
      features: [
        { title: "Requirements & business analysis", text: "We visualize your business through interviews and decide the scope and priorities together." },
        { title: "Design & development", text: "We build web apps, business applications and core systems with maintainable designs." },
        { title: "Testing & quality assurance", text: "We manage quality with numbers, using automated tests and third-party reviews." },
        { title: "In-house enablement", text: "We work alongside your development team and transfer our skills and know-how." },
      ],
      process: [
        { title: "Consultation", text: "We learn about your challenges and goals" },
        { title: "Requirements", text: "We decide features, scope and schedule" },
        { title: "Design & build", text: "We review working software in short cycles" },
        { title: "Test & release", text: "We verify quality and go live" },
        { title: "Operate & improve", text: "We keep improving based on real usage" },
      ],
      relatedCases: ["financial-core-renewal", "retail-ec-platform"],
      faq: [
        { q: "Can you take on small projects?", a: "Yes. We accept projects lasting a few months with a few members." },
        { q: "Can you modify an existing system only?", a: "Yes. We also investigate and modify systems developed by other companies." },
      ],
    },
    {
      slug: "cloud",
      icon: "☁️",
      title: "Cloud Adoption & Migration",
      summary: "Cloud migration centered on AWS, balancing cost optimization and scalability.",
      tags: ["AWS", "Cloud migration", "IaC"],
      lead: "We support your migration from on-premises to the cloud, from planning and migration to post-migration operations, building a secure and scalable environment at a lower cost.",
      description: [
        "Centered on AWS, we provide end-to-end support: assessing your current systems, planning, migrating, and optimizing operations and costs afterwards.",
        "We manage infrastructure as code (IaC) so that the same environment can be reproduced at any time. This prevents manual configuration errors and removes differences between test and production.",
        "Migration is not the end. We continuously review the number of servers and the configuration according to usage, steadily lowering your monthly cloud costs.",
      ],
      challenges: [
        "Your servers are approaching end of support",
        "You want to move to the cloud but don't know where to start",
        "You migrated, but costs are higher than expected",
        "You're not sure your security settings are correct",
      ],
      features: [
        { title: "Migration assessment", text: "We analyze your systems and estimate the approach, cost and schedule." },
        { title: "Cloud design & build", text: "We build highly available, secure architectures with IaC." },
        { title: "Migration", text: "We move your data and systems with procedures that minimize business impact." },
        { title: "Cost optimization", text: "We analyze usage and cut costs by reviewing configurations and contracts." },
      ],
      process: [
        { title: "Assessment", text: "We analyze your systems and usage" },
        { title: "Planning", text: "We decide the approach, order and cost" },
        { title: "Build", text: "We create the target cloud environment" },
        { title: "Migrate & cut over", text: "We rehearse, then migrate production" },
        { title: "Operate & optimize", text: "We keep reviewing cost and performance" },
      ],
      relatedCases: ["financial-core-renewal", "retail-ec-platform"],
      faq: [
        { q: "Do you support clouds other than AWS?", a: "Yes, we also have experience with Microsoft Azure and Google Cloud." },
        { q: "Will our business stop during migration?", a: "In most cases, only a short cutover at night or on a holiday is needed." },
      ],
    },
    {
      slug: "operations",
      icon: "🔧",
      title: "Operations & Maintenance",
      summary: "Stable 24/7 operations, from monitoring and incident response to improvement proposals.",
      tags: ["24/7 monitoring", "SRE", "Maintenance"],
      lead: "With 24/7 monitoring, incident prevention and fast recovery, we keep your systems running reliably while lowering operating costs through automation and continuous improvement.",
      description: [
        "A dedicated team monitors your systems 24/7 and responds immediately to any issue. We analyze root causes and take measures to prevent recurrence.",
        "We automate routine work so people can focus on what needs human judgment. Following SRE (site reliability engineering) practices, we set and track numerical reliability targets.",
        "At monthly review meetings, we report on system status and propose improvements to keep your systems in good shape.",
      ],
      challenges: [
        "No one can respond to incidents at night or on holidays",
        "Root causes are unknown and the same incidents keep happening",
        "Operations are manual and burden your staff",
        "Your current maintenance vendor responds slowly",
      ],
      features: [
        { title: "24/7 monitoring", text: "We constantly monitor servers, networks and applications." },
        { title: "Incident response & analysis", text: "From first response to root-cause analysis and prevention." },
        { title: "Operations automation", text: "We automate routine work to reduce errors and effort." },
        { title: "Reports & proposals", text: "We report monthly and propose improvements." },
      ],
      process: [
        { title: "Review", text: "We check your systems and procedures" },
        { title: "Design", text: "We define monitoring and response procedures" },
        { title: "Handover", text: "We take over work from current staff" },
        { title: "Go live", text: "24/7 monitoring begins" },
        { title: "Improve", text: "We keep improving at monthly reviews" },
      ],
      relatedCases: ["government-security", "network-integration", "manufacturing-dx"],
      faq: [
        { q: "Can you operate systems developed by other companies?", a: "Yes. We investigate the current state and take over operations." },
        { q: "Can we contract monitoring or incident response only?", a: "Yes. You can combine only the services you need." },
      ],
    },
  ],
};

/**
 * トップページの文言（英語）。キーは ../ja/home.js とそろえる。
 */
export default {
  description: "The official website of FSI-STYLE CORP, supporting the future of business with reliable, high-performance IT solutions.",

  hero: {
    eyebrow: "IT × OT × AI SOLUTIONS",
    titleLine1: "Reliable, high-performance",
    titleAccent: "IT Solutions",
    lead: "Building the systems that support the future of business.\nOver half a century of experience, creating value for the next generation.",
    primaryButton: "Our business",
    secondaryButton: "Contact us",
  },

  services: {
    eyebrow: "OUR BUSINESS",
    title: "Our Business",
    sub: "Three solutions that support your business",
    items: [
      {
        icon: "💻",
        title: "System Development",
        text: "High-quality business and core systems, delivered end to end from requirements definition to operation.",
        tags: ["Business systems", "Core systems", "In-house enablement"],
      },
      {
        icon: "☁️",
        title: "Cloud Adoption",
        text: "Cloud migration centered on AWS, balancing cost optimization and scalability.",
        tags: ["AWS", "Cloud migration", "IaC"],
      },
      {
        icon: "🔧",
        title: "Operations & Maintenance",
        text: "Stable 24/7 operations, from monitoring and incident response to improvement proposals.",
        tags: ["24/7 monitoring", "SRE", "Maintenance"],
      },
    ],
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
      { id: "years", value: "55", unit: " yrs", label: "In business" },
    ],
    items: [
      {
        id: 1,
        title: "Core system renewal for a major financial institution",
        description: "Migrated a 10-year-old legacy system to cloud native, tripling processing speed and cutting operating costs by 40%.",
        metric: "Speed",
        metricValue: "3x",
        category: "Development",
        color: "#0b3c5d",
        icon: "🏦",
      },
      {
        id: 2,
        title: "Manufacturing DX project",
        description: "Built a predictive maintenance system with IoT sensors and AI analytics, raising equipment availability above 95%.",
        metric: "Availability",
        metricValue: "95%+",
        category: "DX",
        color: "#1a7a8c",
        icon: "🏭",
      },
      {
        id: 3,
        title: "Security platform for a government agency",
        description: "Designed and built a zero-trust security platform, greatly reducing annual incidents.",
        metric: "Incidents",
        metricValue: "-80%",
        category: "Security",
        color: "#7d3c98",
        icon: "🛡️",
      },
      {
        id: 4,
        title: "E-commerce platform for a retailer",
        description: "Built a highly available e-commerce site on a microservice architecture, handling 100,000 requests per second at peak.",
        metric: "Peak load",
        metricValue: "100k req/s",
        category: "Cloud",
        color: "#2874a6",
        icon: "🛒",
      },
      {
        id: 5,
        title: "Network integration across 500 sites",
        description: "Integrated nationwide networks with SD-WAN, cutting communication costs by 60% while doubling bandwidth.",
        metric: "Network cost",
        metricValue: "-60%",
        category: "Infrastructure",
        color: "#117a65",
        icon: "🌐",
      },
    ],
  },
};

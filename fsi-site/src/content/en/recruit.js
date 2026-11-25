/**
 * 採用情報ページの文言（英語）。キーは ../ja/recruit.js とそろえる。
 * jobs の category / types は英語版の filters の名前を使う。
 */
export default {
  title: "Careers",
  description: "Careers at FUJI SOFT INCORPORATED: open positions, employee interviews, benefits and the selection process.",

  hero: {
    eyebrow: "RECRUIT",
    title: "Join us in building\nthe future with technology",
    lead: "Your challenge can move society forward.\nFUJI SOFT welcomes everyone who keeps growing.",
    button: "Apply now",
  },

  stats: {
    eyebrow: "WORK ENVIRONMENT",
    title: "Our Workplace in Numbers",
    items: [
      { value: "18,000", suffix: "", label: "Employees (consolidated)" },
      { value: "35", suffix: "%", label: "Women in management" },
      { value: "92", suffix: "%", label: "Paid leave usage" },
      { value: "4.2", suffix: "h", label: "Avg. overtime per week" },
    ],
  },

  values: {
    eyebrow: "OUR VALUES",
    title: "Who We Are Looking For",
    items: [
      { icon: "🚀", title: "Challengers", text: "People who never settle and proactively take on new technologies and problems." },
      { icon: "🤝", title: "Co-creators", text: "People who work with their team and customers to create value together." },
      { icon: "📚", title: "Lifelong learners", text: "People eager to keep learning and growing in the fast-moving IT industry." },
    ],
  },

  jobs: {
    eyebrow: "POSITIONS",
    title: "Open Positions",
    filters: {
      categoryLabel: "Job type",
      typeLabel: "Hiring type",
      all: "All",
      categories: ["Engineering", "Business", "Corporate"],
      types: ["New graduate", "Experienced"],
    },
    countSuffix: "positions",
    noMatch: "No positions match your filters.",
    apply: "Details & apply →",
    items: [
      { category: "Engineering", title: "Systems Engineer", types: ["New graduate", "Experienced"], desc: "Design, develop and operate business and core systems." },
      { category: "Engineering", title: "Cloud Architect", types: ["Experienced"], desc: "Lead the design and build of cloud platforms centered on AWS." },
      { category: "Engineering", title: "AI / Data Scientist", types: ["New graduate", "Experienced"], desc: "Data analysis and AI solution development with machine learning." },
      { category: "Business", title: "Solution Sales", types: ["New graduate", "Experienced"], desc: "Understand customer challenges and propose the best solutions." },
      { category: "Corporate", title: "HR / General Affairs", types: ["Experienced"], desc: "Recruiting, talent development and organizational development." },
      { category: "Corporate", title: "Corporate Planning", types: ["Experienced"], desc: "Plan and drive company-wide strategy." },
    ],
  },

  interviews: {
    eyebrow: "PEOPLE",
    title: "Employee Interviews",
    sub: "We asked our people what makes their work rewarding.",
    more: "Read more",
    close: "Close",
    items: [
      {
        initial: "K",
        color: "#0b3c5d",
        name: "K.T.",
        role: "Cloud Architect / Joined 2018 (experienced hire)",
        quote: "The fun of this job is designing from what really troubles the customer.",
        body: "In my previous job I ran on-premises systems. After joining, I was given AWS migration projects, and now I lead large-scale platform design. With so many technology options, I find it rewarding to search for the answer together with the customer. Using the certification support program, I earned four advanced certifications within three years.",
      },
      {
        initial: "M",
        color: "#1a7a8c",
        name: "M.S.",
        role: "AI / Data Scientist / Joined 2021 (new graduate)",
        quote: "From my first year, I joined a project working with real factory data.",
        body: "I studied statistics at university. Training after joining gave me the basics of system development, and I was soon assigned to a predictive maintenance project. Improving the model through many discussions with people on site, and actually preventing an equipment shutdown, was an unforgettable achievement.",
      },
      {
        initial: "A",
        color: "#7d3c98",
        name: "A.N.",
        role: "Solution Sales / Joined 2016 (new graduate)",
        quote: "We build proposals together with engineers, so even in sales I can talk tech in depth.",
        body: "My role is to understand customer challenges and design solutions with our engineers. Since returning from parental leave, I combine shorter hours with remote work and still deliver results. Helping each other as a team is part of our culture.",
      },
    ],
  },

  benefits: {
    eyebrow: "BENEFITS",
    title: "Benefits & Programs",
    items: [
      { icon: "🏥", title: "Full social insurance" },
      { icon: "🏠", title: "Housing allowance" },
      { icon: "📈", title: "Certification support" },
      { icon: "💻", title: "Remote work" },
      { icon: "🌴", title: "125 days off per year" },
      { icon: "👶", title: "Childcare & nursing leave" },
      { icon: "🎓", title: "Training & e-learning" },
      { icon: "🍽️", title: "Cafeteria & café" },
    ],
  },

  flow: {
    eyebrow: "FLOW",
    title: "Selection Process",
    note: "It usually takes one to two months from application to offer.",
    items: [
      { step: "01", title: "Apply", desc: "Contact us with your details", duration: "Anytime" },
      { step: "02", title: "Document screening", desc: "We review your resume and work history", duration: "About 1 week" },
      { step: "03", title: "Interviews (2-3)", desc: "Meet our engineers and executives. Online available", duration: "About 2-4 weeks" },
      { step: "04", title: "Offer", desc: "Terms and onboarding procedures", duration: "About 1 week" },
    ],
  },

  cta: {
    title: "We look forward to your challenge.",
    text: "Feel free to apply.",
    faqText: " You can also check our frequently asked questions.",
    button: "Apply now",
    faq: "View FAQ",
  },
};

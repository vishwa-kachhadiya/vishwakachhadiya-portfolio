import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Portfolio.module.css";

gsap.registerPlugin(ScrollTrigger);

const experience = [
  {
    org: "Defense Research & Development Organization (DRDO-GTRE)",
    role: "Research Apprentice · Karnataka, India",
    date: "Jul 2025 — Apr 2026",
    bullets: [
      "Investigated Graph Anomaly Detection with advanced ML/DL and MATLAB to detect abnormal behavior in aero engines.",
      "Built a Django/Python web app to update daily test results and visualize progress.",
      "Evaluated AFADEC controller code quality with LDRA/Polyspace and LabVIEW for real-time data acquisition.",
    ],
  },
  {
    org: "Indian Space Research Organization (ISRO)",
    role: "Research Intern · Gujarat, India",
    date: "Jan 2025 — Jun 2025",
    bullets: [
      "Achieved 0.98 R² on Orbital Debris Management & Collision Prediction using PINN, Neural ODE, LSTM and FCGRU.",
      "Developed a trajectory prediction model based on the Circular Restricted Three-Body Problem and Lorenz63.",
      "Co-authored a research thesis with ISRO scientists to improve real-time space situational awareness.",
    ],
  },
  {
    org: "Laurentian University",
    role: "AI / ML Intern · Sudbury, Canada",
    date: "Jun 2024 — Aug 2024",
    bullets: [
      "Improved Fake Product Review Detection accuracy to 0.863 with TF-IDF and sentiment analysis.",
      "Performed data preprocessing and comparative evaluation of SVM and LSTM models.",
    ],
  },
];

const publications = [
  {
    title: "CNN-Based Unsupervised Anomaly Detection for Aero Engine Controller Data",
    meta: "April 2025",
    venue: "IEEE SPACE 2026",
  },
  {
    title: "Enhancing Semantic Coherence in Gujarati Topic Models by Eliminating Poor Quality Topics",
    meta: "March 2026",
    venue: "8th Parul University Conference",
  },
  {
    title: "Deepfake Detection: Demodulate Synthetic Videos Using Deep Learning Models",
    meta: "February 2026",
    venue: "IEEE INDIACom 2025",
  },
];

const projects = [
  {
    name: "COVID-19 Analysis Dashboard",
    desc: "Interactive Tableau dashboard visualizing global COVID-19 cases, deaths, and trends with dynamic analytics from a Kaggle dataset.",
    tags: ["Tableau", "Analytics", "Data Viz"],
  },
  {
    name: "AI-Based Multi-Stage Quantitative Trading System",
    desc: "Modular AI-based quantitative trading system using HMM, XGBoost, HRP, and Reinforcement Learning for automated investment decision-making.",
    tags: ["HMM", "XGBoost", "HRP", "Reinforcement Learning"],
  },
  {
    name: "Watchlist Application",
    desc: "Spring Boot + Hibernate + Thymeleaf web app integrated with the IMDb API for creating, rating, and managing movie watchlists.",
    tags: ["Spring Boot", "Hibernate", "IMDb API"],
  },
];

const skills = [
  {
    label: "Languages",
    items: ["Python", "Java", "C", "SQL", "HTML/CSS", "Bash / Linux"],
  },
  {
    label: "AI / ML",
    items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "LangChain", "NumPy", "Pandas"],
  },
  {
    label: "Engineering",
    items: ["Django", "Spring Boot", "Hibernate", "Thymeleaf", "Docker", "Git"],
  },
  {
    label: "Analysis & Tooling",
    items: ["MATLAB", "LabVIEW", "PowerBI", "Tableau", "LDRA", "Polyspace"],
  },
  {
    label: "Concepts",
    items: [
      "Deep Learning",
      "NLP",
      "LLMs",
      "Computer Vision",
      "RAG Pipelines",
      "Time Series",
      "Graph Anomaly Detection",
    ],
  },
];

export default function Portfolio() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Timeline item hover glow follow
      root.querySelectorAll<HTMLElement>(`.${styles.timelineItem}`).forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        };
        el.addEventListener("mousemove", move);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={styles.wrap}>
      {/* ABOUT */}
      <section id="about" className={styles.section}>
        <p className={styles.eyebrow} data-reveal>About</p>
        <h2 className={styles.heading} data-reveal>
          Research-driven engineer building at the edge of{" "}
          <span className={styles.headingAccent}>AI.</span>
        </h2>
        <div className={styles.aboutGrid}>
          <p className={styles.lead} data-reveal>
            I&rsquo;m Vishwa &mdash; an AI/ML researcher and Master&rsquo;s student in Computer Science
            (Artificial Intelligence) at the Université de Montréal. Passionate about developing intelligent
            systems using Machine Learning, Deep Learning, Computer Vision, NLP, and Generative AI.
            Previously, I conducted research at ISRO and DRDO, working on orbital trajectory prediction,
            anomaly detection, and AI applications for aerospace systems. My current research focuses on
            Cognitive Pilot. I enjoy solving real-world problems through AI and am always open to research
            collaborations, internships, and opportunities in Artificial Intelligence, Machine Learning, and Data Science.
          </p>
          <div className={styles.aboutMeta} data-reveal>
            <div className={styles.metaCard}>
              <div className={styles.metaLabel}>Currently</div>
              <div className={styles.metaValue}>M.Sc. Computer Science (AI), Université de Montréal</div>
            </div>
            <div className={styles.metaCard}>
              <div className={styles.metaLabel}>Based in</div>
              <div className={styles.metaValue}>Montréal, Canada</div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className={styles.section}>
        <p className={styles.eyebrow} data-reveal>Experience</p>
        <h2 className={styles.heading} data-reveal>
          Research at <span className={styles.headingAccent}>DRDO, ISRO</span> and beyond.
        </h2>
        <div className={styles.timeline}>
          {experience.map((e) => (
            <article key={e.org} className={styles.timelineItem} data-reveal>
              <div className={styles.timelineHead}>
                <div>
                  <h3 className={styles.timelineTitle}>{e.org}</h3>
                  <p className={styles.timelineRole}>{e.role}</p>
                </div>
                <span className={styles.timelineDate}>{e.date}</span>
              </div>
              <ul className={styles.timelineBullets}>
                {e.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section id="publications" className={styles.section}>
        <p className={styles.eyebrow} data-reveal>Publications</p>
        <h2 className={styles.heading} data-reveal>
          Peer-reviewed work at <span className={styles.headingAccent}>IEEE and beyond.</span>
        </h2>
        <div className={styles.pubGrid}>
          {publications.map((p, i) => (
            <div key={p.title} className={styles.pubItem} data-reveal>
              <span className={styles.pubIndex}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.pubTitle}>{p.title}</h3>
                <p className={styles.pubMeta}>{p.meta}</p>
              </div>
              <span className={styles.pubVenue}>{p.venue}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className={styles.section}>
        <p className={styles.eyebrow} data-reveal>Selected projects</p>
        <h2 className={styles.heading} data-reveal>
          Shipped <span className={styles.headingAccent}>end-to-end.</span>
        </h2>
        <div className={styles.projectGrid}>
          {projects.map((p) => (
            <article key={p.name} className={styles.projectCard} data-reveal>
              <div>
                <h3 className={styles.projectName}>{p.name}</h3>
                <p className={styles.projectDesc}>{p.desc}</p>
              </div>
              <div className={styles.projectTags}>
                {p.tags.map((t) => <span key={t} className={styles.projectTag}>{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className={styles.section}>
        <p className={styles.eyebrow} data-reveal>Toolbox</p>
        <h2 className={styles.heading} data-reveal>
          What I build <span className={styles.headingAccent}>with.</span>
        </h2>
        <div className={styles.skillsGrid}>
          {skills.map((g) => (
            <div key={g.label} className={styles.skillGroup} data-reveal>
              <p className={styles.skillLabel}>{g.label}</p>
              <div className={styles.skillList}>
                {g.items.map((s) => <span key={s} className={styles.skillPill}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={styles.contact}>
        <h2 className={styles.contactHeading} data-reveal>
          Let&rsquo;s build<em>Intelligent Systems </em>
        </h2>
        <p className={styles.lead} style={{ margin: "0 auto" }} data-reveal>
          Open to research collaborations and AI engineering roles.
        </p>
        <div className={styles.contactLinks} data-reveal>
          <a className={`${styles.contactLink} ${styles.primary}`} href="mailto:vishwa.kachhadiyaa@gmail.com">
            Say hello
          </a>
          <a className={styles.contactLink} href="https://www.linkedin.com/in/vishwakachhadiya/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className={styles.contactLink} href="https://github.com/vishwa-kachhadiya" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className={styles.contactLink} href="tel:+15149801753">
            +1 514 980 1753
          </a>
        </div>
      </section>

    </div>
  );
}

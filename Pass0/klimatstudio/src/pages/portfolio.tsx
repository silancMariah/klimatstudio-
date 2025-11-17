"use client";

import { useNavigate } from "react-router-dom";
import "../styles/portfolio.css";

type PortfolioProps = {
  onGoHome?: () => void;
  onOpenPass?: () => void;
};

export default function PortfolioPage({ onGoHome, onOpenPass }: PortfolioProps = {}) {
  const navigate = useNavigate();
  const heroStats = [
    {
      value: "Python",
      label: "Första steget",
      description: "Vi börjar i små trygga projekt"
    },
    {
      value: "AI",
      label: "Utforskande",
      description: "Barnen testar hur datorer kan lära sig"
    },
    {
      value: "Maker",
      label: "Energi & kretsar",
      description: "Vi experimenterar med solceller och teknik"
    }
  ];

  const programCards = [
    {
      title: "Pass 1: Skapa din egen Jord",
      description:
        "Vi använder Python och Turtle för att rita en egen planet som reagerar på förändringar i CO₂ och temperatur.",
      tags: ["Python", "Turtle", "Klimat"]
    },
    {
      title: "Pass 2: Träna din första AI",
      description:
        "Deltagarna bygger egna bildmodeller i Teachable Machine och får förståelse för hur maskininlärning fungerar – ungefär som satelliter som tolkar bilder.",
      tags: ["AI", "Bildigenkänning", "ML"]
    },
    {
      title: "Pass 3: Skapa AI för klimatdata",
      description:
        "Vi arbetar med if-statements och bygger en liten AI som svarar på frågor vi själva definierar, baserat på klimatdata.",
      tags: ["Python", "Logik", "Klimat"]
    },
    {
      title: "Pass 4: Artificiell Intelligens",
      description:
        "Vi använder Python och klimatdata för att skapa en enkel AI som kan göra små förutsägelser. Här får deltagarna se hur datorer kan lära sig från data.",
      tags: ["Python", "Data", "AI"]
    },
    {
      title: "Pass 5: Bygg en solcell",
      description:
        "Barnen kopplar kretsar, testar energi och bygger sin egen mini-solpanel både i verkligheten och i Tinkercad.",
      tags: ["Energi", "Elektronik", "Maker"]
    },
    {
      title: "Pass 6: Fördjupning",
      description:
        "Deltagarna väljer ett tidigare moment de gillade och fördjupar sig i det. Här finns tid att skapa något eget och arbeta mer självständigt.",
      tags: ["Fördjupning", "Utforskande"]
    },
    {
      title: "Pass 7: Fördjupning",
      description:
        "Ett fortsatt fördjupningspass där deltagarna bygger vidare på sina idéer, testar mer avancerade lösningar eller finslipar sina projekt.",
      tags: ["Fördjupning", "Utforskande"]
    }
  ];

  const partnerProjects = [
    {
      title: "Satellitspaning",
      description:
        "Vi använder riktiga bilder och data från NASA för att förstå hur klimatet förändras från rymden.",
      tags: ["NASA", "Rymddata", "Klimat"]
    },
    {
      title: "SMHI Climate Lab",
      description:
        "Barnen analyserar temperaturer, nederbörd och historiska trender för att bygga egna klimatmodeller.",
      tags: ["SMHI", "Data", "Analys"]
    },
    {
      title: "Maker & Solenergi",
      description:
        "Ett samarbete där barn bygger kretsar, testar solceller och lär sig hur ren energi fungerar i praktiken.",
      tags: ["Energi", "Elektronik", "Tinkercad"]
    }
  ];

  const contactItems = [
    { icon: "🛰️", title: "Community", value: "Hello World!s öppna kanaler" },
    { icon: "💬", title: "Frågor", value: "Via handledare eller ledare" },
    { icon: "🌍", title: "Plattform", value: "Klimatstudio online-miljö" }
  ];

  const socialLinks = [
    { label: "NASA Earth Observatory", href: "https://earthobservatory.nasa.gov" },
    { label: "ESA Kids – Space for Children", href: "https://www.esa.int/kids" },
    { label: "NOAA Climate.gov", href: "https://www.climate.gov" },
    { label: "Copernicus Climate Change Service", href: "https://climate.copernicus.eu" },
    { label: "SMHI – Klimat", href: "https://www.smhi.se/klimat" }
  ];

  const handleHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/");
    }
  };

  const handleOpenPass = () => {
    if (onOpenPass) {
      onOpenPass();
    } else {
      navigate("/pass0");
    }
  };

  return (
    <div className="portfolio-wrapper">

      {/* 🌌 GLOBAL PLANETS (FOLLOW SCROLL) */}
      <div className="planet-orbit" aria-hidden="true">
        <img src="/assets/img/solsytem/1sol.png" className="planet planet-sun" />
        <img src="/assets/img/solsytem/2mercury.png" className="planet planet-mercury" />
        <img src="/assets/img/solsytem/3venus.png" className="planet planet-venus" />
        <img src="/assets/img/solsytem/4jorden.png" className="planet planet-earth" />
        <img src="/assets/img/solsytem/5mars.png" className="planet planet-mars" />
        <img src="/assets/img/solsytem/6jupiter.png" className="planet planet-jupiter" />
        <img src="/assets/img/solsytem/7saturnus.png" className="planet planet-saturn" />
        <img src="/assets/img/solsytem/8uranus.png" className="planet planet-uranus" />
        <img src="/assets/img/solsytem/9neptune.png" className="planet planet-neptune" />
      </div>

      {/* NAVIGATION */}
      <nav className="navbar">
        <img src="templates/Helloworld.png" alt="helloworld" className="nav-logo-img" />

        <div className="navbar-content">
          <div className="nav-links">
            <a href="#mission" className="nav-link">Vår Mission</a>
            <a href="#program" className="nav-link">Pass & Sammanfattning</a>
            <a href="#partners" className="nav-link">Hjälpmedel</a>
            <a href="#contact" className="nav-link">Kontakt</a>
            <a href="#social" className="nav-link">Utforska mer</a>
          </div>
        </div>
      </nav>


      {/* HERO SECTION */}
      <section className="container" id="home">
        <div className="hero-card">
          <div className="hero-pill">Milky Way Mission</div>
          <h1 className="hero-name">Empowering Young Minds</h1>
          <h2 className="hero-title">Digitalt skapande för barn & unga</h2>
          <p className="hero-description">
            Hello World! gör digitalt skapande lättillgängligt för alla barn och unga.
            Vi bygger satelliter, klimatspel och kreativa berättelser med fokus på trygghet och gemenskap.
          </p>

          <div className="cta-buttons">
            <button type="button" className="btn btn-primary" onClick={handleOpenPass}>
              🚀 Bygg din galax
            </button>
            <button type="button" className="btn btn-outline" onClick={handleHome}>
              🏠 Tillbaka hem
            </button>
          </div>

          <div className="hero-stats">
            {heroStats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <p>{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="section section-bg">
        <div className="container">
          <h2 className="section-title"><span>Vår Mission</span></h2>

          <div className="about-content">
            <div className="about-text">
              <p>Klimatstudio finns för att väcka nyfikenhet, skapa förebilder och ge fler barn modet att bygga framtidens lösningar.</p>
              <p>Allt material tas fram tillsammans med eleverna – vi testar, skrotar och bygger om tills rymdäventyren känns engagerande i klassrummet.</p>
            </div>

            <div className="about-info">
              <div className="info-item">
                <span className="info-title">Favoritverktyg</span>
                <div className="languages-list">
                  {["Three.js", "React", "Python", "Turtle"].map((tool) => (
                    <span key={tool} className="language-tag">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="info-item">
                <span className="info-title">Kärnvärden</span>
                <p>Tryggt, kreativt och nyfiket lärande där alla får glänsa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="section">
        <div className="container">
          <h2 className="section-title"><span>Pass & Sammanfattning</span></h2>

          <div className="skills-grid">
            {programCards.map((p) => (
              <div className="skill-card" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="skill-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="section section-bg">
        <div className="container">
          <h2 className="section-title"><span>Hjälpmedel</span></h2>

          <div className="projects-grid">
            {partnerProjects.map((project) => (
              <div className="project-card" key={project.title}>
                <div className="project-image"><span className="project-icon">🚀</span></div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title"><span>Kontakt & community</span></h2>

          <div className="contact-container">
            <div className="contact-info">
              {contactItems.map((item) => (
                <div className="contact-item" key={item.title}>
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-text">
                    <h4>{item.title}</h4>
                    <p className="contact-value">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section id="social" className="section">
        <div className="container">
          <h2 className="section-title"><span>Utforska mer</span></h2>
          <div className="social-links">
            {socialLinks.map((s) => (
              <a key={s.label} className="social-link" href={s.href} target="_blank">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="footer-text">© 2025 Klimatstudio. Skapad med kärlek, kod och nyfikenhet.</p>
        </div>
      </footer>

    </div>
  );
}

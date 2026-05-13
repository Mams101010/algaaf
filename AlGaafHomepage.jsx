import { useState, useEffect, useRef } from "react";

const SAND = "#E8DDCF";
const OLIVE = "#4A4B23";
const CREAM = "#F7F3EC";
const GRAPHITE = "#2B2B2B";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body {
    background: ${SAND};
    color: ${OLIVE};
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
  }

  .display { font-family: 'Cormorant Garamond', serif; font-weight: 300; }
  .display-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes drawLine {
    from { stroke-dashoffset: 1000; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes scrollDown {
    0% { opacity: 1; transform: translateY(0); }
    80% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 0; }
  }

  .hero-label { animation: fadeUp 1s ease 0.3s both; }
  .hero-title { animation: fadeUp 1.2s ease 0.55s both; }
  .hero-sub { animation: fadeUp 1s ease 0.8s both; }
  .hero-cta { animation: fadeUp 1s ease 1s both; }

  .grain-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px;
  }

  .nav-link {
    text-decoration: none;
    color: ${OLIVE};
    letter-spacing: 0.2em;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 300;
    opacity: 0.65;
    transition: opacity 0.3s;
    cursor: pointer;
  }
  .nav-link:hover { opacity: 1; }

  .btn-primary {
    padding: 14px 36px;
    background: ${OLIVE};
    color: ${SAND};
    border: none;
    letter-spacing: 0.28em;
    font-size: 10px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    border-radius: 100px;
    cursor: pointer;
    transition: opacity 0.3s, transform 0.2s;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }

  .btn-secondary {
    padding: 13px 36px;
    background: transparent;
    color: ${OLIVE};
    border: 1px solid rgba(74,75,35,0.25);
    letter-spacing: 0.28em;
    font-size: 10px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
  }
  .btn-secondary:hover { background: rgba(74,75,35,0.06); transform: translateY(-1px); }

  .focus-card {
    padding: 48px 40px;
    border-radius: 28px;
    border: 1px solid rgba(74,75,35,0.1);
    background: rgba(232,221,207,0.45);
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), border-color 0.3s;
  }
  .focus-card:hover { transform: translateY(-6px); border-color: rgba(74,75,35,0.2); }

  .venture-row {
    display: grid;
    grid-template-columns: 2fr 1fr 80px;
    align-items: center;
    padding: 28px 0;
    border-bottom: 1px solid rgba(74,75,35,0.08);
    transition: opacity 0.3s;
    cursor: default;
    gap: 20px;
  }
  .venture-row:hover { opacity: 0.7; }

  .scroll-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${OLIVE};
    opacity: 0.5;
    margin: 0 auto;
    animation: scrollDown 1.8s ease infinite;
  }

  .section-fade {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .section-fade.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .desert-path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 3s ease 1.5s forwards;
  }

  .menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 4px;
  }
  .menu-line {
    width: 22px;
    height: 1px;
    background: ${OLIVE};
    transition: all 0.3s;
  }

  .mobile-menu {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 280px;
    background: ${CREAM};
    z-index: 100;
    padding: 80px 40px;
    display: flex;
    flex-direction: column;
    gap: 36px;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
    border-left: 1px solid rgba(74,75,35,0.1);
  }
  .mobile-menu.open { transform: translateX(0); }

  .mobile-overlay {
    position: fixed; inset: 0; z-index: 99;
    background: rgba(43,43,43,0.3);
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s;
  }
  .mobile-overlay.open { opacity: 1; pointer-events: all; }

  @media (max-width: 768px) {
    .venture-row { grid-template-columns: 1fr 1fr; }
    .venture-year { display: none; }
  }
`;

function useIntersect(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function FadeSection({ children, style, className = "" }) {
  const ref = useRef(null);
  const visible = useIntersect(ref);
  return (
    <div
      ref={ref}
      className={`section-fade ${visible ? "visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

const ventures = [
  { name: "Digital Infrastructure", category: "Technology", year: "2022" },
  { name: "Gulf Agri Holdings", category: "Agriculture", year: "2021" },
  { name: "RegioNav Logistics", category: "Logistics", year: "2023" },
  { name: "Makan Real Estate", category: "Real Estate", year: "2020" },
  { name: "Hayat Health", category: "Healthcare", year: "2024" },
];

export default function AlGaafHomepage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="grain-overlay" />

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile nav */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div
          style={{ letterSpacing: "0.35em", fontSize: 18, fontWeight: 300, marginBottom: 8 }}
          className="display"
        >
          AL GAAF
        </div>
        {["about", "focus", "ventures", "contact"].map((s) => (
          <span
            key={s}
            className="nav-link"
            style={{ fontSize: 13, opacity: 0.8 }}
            onClick={() => scrollTo(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        ))}
      </div>

      <div style={{ background: SAND, minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* Navigation */}
        <header
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 48px",
            borderBottom: "1px solid rgba(74,75,35,0.08)",
            background: `rgba(232,221,207,0.88)`,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="display"
            style={{ letterSpacing: "0.45em", fontSize: 17, fontWeight: 300, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            AL GAAF
          </div>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 44 }}
            className="desktop-nav"
          >
            {["about", "focus", "ventures", "contact"].map((s) => (
              <span key={s} className="nav-link" onClick={() => scrollTo(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none" }}
            id="hamburger"
          >
            <div className="menu-line" style={{ width: menuOpen ? "22px" : "22px", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <div className="menu-line" style={{ opacity: menuOpen ? 0 : 1 }} />
            <div className="menu-line" style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </header>

        {/* Hero */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 100,
            paddingBottom: 80,
            paddingLeft: 24,
            paddingRight: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Dot grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(74,75,35,0.12) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 860, textAlign: "center", position: "relative", zIndex: 2 }}>
            <div className="hero-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 40 }}>
              <div style={{ width: 60, height: "1px", background: `rgba(74,75,35,0.3)` }} />
              <span style={{ letterSpacing: "0.4em", fontSize: 11, textTransform: "uppercase", opacity: 0.6 }}>
                Investment & Technology Group
              </span>
              <div style={{ width: 60, height: "1px", background: `rgba(74,75,35,0.3)` }} />
            </div>

            <h1
              className="display hero-title"
              style={{
                fontSize: "clamp(52px, 10vw, 110px)",
                fontWeight: 300,
                letterSpacing: "0.12em",
                lineHeight: 1.05,
                marginBottom: 36,
              }}
            >
              Rooted<br />
              <span className="display-italic" style={{ opacity: 0.7 }}>in the</span>{" "}
              Future
            </h1>

            <p
              className="hero-sub"
              style={{
                maxWidth: 540,
                margin: "0 auto 56px",
                fontSize: 16,
                lineHeight: 2,
                opacity: 0.65,
                letterSpacing: "0.03em",
              }}
            >
              A modern Gulf investment and technology group focused on building long-term value through strategic ventures, digital infrastructure, and future-facing innovation.
            </p>

            <div
              className="hero-cta"
              style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
            >
              <button className="btn-primary" onClick={() => scrollTo("about")}>
                Explore Group
              </button>
              <button className="btn-secondary" onClick={() => scrollTo("contact")}>
                Contact Us
              </button>
            </div>
          </div>

          {/* Desert line SVG */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.35, pointerEvents: "none" }}>
            <svg viewBox="0 0 1440 180" style={{ width: "100%", display: "block" }}>
              <path
                className="desert-path"
                fill="none"
                stroke={OLIVE}
                strokeWidth="1"
                d="M0,110 C120,90 200,150 380,120 C560,90 620,50 800,80 C980,110 1060,40 1240,75 C1360,98 1400,90 1440,95"
              />
              <path
                className="desert-path"
                fill="none"
                stroke={OLIVE}
                strokeWidth="0.5"
                strokeDasharray="1000"
                style={{ animationDelay: "2s" }}
                d="M0,140 C150,120 280,170 460,148 C640,126 710,90 900,115 C1090,140 1180,105 1440,130"
              />
            </svg>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.4 }}>Scroll</span>
            <div className="scroll-dot" />
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          style={{
            padding: "120px 48px",
            borderTop: "1px solid rgba(74,75,35,0.08)",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FadeSection>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 80,
                alignItems: "center",
              }}>
                <div>
                  <p style={{ letterSpacing: "0.35em", fontSize: 10, textTransform: "uppercase", opacity: 0.5, marginBottom: 28 }}>
                    About AL GAAF
                  </p>
                  <h2
                    className="display"
                    style={{
                      fontSize: "clamp(36px, 5vw, 58px)",
                      fontWeight: 300,
                      lineHeight: 1.15,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Building the next generation of Gulf ventures.
                  </h2>
                </div>
                <div>
                  <div style={{ width: 40, height: "1px", background: `rgba(74,75,35,0.3)`, marginBottom: 32 }} />
                  <p style={{ fontSize: 16, lineHeight: 2.1, opacity: 0.7, marginBottom: 28 }}>
                    Inspired by the resilience of the <em>ghaf</em> tree — the enduring symbol of life across the Arabian desert — AL GAAF represents long-term thinking, strategic growth, and grounded innovation.
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 2.1, opacity: 0.7 }}>
                    We invest in technology, infrastructure, and transformative businesses shaping the future of the region and beyond.
                  </p>
                </div>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Focus Areas */}
        <section
          id="focus"
          style={{
            padding: "120px 48px",
            background: CREAM,
            borderTop: "1px solid rgba(74,75,35,0.08)",
            borderBottom: "1px solid rgba(74,75,35,0.08)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeSection>
              <div style={{ textAlign: "center", marginBottom: 72 }}>
                <p style={{ letterSpacing: "0.35em", fontSize: 10, textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>
                  Focus Areas
                </p>
                <h2
                  className="display"
                  style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, letterSpacing: "0.06em" }}
                >
                  Strategic sectors.
                </h2>
              </div>
            </FadeSection>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}>
              {[
                {
                  num: "01",
                  title: "Technology",
                  text: "AI, enterprise software, automation, and digital platforms shaping the future economy.",
                  icon: "◎",
                },
                {
                  num: "02",
                  title: "Investments",
                  text: "Long-term strategic positions across scalable, high-impact industries throughout the GCC.",
                  icon: "◈",
                },
                {
                  num: "03",
                  title: "Infrastructure",
                  text: "Building resilient foundations through future-facing regional initiatives and development.",
                  icon: "◇",
                },
              ].map((item, i) => (
                <FadeSection key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
                  <div className="focus-card">
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 48,
                    }}>
                      <span style={{ fontSize: 11, letterSpacing: "0.25em", opacity: 0.4 }}>{item.num}</span>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        border: "1px solid rgba(74,75,35,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        opacity: 0.5,
                      }}>
                        {item.icon}
                      </div>
                    </div>
                    <h3 style={{
                      fontSize: 20,
                      letterSpacing: "0.12em",
                      fontWeight: 300,
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ lineHeight: 1.9, opacity: 0.65, fontSize: 15 }}>
                      {item.text}
                    </p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* Visual divider — statement */}
        <section style={{
          padding: "110px 48px",
          borderBottom: "1px solid rgba(74,75,35,0.08)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(74,75,35,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74,75,35,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }} />
          <FadeSection>
            <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
              <p
                className="display-italic"
                style={{
                  fontSize: "clamp(28px, 4.5vw, 52px)",
                  fontWeight: 300,
                  lineHeight: 1.5,
                  letterSpacing: "0.04em",
                  opacity: 0.8,
                }}
              >
                "Rooted in regional heritage.
                <br />Built for the future of the Gulf."
              </p>
              <div style={{ width: 48, height: "1px", background: `rgba(74,75,35,0.25)`, margin: "40px auto 0" }} />
            </div>
          </FadeSection>
        </section>

        {/* Ventures */}
        <section id="ventures" style={{ padding: "120px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <FadeSection>
              <div style={{ marginBottom: 60 }}>
                <p style={{ letterSpacing: "0.35em", fontSize: 10, textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>
                  Ventures
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                  <h2
                    className="display"
                    style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 300, letterSpacing: "0.06em", lineHeight: 1.15 }}
                  >
                    A platform for<br />
                    <span className="display-italic">enduring growth.</span>
                  </h2>
                  <p style={{ maxWidth: 320, fontSize: 14, lineHeight: 1.9, opacity: 0.6 }}>
                    Partnering with ambitious founders and transformative opportunities across the GCC and beyond.
                  </p>
                </div>
              </div>
            </FadeSection>

            {/* Column headers */}
            <FadeSection>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 80px",
                gap: 20,
                paddingBottom: 16,
                borderBottom: "1px solid rgba(74,75,35,0.15)",
                marginBottom: 0,
              }}>
                {["Company", "Sector", "Year"].map((h) => (
                  <span key={h} style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>
                    {h}
                  </span>
                ))}
              </div>
            </FadeSection>

            {ventures.map((v, i) => (
              <FadeSection key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="venture-row">
                  <span style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 300, letterSpacing: "0.04em" }}>
                    {v.name}
                  </span>
                  <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>
                    {v.category}
                  </span>
                  <span className="venture-year" style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", textAlign: "right" }}>
                    {v.year}
                  </span>
                </div>
              </FadeSection>
            ))}

            <FadeSection>
              <div style={{ marginTop: 52, display: "flex", alignItems: "center", gap: 24 }}>
                <button className="btn-primary" style={{ fontSize: 10 }}>
                  All Ventures
                </button>
                <span style={{ fontSize: 11, opacity: 0.45, letterSpacing: "0.15em" }}>
                  {ventures.length} Portfolio Companies
                </span>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Closing + Contact */}
        <footer
          id="contact"
          style={{
            background: OLIVE,
            color: SAND,
            padding: "100px 48px 64px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle bg grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(232,221,207,0.06) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Closing statement */}
            <FadeSection>
              <div style={{ textAlign: "center", marginBottom: 100 }}>
                <p style={{ letterSpacing: "0.35em", fontSize: 10, textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
                  Begin the Conversation
                </p>
                <h2
                  className="display"
                  style={{
                    fontSize: "clamp(36px, 6vw, 72px)",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    lineHeight: 1.1,
                    color: SAND,
                    marginBottom: 40,
                  }}
                >
                  Let's build something<br />
                  <span className="display-italic" style={{ opacity: 0.7 }}>that endures.</span>
                </h2>
                <button
                  className="btn-secondary"
                  style={{ borderColor: "rgba(232,221,207,0.3)", color: SAND }}
                  onClick={() => window.location.href = "mailto:hi@algaaf.co"}
                >
                  hi@algaaf.co
                </button>
              </div>
            </FadeSection>

            {/* Footer bottom */}
            <div style={{
              borderTop: "1px solid rgba(232,221,207,0.12)",
              paddingTop: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}>
              <div>
                <div
                  className="display"
                  style={{ letterSpacing: "0.4em", fontSize: 16, color: SAND, marginBottom: 6 }}
                >
                  AL GAAF
                </div>
                <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.45 }}>
                  Investment & Technology Group
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, opacity: 0.5, letterSpacing: "0.15em", lineHeight: 2 }}>
                  Doha — Qatar
                  <br />
                  © {new Date().getFullYear()} AL GAAF
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          header { padding: 20px 24px !important; }
          .desktop-nav { display: none !important; }
          #hamburger { display: flex !important; }
          section, footer { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </>
  );
}

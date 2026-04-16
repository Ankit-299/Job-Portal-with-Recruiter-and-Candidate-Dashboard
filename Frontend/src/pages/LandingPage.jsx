import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImg from "../assets/land.jpg";
import { Briefcase, Users, TrendingUp, CheckCircle, ArrowRight, Star, Zap, Shield, Globe } from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { num: "10K+", label: "Active Jobs", icon: Briefcase },
    { num: "5K+", label: "Companies", icon: Users },
    { num: "50K+", label: "Candidates", icon: TrendingUp },
    { num: "95%", label: "Success Rate", icon: CheckCircle },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Applications",
      desc: "Apply to multiple jobs in seconds with one-click apply and smart profile matching.",
      color: "#4F8EF7"
    },
    {
      icon: Shield,
      title: "Verified Companies Only",
      desc: "Every recruiter is verified, ensuring legitimate opportunities and protecting your data.",
      color: "#10B981"
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      desc: "Access remote and international positions from top companies worldwide.",
      color: "#9B6AF7"
    },
    {
      icon: Star,
      title: "AI-Powered Matching",
      desc: "Our smart algorithm connects you with jobs that perfectly match your skills.",
      color: "#F59E0B"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      text: "CareerPath helped me land my dream job in just 2 weeks. The platform is incredibly intuitive!",
      avatar: "SC"
    },
    {
      name: "Michael Roberts",
      role: "HR Director at TechCorp",
      text: "We've hired 50+ talented professionals through CareerPath. The quality of candidates is outstanding.",
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      role: "Product Designer at Meta",
      text: "The application tracking feature is a game-changer. I never missed an opportunity!",
      avatar: "EJ"
    }
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0A0A0F", color: "#F0EDEA", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 48px", height: "72px",
        background: scrollY > 50 ? "rgba(10,10,15,0.95)" : "rgba(10,10,15,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.04)",
        transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            background: "linear-gradient(135deg, #4F8EF7, #7C3AED)", 
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(79,142,247,0.3)"
          }} />
          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            Career<span style={{ color: "#4F8EF7" }}>Path</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={() => navigate("/login")} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
            color: "#F0EDEA", padding: "10px 24px", borderRadius: "10px",
            cursor: "pointer", fontSize: "14px", fontWeight: "500",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = "#4F8EF7";
            e.target.style.background = "rgba(79,142,247,0.1)";
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = "rgba(255,255,255,0.15)";
            e.target.style.background = "transparent";
          }}
          >
            Log in
          </button>
          <button onClick={() => navigate("/register")} style={{
            background: "linear-gradient(135deg, #4F8EF7, #6366F1)", 
            border: "none", color: "#fff",
            padding: "10px 24px", borderRadius: "10px", cursor: "pointer",
            fontSize: "14px", fontWeight: "600",
            boxShadow: "0 4px 12px rgba(79,142,247,0.3)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(79,142,247,0.4)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(79,142,247,0.3)";
          }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ 
        position: "relative", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        overflow: "hidden",
        paddingTop: "72px"
      }}>
        {/* Animated Background */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 20% 50%, rgba(79,142,247,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(124,58,237,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.08) 0%, transparent 50%)",
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: "transform 0.1s ease-out"
        }} />
        
        {/* Grid Pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.5
        }} />

        <div style={{ 
          position: "relative", 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 48px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
          width: "100%"
        }}>
          {/* Left Content */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "rgba(79,142,247,0.1)", 
              border: "1px solid rgba(79,142,247,0.25)",
              borderRadius: "100px", 
              padding: "8px 20px", 
              marginBottom: "32px",
              animation: "fadeInUp 0.6s ease-out"
            }}>
              <span style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                background: "#4F8EF7",
                boxShadow: "0 0 12px #4F8EF7",
                animation: "pulse 2s infinite"
              }} />
              <span style={{ fontSize: "14px", color: "#4F8EF7", fontWeight: "600" }}>Now hiring in 100+ cities</span>
            </div>

            <h1 style={{
              fontSize: "clamp(48px, 5.5vw, 72px)", 
              fontWeight: "800",
              lineHeight: "1.1", 
              letterSpacing: "-2px", 
              marginBottom: "24px",
              animation: "fadeInUp 0.6s ease-out 0.1s both"
            }}>
              Find your<br />
              <span style={{ 
                background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>dream career</span>
            </h1>

            <p style={{ 
              fontSize: "18px", 
              color: "rgba(240,237,234,0.6)", 
              maxWidth: "520px", 
              lineHeight: "1.8", 
              marginBottom: "40px",
              animation: "fadeInUp 0.6s ease-out 0.2s both"
            }}>
              Connect with top employers worldwide. Your next opportunity is just one click away.
            </p>

            <div style={{ 
              display: "flex", 
              gap: "16px", 
              flexWrap: "wrap",
              animation: "fadeInUp 0.6s ease-out 0.3s both"
            }}>
              <button onClick={() => navigate("/login")} style={{
                background: "linear-gradient(135deg, #4F8EF7, #6366F1)", 
                color: "#fff", 
                border: "none",
                padding: "16px 36px", 
                borderRadius: "12px", 
                fontSize: "16px",
                fontWeight: "600", 
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(79,142,247,0.4)",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 8px 24px rgba(79,142,247,0.5)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 16px rgba(79,142,247,0.4)";
              }}
              >
                Start as Candidate
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/register")} style={{
                background: "rgba(255,255,255,0.05)", 
                color: "#F0EDEA",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "16px 36px", 
                borderRadius: "12px", 
                fontSize: "16px",
                fontWeight: "600", 
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.borderColor = "rgba(255,255,255,0.25)";
                e.target.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.target.style.background = "rgba(255,255,255,0.05)";
                e.target.style.borderColor = "rgba(255,255,255,0.15)";
                e.target.style.transform = "translateY(0)";
              }}
              >
                Post a Job
              </button>
            </div>
          </div>

          {/* Right - Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            animation: "fadeInUp 0.6s ease-out 0.4s both"
          }}>
            {stats.map((s, i) => {
              const IconComponent = s.icon;
              const colors = ["#4F8EF7", "#9B6AF7", "#10B981", "#F59E0B"];
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${colors[i]}20`,
                    borderRadius: "20px",
                    padding: "28px",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.borderColor = `${colors[i]}40`;
                    e.currentTarget.style.boxShadow = `0 12px 24px ${colors[i]}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = `${colors[i]}20`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${colors[i]}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors[i],
                    marginBottom: "16px"
                  }}>
                    <IconComponent size={24} />
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#F0EDEA", marginBottom: "6px" }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", fontWeight: "500" }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "120px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <p style={{ 
            fontSize: "14px", 
            textTransform: "uppercase", 
            letterSpacing: "3px", 
            color: "#4F8EF7", 
            marginBottom: "16px",
            fontWeight: "600"
          }}>Why Choose CareerPath</p>
          <h2 style={{ 
            fontSize: "48px", 
            fontWeight: "800", 
            letterSpacing: "-1.5px",
            lineHeight: "1.2"
          }}>
            Everything you need to<br />
            <span style={{ 
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>succeed in your career</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={i} 
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "24px", 
                  padding: "40px 32px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${feature.color}40`;
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${feature.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "18px",
                  background: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feature.color,
                  marginBottom: "24px"
                }}>
                  <IconComponent size={28} />
                </div>
                <h3 style={{ 
                  fontSize: "22px", 
                  fontWeight: "700", 
                  marginBottom: "12px",
                  color: "#F0EDEA"
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: "rgba(240,237,234,0.5)", 
                  lineHeight: "1.8",
                  fontSize: "15px"
                }}>
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ 
        padding: "120px 48px",
        background: "linear-gradient(180deg, transparent 0%, rgba(79,142,247,0.03) 50%, transparent 100%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <p style={{ 
              fontSize: "14px", 
              textTransform: "uppercase", 
              letterSpacing: "3px", 
              color: "#F59E0B", 
              marginBottom: "16px",
              fontWeight: "600"
            }}>Testimonials</p>
            <h2 style={{ 
              fontSize: "48px", 
              fontWeight: "800", 
              letterSpacing: "-1.5px"
            }}>
              Loved by <span style={{ color: "#F59E0B" }}>thousands</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "24px",
                  padding: "40px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={18} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ 
                  fontSize: "16px", 
                  lineHeight: "1.8", 
                  color: "rgba(240,237,234,0.7)",
                  marginBottom: "28px",
                  fontStyle: "italic"
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#fff"
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA" }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)" }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ padding: "120px 48px" }}>
        <div style={{
          maxWidth: "1000px", 
          margin: "0 auto", 
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(79,142,247,0.15), rgba(124,58,237,0.12))",
          border: "1px solid rgba(79,142,247,0.25)", 
          borderRadius: "32px", 
          padding: "80px 60px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Background decoration */}
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,142,247,0.2) 0%, transparent 70%)",
            filter: "blur(60px)"
          }} />
          
          <div style={{ position: "relative" }}>
            <h2 style={{ 
              fontSize: "44px", 
              fontWeight: "800", 
              letterSpacing: "-1.5px", 
              marginBottom: "20px",
              lineHeight: "1.2"
            }}>
              Ready to transform your<br />
              <span style={{ 
                background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>career journey?</span>
            </h2>
            <p style={{ 
              color: "rgba(240,237,234,0.6)", 
              marginBottom: "40px", 
              fontSize: "18px",
              maxWidth: "600px",
              margin: "0 auto 40px",
              lineHeight: "1.7"
            }}>
              Join over 50,000 professionals who have already found their dream jobs through CareerPath.
            </p>
            <button onClick={() => navigate("/register")} style={{
              background: "linear-gradient(135deg, #4F8EF7, #6366F1)", 
              color: "#fff", 
              border: "none",
              padding: "18px 48px", 
              borderRadius: "14px", 
              fontSize: "17px",
              fontWeight: "700", 
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(79,142,247,0.4)",
              transition: "all 0.3s",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px"
            }}
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 12px 32px rgba(79,142,247,0.5)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 24px rgba(79,142,247,0.4)";
            }}
            >
              Create Free Account
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)", 
        padding: "48px 48px 32px",
        background: "rgba(0,0,0,0.3)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "2fr 1fr 1fr 1fr", 
            gap: "48px",
            marginBottom: "48px"
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ 
                  width: "32px", 
                  height: "32px", 
                  background: "linear-gradient(135deg, #4F8EF7, #7C3AED)", 
                  borderRadius: "8px" 
                }} />
                <span style={{ fontSize: "20px", fontWeight: "700" }}>
                  Career<span style={{ color: "#4F8EF7" }}>Path</span>
                </span>
              </div>
              <p style={{ 
                color: "rgba(240,237,234,0.5)", 
                lineHeight: "1.7",
                fontSize: "14px",
                maxWidth: "300px"
              }}>
                Connecting talent with opportunity. Your dream career is just one click away.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#F0EDEA" }}>For Candidates</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Browse Jobs", "Career Advice", "Resume Builder", "Salary Guide"].map((link, i) => (
                  <a key={i} href="#" style={{ 
                    color: "rgba(240,237,234,0.5)", 
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.color = "#4F8EF7"}
                  onMouseLeave={e => e.target.style.color = "rgba(240,237,234,0.5)"}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#F0EDEA" }}>For Recruiters</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Post a Job", "Browse Candidates", "Pricing Plans", "Enterprise"].map((link, i) => (
                  <a key={i} href="#" style={{ 
                    color: "rgba(240,237,234,0.5)", 
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.color = "#4F8EF7"}
                  onMouseLeave={e => e.target.style.color = "rgba(240,237,234,0.5)"}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#F0EDEA" }}>Company</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((link, i) => (
                  <a key={i} href="#" style={{ 
                    color: "rgba(240,237,234,0.5)", 
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.color = "#4F8EF7"}
                  onMouseLeave={e => e.target.style.color = "rgba(240,237,234,0.5)"}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(240,237,234,0.35)",
            fontSize: "13px"
          }}>
            <span>© 2026 CareerPath. All rights reserved.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Made with <span style={{ color: "#EF4444" }}>❤</span> for job seekers worldwide
            </span>
          </div>
        </div>
      </footer>

      {/* Global Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
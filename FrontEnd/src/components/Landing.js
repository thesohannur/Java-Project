import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import logo from '../logo.png';

const Landing = ({ onShowAuth }) => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "রহিম উদ্দিন",
      location: "ঢাকা, বাংলাদেশ",
      role: "ব্যবসায়ী",
      text: "শহায় প্ল্যাটফর্মের মাধ্যমে আমি সহজেই বিভিন্ন এনজিওতে দান করতে পারি। সম্পূর্ণ স্বচ্ছতা এবং রিয়েল-টাইম ট্র্যাকিং সুবিধা অসাধারণ!",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "ফাতেমা খাতুন",
      location: "চট্টগ্রাম, বাংলাদেশ",
      role: "শিক্ষিকা",
      text: "আমাদের স্কুলের জন্য বই এবং শিক্ষা উপকরণ সংগ্রহে শহায় অনেক সাহায্য করেছে। দাতারা সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন।",
      rating: 5,
      avatar: "👩‍🏫"
    },
    {
      name: "আব্দুল করিম",
      location: "সিলেট, বাংলাদেশ",
      role: "এনজিও কর্মী",
      text: "বন্যার সময় জরুরি সাহায্য সংগ্রহে শহায় প্ল্যাটফর্ম অবিশ্বাস্য কাজ করেছে। মাত্র কয়েক ঘন্টায় হাজার হাজার মানুষের কাছে পৌঁছেছি।",
      rating: 5,
      avatar: "👨‍⚕️"
    },
    {
      name: "নাসরিন আক্তার",
      location: "রাজশাহী, বাংলাদেশ",
      role: "গৃহিণী",
      text: "ছোট ছোট দানও করতে পারি, বড় প্রভাব দেখতে পাই। আমার ১০০ টাকা দানও কোথায় কিভাবে ব্যবহার হচ্ছে তা জানতে পারি।",
      rating: 5,
      avatar: "👩‍🦱"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLogin = () => navigate('/auth');
  const handleRegisterNGO = () => navigate('/register-ngo');
  const handleGetStarted = () => navigate('/auth');

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src={logo} alt="Shohay Logo" className="logo-img" />
            <span className="logo-text">Shohay</span>
            <span className="logo-heart">❤️</span>
          </div>
          <nav className="nav-links">
            <a href="#about" className="nav-link">About</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button className="login-nav-btn" onClick={handleLogin}>Login</button>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="badge-text">🎓 IUT CSE 4402 Project</span>
              </div>
              <h1 className="hero-title">
                <span className="title-line">Grow giving—</span>
                <span className="title-line">without growing</span>
                <span className="title-line highlight">your workload.</span>
              </h1>
              <p className="hero-description">
                Shohay is Bangladesh's first centralized donation platform that streamlines 
                money, goods, and time donations with complete transparency and real-time tracking.
              </p>
              <div className="hero-buttons">
                <button className="cta-primary" onClick={handleGetStarted}>
                  <span>Start Donating</span>
                  <span className="btn-arrow">→</span>
                </button>
                <button className="cta-secondary" onClick={handleRegisterNGO}>
                  <span>Register NGO</span>
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">NGOs Connected</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Donors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">৳2M+</div>
                  <div className="stat-label">Funds Raised</div>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-visual">
                <div className="donation-dashboard">
                  <div className="dashboard-header">
                    <div className="header-info">
                      <h3>🌟 Emergency Relief Fund</h3>
                      <span className="verified">✅ Verified NGO</span>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '78%'}}></div>
                    </div>
                    <div className="progress-info">
                      <span>৳78,000 raised of ৳100,000</span>
                      <span>78% Complete</span>
                    </div>
                  </div>
                  <div className="donors-section">
                    <div className="donor-avatars">
                      <div className="avatar">👨</div>
                      <div className="avatar">👩</div>
                      <div className="avatar">👴</div>
                      <div className="avatar">👵</div>
                      <div className="avatar-count">+1.2K</div>
                    </div>
                    <span className="donors-text">1,234 generous donors</span>
                  </div>
                  <button className="donate-now-btn">
                    Donate Now
                  </button>
                </div>
                <div className="floating-elements">
                  <div className="floating-icon icon-1">💝</div>
                  <div className="floating-icon icon-2">🤝</div>
                  <div className="floating-icon icon-3">🌟</div>
                  <div className="floating-icon icon-4">❤️</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`about-section ${isVisible.about ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">About Shohay</span>
            <h2>Centralized Donation Platform</h2>
            <p>A revolutionary Java-based project by Team LumineX</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <div className="project-info">
                <h3>📘 Project Overview</h3>
                <p>
                  Shohay addresses the fragmentation and lack of transparency in current donation efforts. 
                  Our platform streamlines the process of donating money, goods, and time, offering a 
                  unified, auditable system for donors, NGOs, and recipients.
                </p>
              </div>
              <div className="objectives">
                <h3>🎯 Key Objectives</h3>
                <ul>
                  <li>Centralize all forms of donation (money, goods, time)</li>
                  <li>Offer transparency with real-time tracking and reporting</li>
                  <li>Simplify the donation process for users and NGOs</li>
                  <li>Support emergency and disaster relief coordination</li>
                </ul>
              </div>
            </div>
            <div className="about-visual">
              <div className="tech-stack">
                <h4>Built with Modern Technology</h4>
                <div className="tech-icons">
                  <div className="tech-item">
                    <span className="tech-icon">☕</span>
                    <span>Java</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🌱</span>
                    <span>Spring Boot</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">⚛️</span>
                    <span>React</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🍃</span>
                    <span>MongoDB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`features-section ${isVisible.features ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Key Features</span>
            <h2>🌟 What Makes Shohay Special</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Transparent Tracking</h3>
              <p>Real-time fund and goods tracking with complete audit trails</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Recurring Donations</h3>
              <p>Set up automatic monthly donations to your favorite causes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🙋‍♂️</div>
              <h3>Volunteer Management</h3>
              <p>Apply and track volunteer opportunities across NGOs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>NGO Dashboard</h3>
              <p>Comprehensive tools for NGOs with auto-coordination features</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚨</div>
              <h3>Disaster Response</h3>
              <p>Quick mobilization for emergency and disaster relief efforts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Real-time Analytics</h3>
              <p>Live updates and confirmation notifications for all activities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`testimonials-section ${isVisible.testimonials ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Customer Reviews</span>
            <h2>What Bangladeshi Users Say</h2>
            <p>Real feedback from our community members</p>
          </div>
          <div className="testimonials-container">
            <div className="testimonial-card active">
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="author-info">
                    <h4>{testimonials[currentTestimonial].name}</h4>
                    <p>{testimonials[currentTestimonial].role}</p>
                    <span className="location">📍 {testimonials[currentTestimonial].location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of Bangladeshi donors and NGOs creating positive change</p>
            <div className="cta-buttons">
              <button className="cta-primary" onClick={handleGetStarted}>
                Start Your Journey
              </button>
              <button className="cta-secondary" onClick={handleRegisterNGO}>
                Register Your NGO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-logo">
                <img src={logo} alt="Shohay Logo" className="footer-logo-img" />
                <span>Shohay ❤️</span>
              </div>
              <p>Connecting hearts, changing lives across Bangladesh</p>
              <div className="team-credit">
                <p>Developed by <strong>Team LumineX</strong></p>
                <p>CSE 4402: Visual Programming Lab, IUT</p>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Platform</h4>
                <ul>
                  <li><a href="#donors">For Donors</a></li>
                  <li><a href="#ngos">For NGOs</a></li>
                  <li><a href="#volunteers">For Volunteers</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <ul>
                  <li><a href="#help">Help Center</a></li>
                  <li><a href="#contact">Contact Us</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Shohay by Team LumineX. All rights reserved.</p>
            <div className="social-links">
              <a href="#facebook">📘</a>
              <a href="#twitter">🐦</a>
              <a href="#linkedin">💼</a>
              <a href="#github">🐙</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

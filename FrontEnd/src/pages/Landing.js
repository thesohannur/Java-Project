import React from 'react';
import { Link } from 'react-router-dom';

// Updated asset filenames
import campaign01 from '../assets/campaign01_floodReliefDistribution.png';
import campaign02 from '../assets/campaign02_freeMedicalCamp.png';
import donate01 from '../assets/donate01.png';
import donate02 from '../assets/donate02_malnutritionOfChildren.png';
import volunteer01 from '../assets/volunteer01_PlantingTrees.png';
import volunteer02 from '../assets/volunteer02_CleaningBeach.png';

const Landing = () => {
  const formatNumber = (num) => num.toLocaleString('en-US');

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Transform Communities with Shohay</h1>
            <p>
              Join Shohay's mission to connect generous hearts with meaningful causes.
              Donate money, volunteer your time, and empower NGOs to create lasting
              impact in communities worldwide.
            </p>

            <div className="hero-actions">
              <Link to="/auth" className="cta-btn primary">
                Start Making Impact
              </Link>
              <Link to="#features" className="cta-btn secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2>How Shohay Works</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Donate Money</h3>
              <p>Support vetted NGO campaigns with secure contributions and transparent impact.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⏰</div>
              <h3>Donate Time</h3>
              <p>Share skills with organizations that need them most on schedules that fit life.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏢</div>
              <h3>Empower NGOs</h3>
              <p>Manage campaigns, engage volunteers, and track results in one platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics (vertical layout + non‑clipping digits) */}
      <section className="impact-section">
        <div className="container">
          <div className="impact-stats">
            <div className="stat">
              <h3>{formatNumber(10000)}+</h3>
              <p>Lives Impacted</p>
            </div>
            <div className="stat">
              <h3>{formatNumber(500)}+</h3>
              <p>NGO Partners</p>
            </div>
            <div className="stat">
              <h3>${formatNumber(2000000)}+</h3>
              <p>Donated</p>
            </div>
            <div className="stat">
              <h3>{formatNumber(50000)}+</h3>
              <p>Volunteer Hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Gallery (uses new, context-rich filenames) */}
      <section className="impact-gallery">
        <div className="container">
          <div className="impact-gallery__header">
            <h2>Real Stories, Real Impact</h2>
            <p>
              From urgent relief to long‑term programs, Shohay connects support to outcomes communities can feel.
            </p>
          </div>

          <div className="gallery-grid">
            <figure className="gallery-card">
              <img
                src={campaign01}
                alt="Flood relief distribution providing food and essentials to affected families."
                loading="lazy"
                width="960"
                height="640"
              />
              <figcaption className="gallery-card__caption">
                <span className="chip">Campaign</span>
                <h3>Flood Relief Distribution</h3>
                <p>Emergency supplies delivered within 48 hours of flooding.</p>
              </figcaption>
              <div className="gallery-card__scrim" />
            </figure>

            <figure className="gallery-card">
              <img
                src={donate01}
                alt="Donors collaborating to fund urgent community needs."
                loading="lazy"
                width="960"
                height="640"
              />
              <figcaption className="gallery-card__caption">
                <span className="chip">Donation</span>
                <h3>Donors in Action</h3>
                <p>Collective giving accelerates emergency response.</p>
              </figcaption>
              <div className="gallery-card__scrim" />
            </figure>

            <figure className="gallery-card">
              <img
                src={volunteer01}
                alt="Volunteers planting trees to restore local ecosystems."
                loading="lazy"
                width="960"
                height="640"
              />
              <figcaption className="gallery-card__caption">
                <span className="chip">Volunteering</span>
                <h3>Planting Trees</h3>
                <p>Community reforestation improves air quality and resilience.</p>
              </figcaption>
              <div className="gallery-card__scrim" />
            </figure>

            <figure className="gallery-card">
              <img
                src={campaign02}
                alt="Free medical camp offering checkups and medicine to underserved people."
                loading="lazy"
                width="960"
                height="640"
              />
              <figcaption className="gallery-card__caption">
                <span className="chip">Campaign</span>
                <h3>Free Medical Camp</h3>
                <p>Thousands receive essential healthcare and medicines.</p>
              </figcaption>
              <div className="gallery-card__scrim" />
            </figure>

            <figure className="gallery-card">
              <img
                src={donate02}
                alt="Nutrition program addressing child malnutrition."
                loading="lazy"
                width="960"
                height="640"
              />
              <figcaption className="gallery-card__caption">
                <span className="chip">Donation</span>
                <h3>Child Nutrition Support</h3>
                <p>Meal plans and supplements reduce malnutrition in children.</p>
              </figcaption>
              <div className="gallery-card__scrim" />
            </figure>

            <figure className="gallery-card">
              <img
                src={volunteer02}
                alt="Volunteers cleaning plastic and debris from a public beach."
                loading="lazy"
                width="1280"
                height="550"
              />
              <figcaption className="gallery-card__caption">
                <span className="chip">Volunteering</span>
                <h3>Cleaning the Beach</h3>
                <p>Coastal cleanup days protect marine life and tourism.</p>
              </figcaption>
              <div className="gallery-card__scrim" />
            </figure>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of changemakers already creating impact with Shohay.</p>
          <Link to="/auth" className="cta-btn primary large">Join Shohay Today</Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;

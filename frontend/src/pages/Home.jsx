import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";

const Home = () => {
  const [storageUnits, setStorageUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStorageUnits();
  }, []);

  const fetchStorageUnits = async () => {
    try {
      const { data } = await axiosInstance.get("/storage-units");
      setStorageUnits(data || []);
    } catch (error) {
      console.error("Failed to fetch storage units", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const featuredUnits = useMemo(() => {
    return storageUnits.slice(0, 4);
  }, [storageUnits]);

 const getUnitImage = (unit) => {
  const fallback = "/placeholder.png"; // local image (put in public/)

  if (!unit?.photos || unit.photos.length === 0) {
    return fallback;
  }

  const firstPhoto = unit.photos[0];

  if (!firstPhoto) return fallback;

  // already full URL
  if (firstPhoto.startsWith("http")) {
    return firstPhoto;
  }

  // build full URL from backend
  const backendBase = process.env.REACT_APP_API_BASE_URL.replace("/api", "");
  return `${backendBase}${firstPhoto}`;
};

  return (
    <div className="home-page">
      <Navbar />

      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>One step closer to your perfect storage space.</h1>
            <p>
              Secure, flexible, and affordable storage units for personal and
              business needs.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <select className="hero-search__select" defaultValue="all">
                <option value="all">All Units</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>

              <input
                type="text"
                placeholder="Enter city or size"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hero-search__input"
              />

              <button type="submit" className="hero-search__button">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Storage Units</h2>
          </div>

          <div className="featured-grid">
            {featuredUnits.length > 0 ? (
              featuredUnits.map((unit) => (
                <div
                  className="unit-card"
                  key={unit._id}
                  onClick={() => navigate(`/storage-units/${unit._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="unit-card__image-wrap">
                    <img
                      src={getUnitImage(unit)}
                      alt={unit.name || "Storage unit"}
                      className="unit-card__image"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x240?text=Storage+Unit";
                      }}
                    />
                  
                  </div>

                  <div className="unit-card__body">
                    <h3>{unit.name || `${unit.size || "Storage"} Unit`}</h3>
                    <p className="unit-card__price">
                      ${unit.price || unit.monthlyPrice || 0}/month
                    </p>
                    <p className="unit-card__meta">
                      {unit.size || "Flexible size"} |{" "}
                      {unit.location || "Location not set"}
                    </p>
                    <p className="unit-card__desc">
                      {unit.description
                        ? unit.description.slice(0, 90)
                        : "Secure storage with flexible booking and convenient access."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No storage units available right now.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="service-section">
        <div className="section-container service-grid">
          <div className="service-card">
            <div className="service-icon">📦</div>
            <h3>Find a Unit</h3>
            <p>
              Explore available storage units by size, price, and location to
              find the right fit quickly.
            </p>
            <button onClick={() => navigate("/search")}>Browse units</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🔒</div>
            <h3>Secure Storage</h3>
            <p>
              Store your items confidently with safe, reliable, and accessible
              storage space.
            </p>
            <button onClick={() => navigate("/register")}>Get started</button>
          </div>

          <div className="service-card">
            <div className="service-icon">📅</div>
            <h3>Flexible Booking</h3>
            <p>
              Book short-term or long-term storage based on your personal or
              business requirements.
            </p>
            <button onClick={() => navigate("/login")}>Reserve now</button>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="section-container">
          <div className="section-header section-header--left">
            <h2>Our customer feedback</h2>
            <p>Don’t take our word for it. Trust our customers.</p>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>
                MR. Bunker made it easy to find a storage unit near me. The
                booking process was smooth and quick.
              </p>
              <h4>Floyd Miles</h4>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>
                I needed temporary business storage and found a unit within
                minutes. Clean UI and straightforward booking.
              </p>
              <h4>Sarah Johnson</h4>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>
                The system is simple and helpful. I could compare unit options
                and choose what worked best for my budget.
              </p>
              <h4>Michael Brown</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-box">
            <div className="cta-box__content">
              <span>No Spam Promise</span>
              <h2>Need business storage?</h2>
              <p>
                Get updates on available storage units, pricing, and offers for
                personal and commercial needs.
              </p>

              <div className="cta-box__form">
                <input
                  type="text"
                  placeholder="Enter your email or phone number"
                />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
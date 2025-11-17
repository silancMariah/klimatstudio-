"use client";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../index.css";
import RotatingEarth from "../components/RotatingEarth";
import AnimatedTitle from "../components/AnimatedTitle";
import FlyingSatalite from "../components/FlyingSatallite";

export default function HomePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
          <img
            src="templates/Helloworld.png"
            alt="helloworld"
            className="nav-logo-img"
          />
        </div>
      </nav>

      {/* 🌍 FIX: PLANET WRAPPER (ligger ovanpå allt annat) */}
      <div className="planet-wrapper">
        <div className="planet">
          <RotatingEarth />
        </div>

        <div className="orbit-wrapper">
          <div className="orbit-satellite">
            <FlyingSatalite />
          </div>
        </div>
      </div>


      <div className="homepage-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        {/* --- ICON ROW --- */}
        <div className="icon-row">
          <button className="icon-wrapper" onClick={() => navigate("/portfolio")}>
            <img src="/portfolio.png" className="icon-img" alt="Portfolio" />
            <span>Info</span>
          </button>

          <button className="icon-wrapper" onClick={() => navigate("/pass0")}>
            <img src="/rcoket.png" className="icon-img" alt="Pass0" />
            <span>Starta</span>
          </button>

          <button
            className="icon-wrapper"
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSctqbx3XRx4ShQc_Gr_CGe0uHOwKCsNUA5ZtJBI_UhxjHTtrg/viewform",
                "_blank"
              )
            }
          >
            <img src="/writing.png" className="icon-img" alt="Utvärdering" />
            <span>Utvärdering</span>
          </button>
        </div>

        <h1 className={`main-title ${isVisible ? "fade-in" : "fade-start"}`}>
          Klimatstudio
        </h1>

        <AnimatedTitle />
      </div>
    </>
  );
}

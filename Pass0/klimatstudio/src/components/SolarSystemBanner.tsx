"use client";

import "./solarSystem.css";

export default function SolarSystemBanner() {
  return (
    <div className="solar-wrapper">
      <div className="solar-content">

        {/* Solen */}
        <img src="/assets/img/solsytem/1sol.png" className="planet sun" />

        {/* Merkurius */}
        <img src="/assets/img/solsytem/2mercury.png" className="planet mercury" />

        {/* Venus */}
        <img src="/assets/img/solsytem/3venus.png" className="planet venus" />

        {/* Jorden */}
        <img src="/assets/img/solsytem/4jorden.png" className="planet earth" />

        {/* Mars */}
        <img src="/assets/img/solsytem/5mars.png" className="planet mars" />

        {/* Jupiter */}
        <img src="/assets/img/solsytem/6jupiter.png" className="planet jupiter" />

        {/* Saturnus */}
        <img src="/assets/img/solsytem/7saturnus.png" className="planet saturn" />

        {/* Uranus */}
        <img src="/assets/img/solsytem/8uranus.png" className="planet uranus" />

        {/* Neptunus */}
        <img src="/assets/img/solsytem/9neptune.png" className="planet neptune" />

        {/* Hello World-loggan */}
        <img src="/assets/img/helloworld.png" className="hw-logo" />
      </div>
    </div>
  );
}

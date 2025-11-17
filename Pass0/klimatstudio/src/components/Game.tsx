// Game – litet klimatspel. Spelaren trycker på knappar som ändrar energi, CO2 och temperatur.
// Varje handling uppdaterar år + omräknad temperatur. Jorden ändrar utseende efter temp.

'use client';
import { useState } from 'react';
import '../index.css';

export default function Game() {
    const [energy, setEnergy] = useState(50);
    const [co2, setCO2] = useState(50);
    const [temperature, setTemperature] = useState(50);
    const [years, setYears] = useState(0);

    const updatePlanet = () => {
        setTemperature(14 + (co2 - 280) * 0.02); //vi kan ändra värderna med databas senare 
        setYears((y)=>y+1);
    };

    const buildFactory = () => {
        setEnergy((e) => e + 10);
        setCO2((c) => c + 5);
        updatePlanet();
    };

    const plantTrees = () => {
        setCO2((c) => Math.max(0, c - 5));
        setEnergy((e) => e-2);
        updatePlanet();
    };
    const buildSolarPanels = () => {
        setEnergy((e) => e + 5);
        setCO2((c) => c - 2);
        updatePlanet();
    };

    return (
        <div className="game-container">
            <h2>Rädda Jorden</h2>
            <p>År: {years}</p>
            <div className="stats">
                <p>Energi: {energy}</p>
                <p>CO2-nivå: {co2}</p>
                <p>Temperatur: {temperature.toFixed(2)}°C</p>
            </div>
            <img 
            src="/earth.png" 
            alt="Earth" 
            className={`earth-game ${temperature > 25 ? "hot" : temperature < 18 ? "cold" : "normal"}`}
            />
            <div className="actions">
                <button onClick={buildFactory}>Bygg fabrik (+10 energi, +5 CO2)</button>
                <button onClick={plantTrees}>Plantera träd (-5 CO2, -2 energi)</button>
                <button onClick={buildSolarPanels}>Bygg solpaneler (+5 energi, -2 CO2)</button>
            </div>
        
            </div>

    );



}

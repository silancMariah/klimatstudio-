import { ClimateSystem } from "./ClimateSystem";

interface Props {
  climate: ClimateSystem;
}

export default function UI({ climate }: Props) {
  return (
    <div style={{
      position: "absolute",
      top: 20,
      left: 20,
      color: "white",
      background: "rgba(0,0,0,0.5)",
      padding: "10px",
      borderRadius: "8px"
    }}>
      <h3>🌍 Klimatdata</h3>
      <p>CO₂: {climate.data.co2.toFixed(1)} ppm</p>
      <p>Temp: {climate.data.temp.toFixed(1)} °C</p>
      <p>Energi: {climate.data.energy.toFixed(1)}</p>
    </div>
  );
}

// ClimateSystem.ts
export interface ClimateData {
  co2: number;
  temp: number;
  energy: number;
}

export class ClimateSystem {
  data: ClimateData;
  
  constructor() {
    this.data = { co2: 400, temp: 15, energy: 100 };
  }

  tick() {
    // varje frame: världen förändras lite
    this.data.co2 += 0.02;
    this.data.temp += (this.data.co2 - 400) * 0.0005;
    this.data.energy -= 0.01;
  }

  applyAction(action: string) {
    if (action === "plantTrees") this.data.co2 -= 5;
    if (action === "buildSolar") this.data.energy += 10;
  }
}

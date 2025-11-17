# Klimatstudio 🌍

Ett lärorikt projekt där barn lär sig programmera i **Python** genom att skapa och utforska en digital modell av jorden!

# Samling av Cheatsheats: 
- [Turtle Cheatsheat](Pass1/info/Turtle_Cheetsheat.pdf)

---

## PASS 1: 

### Extrauppgifter 
Barnen kan testa att **skapa sitt eget Turtle-spel** 

[Öppna koden här](Pass1/jorden_turtle.py)

Barnen kan använda den här som **extrauppgift** om de vill utforska vidare och skapa ett mer **interaktivt Turtle-spel**.  

[Öppna Turtle Cheatsheet (PDF)](Pass1/info/Turtle_Cheetsheat.pdf)  
*Cheat sheeten hjälper barnen förstå hur Turtle fungerar och låter dem experimentera fritt med färger, rörelser och former!*

---

## Installation / Körning

1. **Krav**  
   - Node.js **20.19+** (Vite kräver minst den versionen).  
   - npm följer med Node.

2. **Installera beroenden**  
   ```bash
   git clone <repo-url>
   cd klimatstudio-/Pass0/klimatstudio
   npm install
   ```

3. **Kör lokalt**  
   ```bash
   npm run dev
   ```
   Öppna länken som Vite visar (typ `http://127.0.0.1:5173`).

4. **Bygg produktion / förhandsgranska**  
   ```bash
   npm run build
   npm run preview
   ```

5. **Tips**  
   - Pyodide-loggar under `npm run build` är förväntade (Vite externaliserar node-moduler).  
   - Inga andra globala verktyg behövs; allt installeras via `npm install`.

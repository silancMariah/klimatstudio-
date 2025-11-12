from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)


computer_poäng = 0
mina_poäng = 0

class satellit_ai:
    def svara(self, fråga):
        global computer_poäng, mina_poäng  # gör så vi kan uppdatera de globala variablerna
        fråga = fråga.lower()

        if "temperatur" in fråga:
            return "Temperaturen är 15 grader."
        elif "hej" in fråga:
            return "Hej, jag är jorden!"
        elif "co2" in fråga or "koldioxid" in fråga:
            return "Koldioxidhalten är 420 ppm."

        # --- Spelet sten, sax, påse ---
        if "sten" in fråga or "sax" in fråga or "påse" in fråga:
            val = random.choice(["sten", "sax", "påse"])

            # oavgjort
            if val in fråga:
                return f"Jag valde {val}, så ingen vann. Vi kör igen!"

            # AI vinner
            elif val == "sten" and "sax" in fråga:
                computer_poäng += 1
                return f"Jag valde {val}, jag vinner!"
            elif val == "sax" and "påse" in fråga:
                computer_poäng += 1
                return f"Jag valde {val}, jag vinner!"
            elif val == "påse" and "sten" in fråga:
                computer_poäng += 1
                return f"Jag valde {val}, jag vinner!"

            # Spelaren vinner
            else:
                mina_poäng += 1
                return f"Jag valde {val}, du vinner!"

        # --- Kolla poängen ---
        elif "poäng" in fråga:
            if computer_poäng > mina_poäng:
                return f"Jag leder med {computer_poäng} poäng mot dina {mina_poäng} poäng!"
            elif mina_poäng > computer_poäng:
                return f"Du leder med {mina_poäng} poäng mot mina {computer_poäng} poäng!"
            else:
                return f"Vi är lika, båda har {computer_poäng} poäng!"

        # --- Annars ---
        else:
            return "Jag förstår inte frågan."

ai = satellit_ai()

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    fråga = data.get("question", "")
    svar = ai.svara(fråga)
    return jsonify({"answer": svar})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

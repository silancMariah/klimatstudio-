from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class satellit_ai:
    def svara(self, fråga):
        fråga = fråga.lower()
        if "temperatur" in fråga:
            return "Temperaturen är 15 grader."
        elif "hej" in fråga:
            return "Hej, jag är jorden!"
        elif "co2" in fråga or "koldioxid" in fråga:
            return "Koldioxidhalten är 420 ppm."
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
    app.run(host='127.0.0.1', port=5000, debug=True)
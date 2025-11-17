from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import random

app = Flask(__name__)
CORS(app)


computer_poäng = 0
mina_poäng = 0


class satellit_ai:
    global computer_poäng, mina_poäng
# ----- Din AI ------
    def svara(self, fråga):
        fråga = fråga.lower()
        if "temperatur" in fråga:
            return "Temperaturen är 15 grader."
        
        
# -------------------
       

ai = satellit_ai()

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    fråga = data.get("question", "")
    svar = ai.svara(fråga)
    return jsonify({"answer": svar})

@app.route("/")
def index():
    return send_from_directory(".",'levande_jord.html')

@app.route("/public/<path:filename>")
def public_files(filename):
    return send_from_directory("public", filename)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

class Jorden:
    def __init__(self):
        self.temperatur = 15
        self.co2 = 420
        self.ålder = 4_500_000_000
        self.form = "sfär"
        self.solenergi = 1361

    def update(self):
        if self.co2 > 400:
            self.temperatur += 0.02
            print("Temperaturen stiger 🌡️")
        else:
            self.temperatur -= 0.01
            print("Temperaturen sjunker ❄️")

jorden = Jorden()
jorden.co2 = 380
jorden.update()

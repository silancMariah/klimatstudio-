# -*- coding: utf-8 -*-
import turtle 
from jorden import Jorden

data = Jorden()

screen = turtle.Screen()
screen.setup(width=800, height=600)
screen.title("Min Jord")

earth = turtle.Turtle() 
earth.shape("circle") #Enkel cirkel
earth.turtlesize(10) #jordens storlek
earth.color("blue")


def update_color(temp):
    if temp > 20:
        earth.color("red") 
    elif temp < 10:
        earth.color("skyblue","skyblue")
    else:
        earth.color("green")
        
update_color(data.temperatur)
print(f"Temperatur: {data.temperatur}°C, CO₂: {data.co2}")

def spin():
    earth.right(5)
    screen.ontimer(spin, 100)

spin()

turtle.done()


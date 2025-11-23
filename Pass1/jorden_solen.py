# -*- coding: utf-8 -*-
import time
import turtle 


screen = turtle.Screen()
screen.setup(width=800, height=600)
screen.title("Min Jord")
screen.bgcolor("black")

earth = turtle.Turtle() 
earth.shape("circle") 
earth.turtlesize(10) 
earth.color("blue")

# ------ Rita solen här: 
sun = turtle.Turtle()


# ----------------------


# ------ Skriv en text här:
text = turtle.Turtle()

# ------------------------- 

# ---------- Jordens funnktioner:

def update_color(temp):
     if temp > 20:
        earth.color("red") 
        # ----- text -----#
     elif temp < 10:
        earth.color("lightblue")
        # ----- text -----#
     else:
        earth.color("green")
        # ----- text -----#
# ------------------------------- 

        
update_color(21)




turtle.done()



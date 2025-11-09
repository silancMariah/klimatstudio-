from PIL import Image
import turtle
from pixlar import pixels

width = 960
height = 980


screen = turtle.Screen()
screen.bgcolor("lightblue")  
circle = turtle.Turtle()

scale = 0.5 

circle.penup()
circle.speed("fastest")
circle.hideturtle()
circle.color("green")
circle.begin_fill()
circle.goto(3, -height * scale / 2)
circle.pendown()
circle.circle(height * scale / 2)
circle.end_fill()

kontinent = turtle.Turtle()
screen.tracer(0)

# ------ Rita kontinenterna här: ------ #
# Använd pixlar-listan från pixlar.py



# ------------------------------------- #
screen.update()
turtle.done()
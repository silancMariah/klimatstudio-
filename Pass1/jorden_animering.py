import turtle
import time

screen = turtle.Screen()
earth = turtle.Turtle()
earth.shape("circle")
earth.turtlesize(10)
earth.color("#00aaff")  # kall, blå jord

co2 = 0

while co2 <= 10:
    co2 += 1
    red = min(255, co2 * 25)
    blue = max(0, 255 - co2 * 25)
    color = f"#{red:02x}80{blue:02x}"
    earth.color(color)

    # kort paus så man ser ändringen
    time.sleep(0.3)

# text när loopen är klar
earth.penup()
earth.color("black")


text = turtle.Turtle()
text.penup()
text.hideturtle()
text.goto(-130, 200)
text.write("Nu är koldioxidhalten hög!", font=("Arial", 16, "bold"))
text.pendown()
turtle.done()
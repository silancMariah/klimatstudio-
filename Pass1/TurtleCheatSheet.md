
# 🐢 Turtle Cheat Sheet

En snabbguide till Python-biblioteket **Turtle**, där du ritar med kod!

---

## 🧩 Starta
```python
import turtle
```

Skapar ett nytt ritfönster med en “sköldpadda” som kan rita på skärmen.

---

## ✨ Skapa en sköldpadda

```python
t = turtle.Turtle()
```

Du kan döpa den till vad du vill, t.ex. `jord`, `penna`, `artist` osv.

---

## 🚶‍♂️ Rörelse

```python
t.forward(100)   # framåt 100 steg
t.backward(50)   # bakåt 50 steg
t.right(90)      # sväng höger 90 grader
t.left(45)       # sväng vänster 45 grader
t.goto(0, 0)     # gå till position (x, y)
```

---

## 🎨 Färg och form

```python
t.color("blue")      # ändrar ritfärg
t.pensize(5)         # tjocklek på linjen
t.shape("turtle")    # form: "arrow", "circle", "square", "turtle"
t.fillcolor("green") # fyllfärg (för cirklar, kvadrater m.m.)
```

---

## 🖌️ Rita former

```python
t.circle(50)         # ritar en cirkel med radie 50
t.begin_fill()       # startar fyllning
t.end_fill()         # avslutar fyllning
```

---

## ⏸️ Penna upp / ner

```python
t.penup()    # lyfter pennan (ritar inte)
t.pendown()  # sänker pennan (ritar igen)
```

---

## ⚡ Hastighet

```python
t.speed(10)  # 1 = långsam, 10 = snabb, 0 = maxspeed!
```

---

## 🖼️ Bakgrund & fönster

```python
turtle.bgcolor("black")   # ändrar bakgrundsfärg
screen = turtle.Screen()  # skapar fönster
screen.title("Min Jord")  # titel på fönstret
```

---

## 🔁 Loopar (upprepa rörelser)

```python
for i in range(36):
    t.forward(100)
    t.right(10)
```

---

## 💫 Bonus: Få jorden att snurra

```python
while True:
    t.right(5)
```

---

## 💡 Avsluta

```python
turtle.done()  # håller fönstret öppet
```

---

🧠 **Tips:**

* Testa att kombinera `begin_fill()` och `color()` för att skapa egna figurer!
* Du kan göra animationer genom att lägga rörelser i `for`-loopar eller `while True`-loopar.

```

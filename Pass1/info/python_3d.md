# VPython Cheat Sheet
En snabbguide för att skapa 3D-grafik i **Python** med VPython.

## Starta
```python
from vpython import *
```

Importerar alla viktiga funktioner för att rita 3d-objekt.

## Skapa objekt

```python
sphere(radius=1)               # En sfär (t.ex. jorden)
box(length=1, height=1, width=1)  # En låda
cylinder(radius=0.1, length=2)    # En cylinder
cone(radius=0.2, length=1)        # En kon
```

## Färg och textur

```python
color=color.blue                   # färg
sphere(color=color.green)          # färgad sfär
sphere(texture="earth.jpg")        # textur från bild
sphere(texture="https://i.imgur.com/yoEzbtg.jpg")  # online-textur
```

## Ljussättning och bakgrund

```python
scene.background = color.black     # bakgrundsfärg
local_light(pos=vector(0,0,0), color=color.white)  # ljuskälla
distant_light(direction=vector(1,1,1), color=color.gray(0.8))
```

## Materialegenskaper

```python
shininess=0.5      # glansighet
emissive=False     # avger ljus (True för t.ex. solen)
opacity=0.8        # genomskinlighet
```


## Rörelse och animation

```python
while True:
    rate(60)                          # hastighet (fps)
    earth.rotate(angle=0.01, axis=vector(0,1,0))  # rotera runt Y-axeln
```


## Vektorer

```python
vector(1, 0, 0)      # x-axel
vector(0, 1, 0)      # y-axel
vector(0, 0, 1)      # z-axel
```

Används för position, riktning och rörelse.


## Placering

```python
sphere(pos=vector(2,0,0))   # flyttar objektet
box(pos=vector(-1,1,0))
```

## Kamerakontroll

```python
scene.forward = vector(-1,-1,-1)   # kameravinkel
scene.range = 3                    # zoomnivå
```


## Avslutning

VPython skapar automatiskt ett 3D-fönster i webbläsaren.
Stäng bara fliken när du är klar!
 
**Tips:**

* Använd `rate()` för att kontrollera hur snabbt animationen körs.
* VPython visar allt i realtid – varje rad kod uppdaterar scenen direkt.
* Du kan kombinera flera objekt (t.ex. jorden + solen + månen) för att skapa en hel liten galax! 

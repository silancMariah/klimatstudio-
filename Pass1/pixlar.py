from PIL import Image

# Öppna bilden
img = Image.open("/Users/silancetinkaya/klimatstudio-/Pass1/pngwing.com.png")   # byt till din fil
img = img.convert("RGB")        # se till att det är i färgformat
width, height = img.size

pixels = []  # lista för (x, y, färg)

for y in range(height):
    for x in range(width):
        pixel = img.getpixel((x, y))
        if len(pixel) == 4:
            r, g, b, a = pixel
        else: 
            r, g, b = pixel
            a = 255  # låtsas att den inte är transparent

        # Hitta mörka områden (svarta kontinenter)
        brightness = (r + g + b) / 3
        if brightness < 50 and a > 0:  # mörka + inte transparenta
            pixels.append((x, y))

print(f"Antal mörka pixlar: {len(pixels)}")
print("Exempelkoordinater:", pixels[:10])
print("Storlek:", img.height, img.width)
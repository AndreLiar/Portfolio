from PIL import Image
import os

SRC = "public/images/andre-kanmegne.jpg"
img = Image.open(SRC).convert("RGB")
W, H = img.size  # 640 x 959
print("source:", W, H)

# Square crop centered on the face (portrait: head in the upper third).
# center ~ (320, 295); side 440 -> keeps head+beard+a little shoulder.
cx, cy, side = 320, 295, 440
left   = max(0, cx - side // 2)
upper  = max(0, cy - side // 2)
right  = min(W, left + side)
lower  = min(H, upper + side)
face = img.crop((left, upper, right, lower))
print("crop box:", (left, upper, right, lower), "->", face.size)

# High-quality square master
master = face.resize((512, 512), Image.LANCZOS)

# 1) legacy multi-size favicon.ico (16/32/48)
ico = master.resize((256, 256), Image.LANCZOS)
ico.save("public/favicon.ico", format="ICO", sizes=[(16,16),(32,32),(48,48)])

# 2) modern app icons (Next.js app/ conventions inject <link> tags)
master.resize((192,192), Image.LANCZOS).save("src/app/icon.png",       format="PNG")
master.resize((180,180), Image.LANCZOS).save("src/app/apple-icon.png", format="PNG")

# 3) PWA manifest icons in /public
master.resize((192,192), Image.LANCZOS).save("public/icon-192.png", format="PNG")
master.save("public/icon-512.png", format="PNG")  # 512

for p in ["public/favicon.ico","src/app/icon.png","src/app/apple-icon.png","public/icon-192.png","public/icon-512.png"]:
    print(f"  wrote {p} ({os.path.getsize(p)} bytes)")

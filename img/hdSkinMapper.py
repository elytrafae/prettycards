
import os
import glob
import json
import PIL
from PIL import Image

normalSize = 640, 340
fullSize = 640, 920
breakingSize = 704, 984

print(normalSize)
print(fullSize)
print(breakingSize)

data = []
for file in glob.glob("HDCardSkins/*.png"):
	fileName = file[12:-4:1]
	data.append(fileName)
	'''
	img = PIL.Image.open(file)
	wid, hgt = img.size
	aspect_ratio = wid/hgt
	img2 = img.resize(breakingSize, Image.Resampling.LANCZOS)
	if (aspect_ratio == 16/9):
		img2 = img.resize(normalSize, Image.Resampling.LANCZOS)
	elif (aspect_ratio == 16/23):
		img2 = img.resize(fullSize, Image.Resampling.LANCZOS)
		
	img2.save("HDCardSkins_Mid/" + fileName + ".png", "PNG")
	print("Processed " + fileName)
	'''

stringData = json.dumps(data)
print(stringData)
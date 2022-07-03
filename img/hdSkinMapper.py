
import os
import glob
import json

data = []
for file in glob.glob("HDCardSkins/*.png"):
	fileName = file[12:-4:1]
	data.append(fileName)

stringData = json.dumps(data)
print(stringData)
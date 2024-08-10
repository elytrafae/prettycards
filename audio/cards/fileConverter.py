
import os
import glob
import json

JSON_PATH = "../../json/baseThemeSongData.json"

data = {}
if os.path.isfile(JSON_PATH):
	print("Existing file found!")
	f = open(JSON_PATH, "r")
	data = json.loads(f.read())
	f.close()

for file in glob.glob("input/*.ogg"):
    # print(file)
    number = file[-5:-4:1]
    folderName = file[6:-5:1]
    if (not number.isdigit()):
        number = "1"
        folderName = file[6:-4:1]

    cardName = folderName.replace("_", " ")
    if (not os.path.isdir(folderName)):
        os.mkdir(folderName)
    fin = open(file, "rb")
    fout = open(folderName + "/intro_" + number + ".ogg", "wb")
    for line in fin:
        fout.write(line)

    if (cardName in data):
        data[cardName] = max(data[cardName], int(number))
    else:
        data[cardName] = int(number)

stringData = json.dumps(data, indent=4)
print(stringData)

f = open(JSON_PATH, "w")
f.write(stringData)
f.close()

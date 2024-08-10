
import os
import glob
import json

data = {}
for file in glob.glob("input/*.ogg"):
    # print(file)
    folderName = file[6:-5:1]
    number = file[-5:-4:1]
    if (not os.path.isdir(folderName)):
        os.mkdir(folderName)
    fin = open(file, "rb")
    fout = open(folderName + "/intro_" + number + ".ogg", "wb")
    for line in fin:
        fout.write(line)

    if (folderName in data):
        data[folderName] = max(data[folderName], int(number))
    else:
        data[folderName] = int(number)

stringData = json.dumps(data)
print(stringData)
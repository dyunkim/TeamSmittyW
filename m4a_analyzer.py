import os

min_len = 10000000
for file in os.listdir("Songs"):
  if file != ".DS_Store":
    f = open('Songs/'+file, 'rb')
    cleaned_up = str(f.read()).split("mdat!",1)[1]

    if min_len > len(cleaned_up):
      min_len =  len(cleaned_up)

    print(file+ " : "+str(len(cleaned_up)))

print("Min Length: "+str(min_len))
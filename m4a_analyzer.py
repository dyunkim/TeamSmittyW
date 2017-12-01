import os

min_len = 10000000
for file in os.listdir("Songs"):
  if file != ".DS_Store":
    f = open('Songs/'+file, 'rb')
    cleaned_up = str(f.read()).split("mdat!",1)[1]
    cleaned_up = (cleaned_up[:2658998]) if len(cleaned_up) > 2658998 else cleaned_up
    print(len(cleaned_up))

    if min_len > len(cleaned_up):
      min_len =  len(cleaned_up)

    print(file+ " : "+str(len(cleaned_up)))

print("Min Length: "+str(min_len))
import billboard_miner as b_m
from urllib import request as u_r
import time
import json
import sys

def download_demos():
  songs_2016 = b_m.miner("https://www.billboard.com/charts/year-end/2016/hot-rap-songs")
  songs_2015 = b_m.miner("https://www.billboard.com/charts/year-end/2015/hot-rap-songs")
  apple_api = "https://itunes.apple.com/search?entity=song&term="

  for song_item in songs_2016:
    #print(song_item['rank']+" "+song_item['song']+" "+song_item['artist'])

    if int(song_item['rank']) < 10:
      song_item['rank'] = "0"+str(song_item['rank'])

    if "Featuring" in song_item["artist"]:
      search_string = apple_api+song_item['song'].replace(".", "")+"+"+song_item["artist"][:song_item["artist"].index("Featuring")-1].replace(".", "")
      save_location = "Songs/"+str(song_item['rank'])+"-"+song_item['song'].replace(" ", "_")+"-"+song_item["artist"][:song_item["artist"].index("Featuring")-1].replace(".", "").replace(" ", "_")+".m4a"
    else:
      search_string = apple_api+song_item['song'].replace(".", "")+"+"+song_item["artist"].replace(".", "")
      save_location = "Songs/"+str(song_item['rank'])+"-"+song_item['song'].replace(" ", "_")+"-"+song_item["artist"].replace(".", "").replace(" ", "_")+".m4a"

    search_string = search_string
    search_string = search_string.replace(" ", "+")
    #print(search_string)

    with u_r.urlopen(search_string) as f:
      json_output = f.read()

    #print(xml_output)

    dict_output = json.loads(json_output)
    #print(dict_output['results'][0]['previewUrl'])

    m4a_file = u_r.urlopen(dict_output['results'][0]['previewUrl'])

    print(save_location)
    
    with open(save_location, "wb") as output:
      output.write(m4a_file.read())

    time.sleep(5)

if __name__ == "__main__":
  download_demos()
  #pass
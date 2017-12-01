import requests
import billboard_miner
import csv
import pprint
import sys
api_token = "Bearer BQCVOFlNiskV4dMeEgdeP0Sv3BObf4vdcy2bOlH71Tj3_pGGqS6wGcoIjbg0SsCBBHBPBQ0-5DEOr1SaH-VRoYOTW9N__CofEiZ-Zz4ed_hWbPDNqikm_6L18hE8uX6z-VhcTXBfbizHrnYZUg0"

def getSongData(song_dict):
    base_url = "https://api.spotify.com/v1/audio-features/"
    headers = {"Authorization": api_token}

    search_url = base_url+song_dict["id"]

    r = requests.get(search_url, headers=headers)

    if r.status_code != requests.codes.ok:
            print("Failed to Download Track: %s - %s" % (x["song"], artist))
            print("Failed with Error Code: %d" % r.status_code)
    else:
        #pprint.pprint(r.json())

        song_dict = {**song_dict, **r.json()}
        return song_dict

def getSongPops(song_list):
    base_url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": api_token}

    popularity_list = []
    for x in song_list:
        song_name = x["song"]
        if "Featuring" in x["artist"]:
            artist = x["artist"][:x["artist"].index("Featuring")-1]
        else:
            artist = x["artist"]
        query_string = "%s %s" % (artist, song_name)
        query = {"q": query_string, "type": "track", "limit": 1}
        r = requests.get(base_url, params=query, headers=headers)
        if r.status_code != requests.codes.ok:
            print("Failed to Download Track: %s - %s" % (x["song"], artist))
            print("Failed with Error Code: %d" % r.status_code)
        else:
            song_dict = {}
            if len(r.json()["tracks"]["items"]) < 1:
                print("Can't find song: %s" % x["song"])
                print("Query: %s" % r.url)
            else:
                json = r.json()["tracks"]["items"][0]
                #pprint.pprint(json)
                song_dict["popularity"] = json["popularity"]
                song_dict["song_name"] = json["name"]
                song_dict["id"] = json["id"]
                artist_list = []
                for x in json["artists"]:
                    artist_list.append(x["name"])
                song_dict["artists"] = artist_list
                song_dict = getSongData(song_dict)
                #pprint.pprint(song_dict)
                popularity_list.append(song_dict)
    return popularity_list

def dictToCSV(dictionaryList):
    with open('data2.csv', 'a') as file:
        fieldnames = ['song_name', 'artists', 'popularity', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'type', 'id', 'uri', 'track_href', 'analysis_url', 'duration_ms', 'time_signature']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for i in dictionaryList:
            writer.writerow(i)

songs = billboard_miner.miner("https://www.billboard.com/charts/year-end/2013/hot-rap-songs")
# print(songs)

temp = [{"artist": "drake", "song_name": "hotline bling"}]
pop_list = getSongPops(songs)
# for x in pop_list:
#     print(x)
dictToCSV(pop_list)
print("done")

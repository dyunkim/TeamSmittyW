import requests
import billboard_miner
import csv
api_token = "Bearer BQC6l3ecHCsux24jeiPPf-AzDjFB0uDrXI0nZtBc1g4KEE7S03nwVahI-mBn9bqlgKIiw6xbusMfwXP2SKw3zWYzROsG1iqyLVZAIg-afDc1ApzUBtgWo5jscBATHc1xPYXHfF3MF3aVjEx6684"

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
                song_dict["popularity"] = json["popularity"]
                song_dict["song_name"] = json["name"]
                artist_list = []
                for x in json["artists"]:
                    artist_list.append(x["name"])
                song_dict["artists"] = artist_list
                popularity_list.append(song_dict)
    return popularity_list

def dictToCSV(dictionaryList):
    with open('data2.csv', 'w') as file:
        fieldnames = ['song_name', 'artists', 'popularity']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for i in dictionaryList:
            writer.writerow(i)

songs = billboard_miner.miner("https://www.billboard.com/charts/year-end/2016/hot-rap-songs")
# print(songs)

temp = [{"artist": "drake", "song_name": "hotline bling"}]
pop_list = getSongPops(songs)
for x in pop_list:
    print(x)
dictToCSV(pop_list)
print("done")

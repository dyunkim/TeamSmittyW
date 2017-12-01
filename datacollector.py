import requests
import billboard_miner
api_token = "Bearer BQB7Ojx2hlfuMpAJkVExFA5hdcfv1MR1k_jp7qUE_Np142Y40k-j-Ed8Cs7eeNKIp0bU0t7BzoxrqSYsoYNGqtVXE06bgW2VjHyEy5VGvKk6pN1n5kN8wzgRb7zoSLJuo3gOHn-rALAMayM-vPg"

def getSongPops(song_list):
    base_url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": api_token}

    popularity_list = []
    for x in song_list:
        song_name = x["song_name"].replace(" ", "+")
        query_string = "%s %s" % (x["artist"], song_name)
        query = {"q": query_string, "type": "track", "limit": 1}
        r = requests.get(base_url, params=query, headers=headers)
        if r.status_code != requests.codes.ok:
            print("Failed to Download Track: %s" % x["song_name"])
            print("Failed with Error Code: %d" % r.status_code)
        else:
            song_dict = {}
            json = r.json()["tracks"]["items"][0]
            song_dict["popularity"] = json["popularity"]
            song_dict["song_name"] = json["name"]
            artist_list = []
            for x in json["artists"]:
                artist_list.append(x["name"])
            song_dict["artists"] = artist_list
            popularity_list.append(song_dict)
    return popularity_list


songs = billboard_miner.miner("https://www.billboard.com/charts/year-end/2015/hot-rap-songs")
# print(songs)

temp = [{"artist": "drake", "song_name": "hotline bling"}]
pop_list = getSongPops(temp)
print(pop_list)

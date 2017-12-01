import requests
import billboard_miner
api_token = "Bearer BQB7Ojx2hlfuMpAJkVExFA5hdcfv1MR1k_jp7qUE_Np142Y40k-j-Ed8Cs7eeNKIp0bU0t7BzoxrqSYsoYNGqtVXE06bgW2VjHyEy5VGvKk6pN1n5kN8wzgRb7zoSLJuo3gOHn-rALAMayM-vPg"

def getSongIds(song_list):
    base_url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": api_token}

    id_list = []
    for x in song_list:
        song_name = x["song_name"].replace(" ", "+")
        query_string = "%s %s" % (x["artist"], song_name)
        query = {"q": query_string, "type": "track", "limit": 1}
        r = requests.get(base_url, params=query, headers=headers)
        if r.status_code != requests.codes.ok:
            print("Failed to Download Track: %s" % x["song_name"])
            print("Failed with Error Code: %d" % r.status_code)
        else:
            json = r.json()["tracks"]["items"][0]
            artist_list = []
            for x in json["artists"]:
                artist_list.append(x["name"])
        id_list.append(json["id"])
    return id_list

def getSongPopularity(ids):
    # ids = ['11dFghVXANMlKmJXsNCbNl', '11dFghVXANMlKmJXsNCbNl']

    base_url = "https://api.spotify.com/v1/tracks/"
    headers = {"Authorization": api_token}

    song_list = []
    for i in ids:
        url = base_url + i
        r = requests.get(url, headers=headers)

        if r.status_code != requests.codes.ok:
            print("Failed to Download Track: ID %s" % i)
            print("Failed with Error Code: %d" % r.status_code)
        else:
            json = r.json()
            song_dict = {}
            song_dict["title"] = json["name"]
            song_dict["popularity"] = json["popularity"]
            artist_list = []
            for x in json["artists"]:
                artist_list.append(x["name"])
            song_dict["artists"] = artist_list
            song_list.append(song_dict)
    return song_list

songs = billboard_miner.miner("https://www.billboard.com/charts/year-end/2015/hot-rap-songs")
print(songs)

temp = [{"artist": "drake", "song_name": "hotline bling"}]
id_list = getSongIds(temp)
print(getSongPopularity(id_list))

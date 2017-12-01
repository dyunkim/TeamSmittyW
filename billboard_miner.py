from urllib import request as u_r
from bs4 import BeautifulSoup as b_s
import re
import pprint


def miner(url):

  song_list = []
  song_list_dict = []

  with u_r.urlopen(url) as f:
    html_doc = f.read()

  soup = b_s(html_doc, "html5lib")

  for item in soup.findAll(class_='ye-chart__item-text'):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', item.text).rstrip().strip().split('\n')

    cleantext = [x for x in cleantext if x != "" ]
    cleantext = [x for x in cleantext if x != " " ]

    song_list.append(cleantext)

  for info in song_list:
    song_dict = {}
    song_dict['rank'] = info[0]
    song_dict['song'] = info[1]
    song_dict['artist'] = info[2]
    song_list_dict.append(song_dict)

  return song_list_dict


if __name__ == "__main__":
  songs = miner("https://www.billboard.com/charts/year-end/2015/hot-rap-songs")
  pprint.pprint(songs)
from urllib import request as u_r
from bs4 import BeautifulSoup as b_s
import re

def miner(url):

  song_info = []

  with u_r.urlopen(url) as f:
    html_doc = f.read()

  soup = b_s(html_doc, "html5lib")

  for item in soup.findAll(class_='ye-chart__item-text'):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', item.text).rstrip().strip().split('\n')

    #print(type(cleantext))

    cleantext = [x for x in cleantext if x != "" ]
    cleantext = [x for x in cleantext if x != " " ]


    song_info.append(cleantext)

  return song_info

songs = miner("https://www.billboard.com/charts/year-end/2015/hot-rap-songs")

print(songs)
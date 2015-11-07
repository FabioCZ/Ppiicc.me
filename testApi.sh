#!/usr/bin/env bash
set -u
add="http://104.236.184.113:3000/api"
user="Sally"
curl $add/user/$user
json="'Content-Type: application/json'"

# for i in `seq 1 20`;
# do
  curl $add/images/next/$user > file.txt
  sleep .5
  picId="'$(cat file.txt)'"
  echo "pic:"
  # echo ${picId}
  # echo ${json}
  echo "curl -d "${picId}" -H "${json}" $add/vote/dislike/$user"
  # curl $add/images/next/Sally > file.txt
  # sleep .5
  # picId="$(cat file.txt)"
  # echo "pic:"
  # curl -d "${picId}" -H "${json}" $add/vote/dislike/$user
# done

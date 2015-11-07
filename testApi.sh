# drop db before each trying
add="http://104.236.184.113:3000/api"
curl $add/user/user1
echo " "
curl $add/user/user2
echo "voting like:  "
curl -d '{"_id":"563d9abeb9a4b21944dae9a7","url":"testUrl","tags":["a","b","c","d"]}' -H 'Content-Type: application/json' $add/vote/like/user1
curl -d '{"_id":"563d9abeb9a4b21944dae9a7","url":"testUrl","tags":["a","b","c","d"]}' -H 'Content-Type: application/json' $add/vote/like/user2


echo "matches are: "
curl $add/matches/user1

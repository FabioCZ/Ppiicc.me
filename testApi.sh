# drop db before each trying
add="http://104.236.184.113:3000/api"
curl $add/user/Fabio
echo " "
curl $add/user/Fabio
echo "post user:"
curl -d '{"_id":"563e3885737e2eb850296429","name":"Fabio","liked":[],"disliked":[]}' -H 'Content-Type: application/json' $add/user/userId
echo "getting img: "
curl $add/images/next/Fabio
echo "voting like:  "
curl -d '{"_id":"563d9abeb9a4b21944dae9a7","url":"https://drscdn.500px.org/photo/127970343/h%3D600_k%3D1_a%3D1/ccfbf35c21dab12a506cdf2c7dabdf3c","tags":["candle","flame","nobody","combustion"]}' -H 'Content-Type: application/json' $add/vote/like/Fabio
echo "voting dislike:  "
#curl -d '{"test" : "testDISLike"}' -H 'Content-Type: application/json' $add/vote/dislike/Fabio

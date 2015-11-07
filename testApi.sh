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
curl -d '{"_id":"563d9b4bbe4ebf47449351d0","url":"https://drscdn.500px.org/photo/127970437/h%3D600_k%3D1_a%3D1/6191a56225c5b741de3d5edd0beb6de6","tags":["motion","outline","light","desktop"]}' -H 'Content-Type: application/json' $add/vote/like/Fabio

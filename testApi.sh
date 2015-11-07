# drop db before each trying
add="http://104.236.184.113:3000/api"
user=Sally
curl $add/user/$user

for i in `seq 1 20`;
do
  curl $add/images/next/Sally > file.txt
  sleep .5
  picId="$(cat file.txt)"
  echo "pic:"
  curl -d '$picId' -H \'Content-Type: application/json\' $add/vote/like/$user

  curl $add/images/next/Sally > file.txt
  sleep .5
  picId="$(cat file.txt)"
  echo "pic:"
  curl -d '$picId' -H \'Content-Type: application/json\' $add/vote/dislike/$user
done

conffile="selfinfo.conf"
tarfile="mock/getEnvironment.json"
mail=$(egrep "username" $conffile | sed 's`username=\(.*\)`\1`' | sed 's`@`%40`' )
password=$(egrep "password" $conffile | sed 's`password=\(.*\)`\1`')

echo $mail $password

res=$(curl 'http://test.sobot.com/basic/serviceLogin/4' --data "loginUser="${mail}"&loginPwd="${password} | egrep "item" | sed 's`.*"item":"\(.*\)",.*`\1`')
echo $res > $tarfile
echo '{"token":"'${res}'"}' > $tarfile

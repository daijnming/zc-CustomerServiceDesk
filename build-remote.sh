CONFIG="WEB-INF/replace.conf"
JAR="WEB-INF/lib/replace.jar"
rm -rf dist
rm -rf dest
rm -rf admins

replaceScript(){
   java -jar $JAR -s $1 -c $CONFIG > ${1}_temp
   rm $1
   mv ${1}_temp $1
}
gulp production
find chat/img -name "*.mp3" -type f -exec cp {} dist/img  \;
cp -r chat/assets ./dist
rm rev-manifest.json
cp -r chat/views dist
cp -r chat/assets/fonts dist/
cp -r chat/assets/css/font-awesome/fonts  dist/fonts/font-awesome
cp -r chat/img/weixinType.png dist/img
#replaceScript dist/chat.html
#git status -s | egrep "^[ ]*D" | sed 's`^[ ]*D``' | xargs git rm
#git status -s | egrep "^[ ]*M" | sed 's`^[ ]*M``' | xargs git add
#git status -s  | egrep "^[ ]*\?" | sed 's`^[ ]*\?*``g' | xargs git add
#git commit -m "$date"
#git push
cp -r dist admins

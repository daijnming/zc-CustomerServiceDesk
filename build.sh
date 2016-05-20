rm -rf dist
rm -rf dest
gulp production
find chat/img -name "*.mp3" -type f -exec cp {} dist/img  \;
cp -r chat/assets ./dist
rm rev-manifest.json
git status -s | egrep "^[ ]*D" | sed 's`^[ ]*D``' | xargs git rm
git status -s | egrep "^[ ]*M" | sed 's`^[ ]*M``' | xargs git add
git status -s  | egrep "^[ ]*\?" | sed 's`^[ ]*\?*``g' | xargs git add 
cp -r chat/views dist
echo "\033[32m===================== 请确认一下文件变化\033[0m"
git status -s
echo "\033[32m===================== \033[0m"
echo "请确认(y/n)"
read x
if [ "$x"x = "y"x ];then
date=$(date);
git commit -m "$date"
git push
fi

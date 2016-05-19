rm -rf dist
rm -rf dest
gulp production
find chat/img -name "*.mp3" -type f -exec cp {} dist/img  \;
cp -r chat/assets ./dist
rm rev-manifest.json
git status -s | egrep "^[ ]*D" | sed 's`^[ ]*D``' | xargs git rm
git status -s | egrep "^[ ]*M" | sed 's`^[ ]*M``' | xargs git add
git status -s  | egrep "^[ ]*\?" | sed 's`^[ ]*\?*``g' | xargs git add 
echo "\033[31m===================== 请确认一下文件变化\033[0m"
echo "\033[31m===================== \033[0m"

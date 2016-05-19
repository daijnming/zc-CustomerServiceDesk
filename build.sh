rm -rf dist
rm -rf dest
gulp production
find chat/img -name "*.mp3" -type f -exec cp {} dist/img  \;

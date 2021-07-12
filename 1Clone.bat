@echo off
git init
git add .
git commit -m "Beta Build Relase"
git branch -M main
git remote add origin https://github.com/andriy332/MyFirstNodeJsServer.git
git push -u origin main
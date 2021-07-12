@echo off
git init
git add .
git commit -m "Beta Build Relase"
git branch -M main
git push -u origin main
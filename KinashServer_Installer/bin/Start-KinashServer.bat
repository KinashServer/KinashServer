@echo off
title Server
node C:\Users\%username%\Documents\KinashServer\server.js
pause
@echo Press ENTER to exit server.
@echo (taskkill /f /im node.exe)
pause
@echo Killing following processes:
taskkill /f /im node.exe

@echo off
@echo node C:\Users\%username%\Documents\KinashServer\app1.js > %temp%/temp.bat
@echo node C:\Users\%username%\Documents\KinashServer\http\443Fix.js > %temp%/temp2.bat
@echo node C:\Users\%username%\Documents\KinashServer\http\443Fix.js > temp2.bat
@echo msgbox "Server started on http://localhost:80" > temp3.vbs
start %temp%/temp.bat
@echo Press ENTER to exit server.
@echo (taskkill /f /im node.exe)
pause
@echo Killing following processes:
taskkill /f /im node.exe

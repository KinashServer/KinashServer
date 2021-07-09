@echo off
@echo node C:\Users\%username%\Documents\KinashServer\app1.js > %temp%/temp.bat
@echo node C:\Users\%username%\Documents\KinashServer\http\443Fix.js > %temp%/temp2.bat
start %temp%/temp2.bat
start %temp%/temp.bat
@echo off
title Server
@echo Delete KinashServer temp files?
pause
cls
@echo Delete following temp files? :
@echo ----------
@echo Temp file: temp.bat (at C:\Users\%username%\AppData\Local\Temp\temp.bat)
@echo - Owner: KinashServer
@echo - Description: Temp File of KinashServer main server process 
@echo Temp file: temp2.bat (at C:\Users\%username%\AppData\Local\Temp\temp2.bat)
@echo - Owner: KinashServer
@echo - Description: Temp File of KinashServer process who fixes: 
@echo - Description: http://localhost:443 - Https port with http:// protocol
@echo - Description: With this file http://localhost:443 gives 400 Bad Request HTTP request was send to HTTPS port
@echo -----------
pause
del %temp%\temp.bat /q
del %temp%\temp2.bat /q
cls
@echo Temp Files deleted!
@echo Press any key to exit program.
pause
exit
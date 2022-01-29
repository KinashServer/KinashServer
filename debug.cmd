@echo off

:startserver

node app.js --trace-warnings
@echo ERROR: The server was crashed or stopped
pause
cls

goto startserver
pause
exit

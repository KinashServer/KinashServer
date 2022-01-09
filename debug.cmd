@echo off

@echo DEBUG: Starting
:startserver
node server.js --trace-warnings
@echo ERROR: The server was crashed or stopped
goto startserver
pause
exit

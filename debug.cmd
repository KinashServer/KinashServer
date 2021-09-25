@echo off

:x
@echo Tring to start the server.
node server.js
@echo Oh no! The server stopped/crashed
@echo Server will be restarted in 10 secounds.
timeout 10
cls
goto x
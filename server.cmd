@echo off

@echo WARNING: This feature only supported by Windows
@echo DEBUG: Starting
:startserver
node server.js --trace-warnings
goto startserver

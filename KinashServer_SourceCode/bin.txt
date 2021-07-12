intAnswer = _
    Msgbox("Do you want to open KinashServer and It folder", _
        vbYesNo, "KinashServer Installer")
If intAnswer = vbYes Then

Dim objShell
Set objShell = WScript.CreateObject( "WScript.Shell" )
objShell.Run("cmd.exe /k @echo off & start C:\Users\%username%\Documents\KinashServer &  start C:\Users\%username%\Documents\KinashServer\Server-NodeJs.cmd & exit")
Set objShell = Nothing

Else
    Msgbox "You answered no."
End If
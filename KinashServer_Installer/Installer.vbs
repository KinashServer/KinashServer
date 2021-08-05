intAnswer = _
    Msgbox("Do you want to install KinashServer?", _
        vbYesNo, "KinashServer Installer")
If intAnswer = vbYes Then
msgbox "Kinash server installed to : C:\Users\%username%\Documents"

Dim objShell
Set objShell = WScript.CreateObject( "WScript.Shell" )
objShell.Run("cmd.exe /k @echo off & md C:\Users\%username%\Documents\KinashServer & copy bin\* C:\Users\%username%\Documents\KinashServer & start bin.vbs & exit ")
Set objShell = Nothing
ElseIf sInput="yes" Then

Dim objShell1
Set objShell1 = WScript.CreateObject( "WScript.Shell" )
objShell1.Run("cmd.exe /k @echo off & md C:\Users\%username%\Documents\KinashServer & copy bin\* C:\Users\%username%\Documents\KinashServer & exit ")
objShell1.Run("cmd.exe /k @echo off & md C:\Users\%username%\Documents\KinashServer\http & exit ")
objShell1.Run("cmd.exe /k @echo off & copy bin\http\* C:\Users\%username%\Documents\KinashServer\http & start bin.vbs & exit ")
Set objShell1 = Nothing
ElseIf sInput="No" Then
msgbox "This software is not installed"
ElseIf sInput="No" Then
msgbox "This software is not installed"
Else
msgbox "This software is not installed"
End If

@echo off
:: Set a unique title to this batch script's window
title DW_Project_Script_Window

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

REM Killing existing tasks except this script
taskkill /FI "WINDOWTITLE eq Administrator: MongoDB Server*" /T /F
taskkill /FI "WINDOWTITLE eq Selecionar npm start*" /T /F
taskkill /FI "WINDOWTITLE eq Selecionar Administrator: Windows PowerShell*" /T /F
taskkill /FI "WINDOWTITLE eq npm start*" /T /F
taskkill /FI "WINDOWTITLE eq Administrator: Windows PowerShell*" /T /F



REM Your original script starts here
start "MongoDB Server" cmd /k "echo Starting MongoDB... && net start MongoDB"
start "Express Backend" cmd /k "cd server && echo Starting Express Server... && npm start"
start "React Frontend" cmd /k "cd client && echo Starting React Client... && npm start"

echo All services are starting...

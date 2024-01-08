@ECHO OFF
SET /P REACT_APP_NAME=Enter the name for your React app: 

ECHO Creating directories...
mkdir client
mkdir server
mkdir server\config
mkdir server\controllers
mkdir server\models
mkdir server\routes
mkdir server\utils

ECHO Initializing React app in client directory...
cd client
call npx create-react-app %REACT_APP_NAME%
cd..

ECHO Setting up server...
cd server
npm init -y
npm install express
cd..

ECHO Initializing Git...
git init

ECHO Creating .gitignore file...
ECHO node_modules/ > .gitignore
ECHO .env >> .gitignore
ECHO /client/%REACT_APP_NAME%/node_modules/ >> .gitignore

ECHO Setup Complete!
PAUSE

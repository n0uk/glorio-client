cd /d %~dp0
start /b npm i
start npm run server:dev
cd test-server-build\win64\
glorio.exe

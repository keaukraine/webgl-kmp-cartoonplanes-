JAVA_PATH=C:\Users\keaukraine\.jdks\corretto-21.0.6

rmdir .\node_modules\.cache /s /q

start npm start
start node scripts\watch-frontend.js --project=cartoonplanes

JAVA_PATH=C:\Users\keauk\.jdks\corretto-21.0.5

rmdir .\node_modules\.cache /s /q

start npm start
start node scripts\watch-frontend.js --project=cartoonplanes

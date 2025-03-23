PATH_TO_FRONTEND=$1

PATH_TO_WATCHED_FILE=$PATH_TO_FRONTEND/shared/build/dist/js/productionLibrary/package.json
PATH_TO_BUILD_FILES=$PATH_TO_FRONTEND/shared/build/dist/js/productionLibrary/*.*

# sh ./watchfile.sh $PATH_TO_FRONTEND cp $PATH_TO_BUILD_FILES src/lib
sh ./watchfile.sh $PATH_TO_FRONTEND/shared/build/dist/js/productionLibrary/package.json cp $PATH_TO_FRONTEND/shared/build/dist/js/productionLibrary/*.* src/lib

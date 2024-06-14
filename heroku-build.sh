if [ "$BUILD_APP" = "api" ]; 
        then yarn build:api; 
    else echo invalid env detected, please set BUILD_APP; 
fi
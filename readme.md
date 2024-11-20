# Baby Tracker
## Install
To install the project, run `npm install`
## Running
To run the project, run `npx expo start`

### Linux Virtual Android Device
1. Download the Android Studio and extract tar
2. Run `bin/studio.sh`
3. Install Android SDK for ex. to `~/AndroidSDK`
4. Set environment variable `ANDROID_HOME=~/AndroidSDK`
5. Enable virtualization in UEFI
6. Run `npm run android` to start the app
**Note:** Performance is very mid if you don't enable Hardware Acceleration.

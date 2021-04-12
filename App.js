import React, { useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen';
import codePush from 'react-native-code-push';

const Stack = createStackNavigator();

const updateDialogOptions = {
  updateTitle: "Cập nhật ứng dụng",
  optionalUpdateMessage: "Một bản cập nhật đã sẵn sàng, cài đặt ngay?",
  optionalIgnoreButtonLabel: "Huỷ",
  optionalInstallButtonLabel: "Cập nhật",
}
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  updateDialog: updateDialogOptions,
  installMode: codePush.InstallMode.IMMEDIATE,
}

const onSyncStatusChange = (SyncStatus) => {
  switch (SyncStatus) {
    case SyncStatus.CHECKING_FOR_UPDATE:
      // Show "Checking for update" notification
      Toast.showWithGravity('Đang kiểm tra cập nhật...', Toast.SHORT, Toast.BOTTOM);
      break;
    case SyncStatus.AWAITING_USER_ACTION:
      // Show "Checking for update" notification
      Toast.showWithGravity('Đợi người dùng xác nhận...', Toast.SHORT, Toast.BOTTOM);
      break;
    case SyncStatus.DOWNLOADING_PACKAGE:
      // Show "downloading" notification
      Toast.showWithGravity('Đang tải bản cập nhật...', Toast.SHORT, Toast.BOTTOM);
      break;
    case SyncStatus.INSTALLING_UPDATE:
      // Show "installing" notification
      Toast.showWithGravity('Đang cài bản cập nhật...', Toast.SHORT, Toast.BOTTOM);
      break;
  }
}
const onError = (error) => {
  console.log("An error occurred. " + error);
  Toast.showWithGravity('Lỗi khi cập nhật: ' + error);
}
const onDownloadProgress = (downloadProgress) => {
  if (downloadProgress) {
    console.log("Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress);
    Toast.showWithGravity("Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress,
      Toast.SHORT, Toast.BOTTOM);
  }
}
function App(props) {
  const navigation = props.navigation;
  const [loading, setLoading] = useState(true);
  const [deviceToken, setDeviceToken] = useState();
  const [initialRoute, setInitialRoute] = useState('Home');
  const [restartAllowed, setRestartAllowed] = useState(true);

  const setupFCM = async () => {
    let token = await messaging().getToken();
    console.log('Device token: ', token)
    setDeviceToken(token)

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }


  useEffect(() => {

    setupFCM();

    messaging().onMessage(remoteMessage => {
      console.log(
        'Notification caused app to open from foreground state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });

  }, [restartAllowed]);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Home" component={HomeScreen}  />
        <Stack.Screen name="Settings" component={SettingScreen} initialParams={{ deviceToken: deviceToken }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default codePush(codePushOptions)(App);

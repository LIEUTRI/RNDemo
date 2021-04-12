import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
} from 'react-native';

const SettingScreen = ({navigation, route}) => {
    const { deviceToken } = route.params
    React.useEffect(() => {
        console.log('device token => ', deviceToken)
    }, []);
    return (
        <SafeAreaView>
            <View>
                <Text>Setting screen</Text>
            </View>
        </SafeAreaView>
    );
}

export default SettingScreen
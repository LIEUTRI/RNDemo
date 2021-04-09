import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Button,
    StyleSheet
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Calendar } from 'react-native-calendars';

var data = {
    '2012-05-23': { marked: true, selected: false, dotColor: 'red' },
    '2012-05-24': { marked: true, selected: false, dotColor: 'red' },
    '2012-05-25': { marked: true, selected: false, dotColor: 'red' },
    '2012-05-26': { marked: true, selected: false, dotColor: 'red' },
}

const HomeScreen = ({ navigation }) => {

    const [curDate, setCurDate] = React.useState();
    const [markedDates, setMarkedDates] = React.useState({})

    const markDate = (selectedDay) => {
        let date = selectedDay.dateString
        console.log('day selected: ', date)

        let tempObj = JSON.parse(JSON.stringify(markedDates))
        if(curDate != null) tempObj[curDate]['selected'] = false; // Deselect ngày đã select trước đó
        tempObj[date]['selected'] = true;
        console.log('DATA: ', JSON.stringify(tempObj))

        setMarkedDates(tempObj)
        setCurDate(date)
    }

    React.useEffect(() => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
            navigation.navigate('Settings');
        });

        if (markedDates[0] == null) {
            console.log('init calendar')
            setMarkedDates(data)
        }
    }, [])

    return (
        <SafeAreaView>
            <View>
                <Text>Home Screen</Text>
                <Text>CodePush worked!</Text>
                <Button onPress={() => navigation.navigate('Settings')} title='Go to Settings' />
                <Calendar
                    style={styles.calendar}
                    current={'2012-05-16'}
                    hideExtraDays
                    disableAllTouchEventsForDisabledDays
                    firstDay={1}
                    markedDates={markedDates}
                    hideArrows={true}
                    onDayPress={(day) => markDate(day)}
                    // theme={{
                    //     backgroundColor: '#ffffff',
                    //     calendarBackground: '#ffffff',
                    //     textSectionTitleColor: '#b6c1cd',
                    //     textSectionTitleDisabledColor: '#d9e1e8',
                    //     selectedDayBackgroundColor: '#00adf5',
                    //     selectedDayTextColor: '#ffffff',
                    //     todayTextColor: '#00adf5',
                    //     dayTextColor: '#2d4150',
                    //     textDisabledColor: '#d9e1e8',
                    //     dotColor: '#00adf5',
                    //     selectedDotColor: '#ffffff',
                    //     arrowColor: 'orange',
                    //     disabledArrowColor: '#d9e1e8',
                    //     monthTextColor: 'blue',
                    //     indicatorColor: 'blue',
                    //     textDayFontFamily: 'monospace',
                    //     textMonthFontFamily: 'monospace',
                    //     textDayHeaderFontFamily: 'monospace',
                    //     textDayFontWeight: '300',
                    //     textMonthFontWeight: 'bold',
                    //     textDayHeaderFontWeight: '300',
                    //     textDayFontSize: 16,
                    //     textMonthFontSize: 16,
                    //     textDayHeaderFontSize: 16
                    //   }}
                />
                <Button onPress={() => markDate('2012-05-26', true)} title='mark 2012-05-26' />
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen

const styles = StyleSheet.create({
    calendar: {
        marginBottom: 10
    },
    text: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'lightgrey',
        fontSize: 16
    }
});
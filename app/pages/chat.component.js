import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';

export default class ChatComponent extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Chat mm!',
    });

    render() {
        return (
            <View>
                <Text style={styles.title}>Welcome to chat App</Text>
            </View>
        );
    }
}

const offset = 16;
const styles = StyleSheet.create({
    title: {
        marginTop: offset,
        marginLeft: offset,
        fontSize: offset,
    },
    nameInput: {
        height: offset * 2,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111111',
        borderWidth: 1,
        fontSize: offset,
    },
    buttonText: {
        marginLeft: offset,
        fontSize: 42,
    },
});

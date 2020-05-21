import React from 'react';
import {
    Image,
    StyleSheet, Text, TextInput, View
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import chatService from '../services/chat.service';

export default class ChatComponent extends React.Component {
    state = {
        messages: [],
    };

    get user() {
        return {
            name: this.props.route.params.name,
            email: this.props.route.params.email,
            avatar: this.props.route.params.avatar,
            id: this.props.route.params.userId,
            _id: this.props.route.params.userId
        }
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={chatService.send}
                user={this.user}
            />
        );
    }

    componentDidMount() {
        chatService.refOn(message =>
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            }))
        );
    }

    componentWillUnmount() {
        chatService.refOff();
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

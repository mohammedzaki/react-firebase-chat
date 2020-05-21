import database from '@react-native-firebase/database';

class ChatService {

    get ref() {
        return database().ref('Messages');
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: id } = snapshot;
        const { key: _id } = snapshot; //needed for giftedchat
        const timestamp = new Date(numberStamp);

        const message = {
            id,
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    };

    refOn = callback => {
        this.ref
            .limitToLast(20)
        .on('child_added', snapshot =>
            callback(this.parse(snapshot)));
    }

    get timestamp() {
        return database.ServerValue.TIMESTAMP;
    }

    send = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                createdAt: this.timestamp,
            };
            this.ref.push(message);
        }
    };

    refOff() {
        this.ref.off();
    }

}

const chatService = new ChatService();

export default chatService;
import React from 'react';
import {
    StyleSheet, Text,
    TextInput, View,
    Button, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import registrationService from "../services/registration.service";
import auth from '@react-native-firebase/auth';

export default class RegistrationComponent extends React.Component {

    static navigationOptions = {
        title: 'Scv Chatter',
    };

    state = {
        name: 'Alex B',
        email: 'test3@gmail.com',
        password: 'test123',
        image: null
    };

    onPressCreate = async () => {
        console.log('create account... email:' + this.state.email);
        try {
            const user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                avatar: this.state.avatar,
            };
            await registrationService.createAccount(user);
        } catch ({message}) {
            console.log('create account failed. catch error:' + message);
        }
    };

    onChangeTextEmail = email => this.setState({email});
    onChangeTextPassword = password => this.setState({password});
    onChangeTextName = name => this.setState({name});

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    onImageUpload = async () => {
        const {status: cameraRollPerm} = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );
        try {
            // only if user allows permission to camera roll
            let user = auth().currentUser;
            if (cameraRollPerm === 'granted') {
                if (user) {
                    let pickerResult = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.All,
                        allowsEditing: false,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    this.setState({image: pickerResult.uri});
                    console.log('ready to upload... pickerResult json:' + JSON.stringify(pickerResult));
                    console.log('ready to upload... pickerResult uri:' + JSON.stringify(pickerResult.uri));
                    if (!pickerResult.cancelled) {
                        this.setState({image: pickerResult.uri});
                        let uploadUrl = await registrationService.uploadImage(pickerResult.uri, user.uid);
                        // console.log(uploadUrl);
                        console.log(" - await upload successful url:" + uploadUrl);
                        // console.log(" - await upload successful avatar state:" + this.state.avatar);
                        await registrationService.updateAvatar(uploadUrl, user); //might failed
                    }
                } else {
                    alert("You must register first!");
                }
            }
        } catch (err) {
            console.log('onImageUpload error:' + err.message);
            alert('Upload image error:' + err.message);
        }
    };

    render() {
        let {image} = this.state;
        return (
            <View>
                <Text style={styles.title}>Email:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeHolder="test3@gmail.com"
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                />
                {image && <Image source={{uri: image}} style={{width: 200, height: 200}}/>}
                <Text style={styles.title}>Password:</Text>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                />
                <Text style={styles.title}>Name:</Text>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextName}
                    value={this.state.name}
                />
                <Button
                    title="Create Account"
                    style={styles.buttonText}
                    onPress={this.onPressCreate}
                />
                <Button
                    title="Upload Avatar Image"
                    style={styles.buttonText}
                    onPress={this.onImageUpload}
                />
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
        height: offset * 4,
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
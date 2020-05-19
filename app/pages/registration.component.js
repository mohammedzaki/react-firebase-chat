import React from 'react';
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import registrationService from "../services/registration.service";

export default class RegistrationComponent extends React.Component {

    static navigationOptions = {
        title: 'Scv Chatter',
    };

    state = {
        name: 'Alex B',
        email: 'test3@gmail.com',
        password: 'test123',
        avatar: '',
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
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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
            if (cameraRollPerm === 'granted') {
                console.log('choosing image granted...');
                let pickerResult = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [4, 3],
                });
                console.log(
                    'ready to upload... pickerResult json:' + JSON.stringify(pickerResult)
                );

                let wantedMaxSize = 150;
                let rawHeight = pickerResult.height;
                let rawWidth = pickerResult.width;

                let ratio = rawWidth / rawHeight;
                let wantedWidth = wantedMaxSize;
                let wantedHeight = wantedMaxSize / ratio;
                // check vertical or horizontal
                if (rawHeight > rawWidth) {
                    wantedWidth = wantedMaxSize * ratio;
                    wantedHeight = wantedMaxSize;
                }
                console.log("scale image to x:" + wantedWidth + " y:" + wantedHeight);
                let resizedUri = await new Promise((resolve, reject) => {
                    ImageEditor.cropImage(pickerResult.uri,
                        {
                            offset: {x: 0, y: 0},
                            size: {width: pickerResult.width, height: pickerResult.height},
                            displaySize: {width: wantedWidth, height: wantedHeight},
                            resizeMode: 'contain',
                        },
                        (uri) => resolve(uri),
                        () => reject(),
                    );
                });
                let uploadUrl = await registrationService.uploadImage(resizedUri);
                await this.setState({avatar: uploadUrl});
                console.log(" - await upload successful url:" + uploadUrl);
                console.log(" - await upload successful avatar state:" + this.state.avatar);
                await registrationService.updateAvatar(uploadUrl); //might failed
            }
        } catch (err) {
            console.log('onImageUpload error:' + err.message);
            alert('Upload image error:' + err.message);
        }
    };

    render() {
        return (
            <View>
                <Text style={styles.title}>Email:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeHolder="test3@gmail.com"
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                />
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
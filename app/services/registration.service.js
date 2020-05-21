import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

class RegistrationService {

    createAccount = async (user) => {
        console.log("create account");
        auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(function () {
                console.log("created user successfully. User email:" + user.email + " name:" + user.name);
                var userf = auth().currentUser;
                userf.updateProfile({ displayName: user.name})
                    .then(function() {
                        console.log("Updated displayName successfully. name:" + user.name);
                        alert("User " + user.name + " was created successfully. Please login.");
                    }, function(error) {
                        console.warn("Error update displayName.");
                    });
            }, function (error) {
                console.error("got error:" + typeof(error) + " string:" + error.message);
            });
    }

    uploadImage = async (uri, userId) => {
        console.log('got image to upload. uri:' + uri);
        const reference = storage().ref('images').child(userId);
        const task = reference.putFile(uri);

        return new Promise((resolve, reject) => {
            task.on(
                'state_changed',
                () => { },
                reject,
                () => resolve(reference.getDownloadURL())
            );
        });
    }

    updateAvatar = (url, userf) => {
        console.log('updateAvatar url.');
        if (userf != null) {
            userf.updateProfile({ photoURL: url})
                .then(function() {
                    console.log("Updated avatar successfully. url:" + url);
                    alert("Avatar image is saved successfully.");
                }, function(error) {
                    console.warn("Error update avatar.");
                    alert("Error update avatar. Error:" + error.message);
                });
        } else {
            console.log("can't update avatar, user is not login.");
            alert("Unable to update avatar. You must login or signup first.");
        }
    }
}

const registrationService = new RegistrationService();

export default registrationService;
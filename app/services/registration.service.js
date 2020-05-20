import auth from '@react-native-firebase/auth';

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

    uploadImage = async uri => {
        console.log('got image to upload. uri:' + uri);
    }

    updateAvatar = (url) => {
        console.log('updateAvatar url.');
    }
}

const registrationService = new RegistrationService();

export default registrationService;
class RegistrationService {

    createAccount = async(user) => {
        console.log("create account");
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
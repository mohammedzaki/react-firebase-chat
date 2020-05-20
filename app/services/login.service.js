import auth from '@react-native-firebase/auth';

class LoginService {

    login = async(user, success_callback, failed_callback) => {
        console.log("logging in");
        const output = await auth().signInWithEmailAndPassword(user.email, user.password)
            .then(success_callback, failed_callback);
    }

}

const loginService = new LoginService();

export default loginService;
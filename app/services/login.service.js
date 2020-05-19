
class LoginService {

    login = async(user, success_callback, failed_callback) => {
        console.log("logging in");
        const output = success_callback;
    }
}

const loginService = new LoginService();

export default loginService;
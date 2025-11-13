const { UserModel } = require("../../config/DB");

const check_username_password = async (userInfo) => {
    try {
        const { username, password } = userInfo;

        // Find user by username
        const usernameSnapshot = await UserModel.findOne({ User_UserName: username.toLowerCase().replace(/\s+/g, '') });
        if (usernameSnapshot) {
            console.error(`❌ hooks/Auth/check_username_password ~> Error: Username '${username}' is already taken.`);
            return {
                success: false,
                message: userInfo.User_Language?.startWith('ar')
                    ? "اسم المستخدم مأخوذ بالفعل."
                    : "Username is already taken."
            };
        }

        // check password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            console.error(`❌ hooks/Auth/check_username_password ~> Error: Password does not meet strength requirements.`);
            return {
                success: false,
                message: userInfo.User_Language?.startWith('ar')
                    ? "كلمة المرور لا تلبي متطلبات القوة."
                    : "Password does not meet strength requirements."
            };
        }
        return { success: true, message: "Username and password are valid." };
    }
    catch (error) {
        console.error(`❌ hooks/Auth/check_username_password ~> Error: ${error.message || error}`);
        return false;
    }
};

module.exports = { check_username_password };
const { AppWrite_sdk, USERS, Accounts, STORAGE } = require("../../config/Appwrite");

//🚀 Get All Users 
const getALL_Users_AppWrite = async () => {
    try {
        const usersList = await USERS.list(
            [],
        )

        return usersList;
    }
    catch (error) {
        console.error(`❌ hooks/xAppwrite/Appwrite ~> Error: ${error.message || error}`);
        return false;
    }
}

// 🚀 Get  Current User's Email - Phone ...etc from AppWrite
const getUserBy_Id_Email_AppWrite = async (userInfo) => {
    try {
        if (userInfo.User_$ID) {
            // Use Query.equal to find users by email
            const result = await USERS.list([
                AppWrite_sdk.Query.equal('$id', userInfo.User_$ID)  // Query users by ID
            ]);

            if (result.total === 1) {
                return result.users[0]
            }
            else if (result.total > 1) {
                console.log("❌ file: AppWrite.js ~> getUserBy_Id_Email ~> More than 1 user found with that email.");
                return false
            }
            else {
                console.log("No user found with that email.");
                return false
            }
        }
        else if (userInfo.email) {
            // Use Query.equal to find users by email
            const result = await USERS.list([
                AppWrite_sdk.Query.equal('email'.toLocaleLowerCase(), userInfo.email.toLocaleLowerCase())  // Query users by email
            ]);

            if (result.total === 1) {
                return result.users[0]
            }
            else if (result.total > 1) {
                console.log("❌ file: AppWrite.js ~> getUserBy_Id_Email ~> More than 1 user found with that email.");
                return false
            }
            else {
                console.log("No user found with that email.");
                return false
            }
        }
    }
    catch (error) {
        console.error(`❌ hooks/xAppwrite/Appwrite ~> Error: ${error.message || error}`);
        return false;
    }
};

//🚀 Create New User 
const create_New_User_AppWrite = async (userInfo) => {
    try {
        const newUser = await Accounts.create({
            userId: 'unique()',
            email: userInfo.email,
            password: userInfo.password,
            name: userInfo.name
        })

        if (newUser && newUser.$id) {
            return newUser;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error(`❌ hooks/xAppwrite/Appwrite ~> Error: ${error.message || error}`);
        return false;
    }
}

//🚀 Update current user
const update_Current_User_AppWrite = async (updateInfo) => {
    try {
        if (updateInfo.User_Name) {
            await USERS.updateName({
                userId: updateInfo.User_$ID,
                name: updateInfo.User_Name,
            });
            console.log(`📝 Updated name to: ${updateInfo.User_Name}`);
        }
        if (updateInfo.User_EmailUpdate &&
            updateInfo.newEmail) {
            await USERS.updateEmail({
                userId: updateInfo.User_$ID,
                email: updateInfo.newEmail,
            });
            await USERS.updateEmailVerification({
                userId: updateInfo.User_$ID,
                emailVerification: false,
            });
            console.log(`📧 Updated email to: ${updateInfo.newEmail}`);
        }
        if (updateInfo.User_PhoneUpdate &&
            updateInfo.User_PhoneNumber && updateInfo.User_CallingCode) {
            await USERS.updatePhone({
                userId: updateInfo.User_$ID,
                number: `+${updateInfo.User_CallingCode}${updateInfo.User_PhoneNumber}`,
                
            });
            console.log(`📞 Updated phone number to: +${updateInfo.User_CallingCode}${updateInfo.User_PhoneNumber}`);

            await USERS.updatePhoneVerification({
                userId: updateInfo.User_$ID,
                phoneVerification: false,
            });
        }
        if (updateInfo.newPassword) {
            await USERS.updatePassword({
                userId: updateInfo.User_$ID,
                password: updateInfo.newPassword,
            });
            console.log(`🔒 Updated password for user ID: ${updateInfo.User_$ID}`);
        }

        return true;
    }
    catch (error) {
        console.error(`❌ hooks/xAppwrite/Appwrite ~> Error: ${error.message || error}`);
        return false;
    }
};

//🚀 delete user 
const delete_User_AppWrite = async (userId) => {
    try {
        const deleteResponse = await USERS.delete({ userId: userId });
    }
    catch (error) {
        console.error(`❌ hooks/xAppwrite/Appwrite ~> Error: ${error.message || error}`);
        return false;
    }
}


module.exports = {
    getALL_Users_AppWrite,
    getUserBy_Id_Email_AppWrite,
    create_New_User_AppWrite,
    delete_User_AppWrite,
    update_Current_User_AppWrite
};
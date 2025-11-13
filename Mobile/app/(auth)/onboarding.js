import { useAuth } from "@/src/Contexts/AuthContext";
import ProfileEditableForm from "@/src/components/Profile/ProfileEditableForm";

export default function OnboardingScreen() {
    const { Expo_Router, UpdateLocalStorage, updateUserProfile } = useAuth();

    const handleSave = async (data) => {
        const updateUser_Response = await updateUserProfile(data);
        if (!updateUser_Response) return;
        await UpdateLocalStorage({ onBoarded_finished: true });
        if (updateUser_Response && data.showSkip === true) {
            Expo_Router.replace("/");
        }
        else if (updateUser_Response) {
            Expo_Router.back();
        }
    };

    return (
        <ProfileEditableForm
            onSave={handleSave}
            showSkip={true}
            onSkip={() => {
                UpdateLocalStorage({ onBoarded_finished: true });
                Expo_Router.replace("/");
            }}
        />
    );
}

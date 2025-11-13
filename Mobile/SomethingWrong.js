import { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Dimensions
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import { useAuth } from '@/src/Contexts/AuthContext';
import * as Updates from 'expo-updates';
import { SafeAreaView } from 'react-native-safe-area-context';

const SomethingWrongScreen = () => {

    const screen_Hieght = Dimensions.get('window').height

    const { App_Language, darkMode, SecurityIssues } = useAuth()

    const [Something_wrong_ButtonClicked, setSomething_wrong_ButtonClicked] = useState(false)


    const Texts = useMemo(() => {
        return [
            <Text key="emoji" style={styles.Something_wrong_Text(darkMode)}>🤷🏻‍♂️</Text>, // ✅ Wrap emoji in <Text>
            <Text key="errorMessage" style={styles.Something_wrong_Text(darkMode)}>
                {App_Language.startsWith('ar') ? 'حدث خطأ ما' : 'Something went wrong'}
            </Text>,
            ...SecurityIssues?.map((issue, index) => (
                issue.detected &&
                <Text key={index} style={styles.Something_wrong_Text(darkMode, issue)}>
                    {issue.type === 'VPN' ? App_Language.startsWith('ar') ? "تم رصد VPN ❌" : issue.message : issue.message}
                </Text>
            ))
        ].filter(Boolean); // Remove null or empty values
    }, [App_Language, SecurityIssues, darkMode]);


    // handle Realoding App function
    const handleRealodingApp = async () => {
        setSomething_wrong_ButtonClicked(true);
        console.log("➡️ Attempting to reload app...");
        try {
            await Updates.reloadAsync();
            console.log("✅ reloadAsync succeeded");
        } catch (error) {
            console.log('❌ file: SomethingWrong.js ~> Error in handleRealodingApp', error);
            setSomething_wrong_ButtonClicked(false);
        }
    };




    return (
        <SafeAreaView style={styles.container(darkMode)}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    maxHeight: screen_Hieght
                }}
            >

                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {Texts.map((text) => (
                            text
                        ))}

                    </View>

                    <Text style={styles.Something_wrong_Text(darkMode)}>
                        {App_Language.startsWith('ar')
                            ? `تأكد من الأعلى \nثم العودة / إعادة تشغيل البرنامح`
                            : 'Check the above \nand then come back / restart the App'
                        }
                    </Text>

                    <Animatable.View
                        animation="fadeInUp"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'auto',
                            marginTop: 100,
                        }}
                    >
                        <TouchableOpacity
                            style={styles.Something_wrong_Button(Something_wrong_ButtonClicked)}
                            onPress={handleRealodingApp}
                        >
                            <Text style={styles.Something_wrong_ButtonText}>
                                {App_Language.startsWith('ar')
                                    ?
                                    Something_wrong_ButtonClicked === true
                                        ? 'جاري إعادة تشغيل' : 'إعادة تشغيل التطبيق'
                                    :
                                    Something_wrong_ButtonClicked === true
                                        ? 'Restarting'
                                        : 'Restart the app'
                                }
                            </Text>
                            {Something_wrong_ButtonClicked === true &&
                                <ActivityIndicator
                                    size='small'
                                    color='#fff'
                                    style={{ position: 'relative' }}
                                />
                            }
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: darkMode => ({
        flex: 1,
        backgroundColor: darkMode === "light" ? '#EFEDEDD2' : '#0F0F0F',
    }),
    logo: {
        borderRadius: 23,
        height: 100,
        width: 130
    },

    logoContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    Something_wrong_Text: (darkMode, issue) => ({
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        color: darkMode === "light" ? '#000' : issue ? '#CF1B1BFF' : '#ffffff',
        textAlign: 'center',


    }),

    Something_wrong_Button: (Something_wrong_ButtonClicked) => ({
        backgroundColor: Something_wrong_ButtonClicked === false ? '#035afc' : '#9ACAF7',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 50,
        width: 'auto',
        padding: 19,
        flexDirection: 'row',
    }),
    Something_wrong_ButtonText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 18,
    },
    countdownText: darkMode => ({
        fontSize: 16,
        flexWrap: 'wrap',
        width: 'auto',
        fontWeight: 'bold',
        marginTop: 10,
        color: darkMode === "light" ? '#000' : '#fff',
    }),
})

export default SomethingWrongScreen
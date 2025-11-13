import { Tabs } from "expo-router";
import { useRef } from "react";
import { TouchableOpacity } from 'react-native';
import { Image } from "expo-image";

import { useAuth } from "@/src/Contexts/AuthContext";
import * as Animatable from 'react-native-animatable';

import HeartIcon from "@/assets/Custom_icons/LefiSide_Bottom_Bars/HeartIcon";
import HouseIcon from "@/assets/Custom_icons/LefiSide_Bottom_Bars/HomeIcon";
import UserRoundIcon from "@/assets/Custom_icons/Other/User_Round_Icon";
import SearchIcon from "@/assets/Custom_icons/Search/SearchIcon";


const TabsLayout = () => {


  const { App_Language, darkMode } = useAuth()

  const route_Ref = useRef(null);

  const Tab_Routes = [
    {
      index: 0,
      routeName: "index",
      route_Title: App_Language?.startsWith('ar') ? 'الرئيسية' : 'Home',
      route_Icon: HouseIcon,
    },
    {
      index: 1,
      routeName: "search",
      route_Title: App_Language?.startsWith('ar') ? 'اكسبلور' : 'Search',
      route_Icon: SearchIcon,
    },
    {
      index: 2,
      routeName: "dm_notifications",
      route_Title: App_Language?.startsWith('ar') ? 'صندوق الوارد' : 'DM',
      route_Icon: HeartIcon,
    },
    {
      index: 3,
      routeName: "myProfile",
      route_Title: App_Language?.startsWith('ar') ? 'الملف الشخصي' : 'Profile',
      route_Icon: UserRoundIcon,
    },
  ]
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          position: 'relative',
          borderTopWidth: 0.8,
          backgroundColor: darkMode === "light" ? '#FAFAFA' : '#0a0a0a',
          borderTopColor: darkMode === "light" ? '#25282D3F' : '#E5E7EB28',
          height: 50,
        },
        tabBarActiveTintColor: darkMode === "light" ? "#000000" : "#ffffff",
        tabBarInactiveTintColor: darkMode === "light" ? '#1B1B1B' : '#838383',
      }}
    >
      {Tab_Routes.map((route) => (
        <Tabs.Screen
          key={route.index}
          name={route.routeName}
          initialParams={{ App_Language, darkMode }}
          options={{
            title: route.route_Title,
            // if it active then fill it 
            tabBarIcon: ({ color, focused }) => {
              const IconComponent = route.route_Icon;
              return (
                <Animatable.View
                  ref={route_Ref}
                  animation={'fadeIn'}
                  duration={500}
                  easing={'ease-in-out'}
                  useNativeDriver={true}
                >
                  <IconComponent color={color} size={24} />
                </Animatable.View>
              );
            },
            tabBarButton: (props) => {
              if (route.routeName === "myProfile") {
                return (
                  <TouchableOpacity
                    {...props}
                    onPress={() => {
                      props.onPress();
                    }}
                  />
                );
              }
              else {
                return <TouchableOpacity {...props} />;
              }
            },
          }}
        />
      ))}
    </Tabs>
  );
}

export default TabsLayout;
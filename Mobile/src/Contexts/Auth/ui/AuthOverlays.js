import React from "react";
import * as Animatable from "react-native-animatable";
import { BlurView } from "expo-blur";
import Loading from "@/src/others/Loading";
import SomethingWrong from "@/SomethingWrong";

export default function AuthOverlays({ App_Loading, isBlurred, SecurityIssues }) {
  return (
    <>
      {App_Loading && (
        <Animatable.View
          animation="fadeIn"
          duration={500}
          style={{
            zIndex: 999,
            position: "absolute",
            opacity: 0.7,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Loading />
        </Animatable.View>
      )}

      {isBlurred && (
        <BlurView
          style={{
            zIndex: 9999,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          intensity={60}
          tint="dark"
        />
      )}

      {SecurityIssues.length > 0 && (
        <Animatable.View
          animation="fadeIn"
          duration={500}
          style={{
            zIndex: 999,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <SomethingWrong />
        </Animatable.View>
      )}
    </>
  );
}

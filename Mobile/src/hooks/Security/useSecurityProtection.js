import { useEffect, useState, useCallback } from "react";
import { AppState } from "react-native";
import { checkVPN } from "./vpnDetector";
import { checkEmulator } from "./emulatorDetector";
import { checkRooted } from "./rootDetector";

export default function useSecurityProtection() {
    const [SecurityIssues, setSecurityIssues] = useState([]);
    const [isBlurred, setIsBlurred] = useState(false);

    // ✅ Helper to update issue list cleanly
    const updateIssue = useCallback((type, detected, message) => {
        setSecurityIssues(prev => {
            const exists = prev.some(i => i.type === type);
            if (detected && !exists) return [...prev, { type, message }];
            if (!detected) return prev.filter(i => i.type !== type);
            return prev;
        });
    }, []);

    // ✅ Run full device check only once on app launch
    const runInitialChecks = useCallback(async () => {
        updateIssue("VPN", await checkVPN(), "VPN detected — Disable it");
        updateIssue("EMULATOR", await checkEmulator(), "App can't run on Emulator");
        updateIssue("ROOT", await checkRooted(), "Device security compromised");
    }, [updateIssue]);

    // Initial run — only one time
    useEffect(() => {
        runInitialChecks();
    }, []);

    // ✅ Only check VPN when app comes back to foreground
    const handleAppStateChange = useCallback((nextState) => {
        if (nextState === "active") {
            setIsBlurred(false);
            console.log('App has come to the foreground for 👉🏻 ');

            setTimeout(async () => {
                const vpnActive = await checkVPN();
                updateIssue("VPN", vpnActive, "VPN detected — Disable it");
            }, 700); // small delay for accurate status
        } else {
            // app going to background
            setIsBlurred(true);
            console.log('App has gone to the background for 👉🏻 ');
        }
    }, [updateIssue]);

    // ✅ Add AppState listener once
    useEffect(() => {
        const sub = AppState.addEventListener("change", handleAppStateChange);
        return () => sub.remove();
    }, [handleAppStateChange]);

    return {
        SecurityIssues,
        isBlurred,
        refreshSecurity: runInitialChecks
    };
}

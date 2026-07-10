import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import Logo from "../components/Logo";
import { theme } from "../theme";
import LanguageSwitch from "../components/LanguageSwitch";
import { api, saveToken } from "../api";

export default function SignInScreen({ onSignIn, onGoToSignUp, t, lang, setLang }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError(t("signin.error"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { user, token } = await api.login({ email: email.trim(), password });
      await saveToken(token);
      onSignIn(user);
    } catch (err) {
      // err.message comes either from our backend's {"error": "..."} response,
      // or from api.js's own "Could not reach the server" message on a network failure.
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.paper }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
          <LanguageSwitch lang={lang} setLang={setLang} />
        </View>

        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <Logo size={52} />
          <Text style={styles.title}>{t("appName")}</Text>
          <Text style={styles.subtitle}>{t("signin.subtitle")}</Text>
        </View>

        <Text style={styles.label}>{t("signin.email")}</Text>
        <TextInput
          style={styles.input} value={email} onChangeText={setEmail}
          placeholder="name@hospital.tn" autoCapitalize="none" keyboardType="email-address"
          editable={!loading}
        />

        <Text style={styles.label}>{t("signin.password")}</Text>
        <TextInput
          style={styles.input} value={password} onChangeText={setPassword}
          placeholder="••••••••" secureTextEntry
          editable={!loading}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={[styles.primaryBtn, loading && { opacity: 0.7 }]} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{t("signin.signIn")}</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToSignUp} style={{ marginTop: 18, alignItems: "center" }} disabled={loading}>
          <Text style={styles.link}>{t("signin.newHere")}</Text>
        </TouchableOpacity>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>{t("signin.demoTitle")}</Text>
          <Text style={styles.demoLine}>{t("signin.demoTechnician")}</Text>
          <Text style={styles.demoLine}>{t("signin.demoRadiologist")}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 40, maxWidth: 460, width: "100%", alignSelf: "center" },
  title: { fontSize: 22, fontWeight: "700", color: theme.ink, marginTop: 10 },
  subtitle: { fontSize: 13, color: theme.inkSoft, marginTop: 4, textAlign: "center" },
  label: { fontSize: 11.5, fontWeight: "700", color: theme.inkSoft, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 },
  input: {
    borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingHorizontal: 13, paddingVertical: 11,
    fontSize: 14, marginBottom: 16, backgroundColor: theme.surface, color: theme.ink,
  },
  primaryBtn: { backgroundColor: theme.blue, borderRadius: theme.radiusSm, paddingVertical: 13, alignItems: "center", marginTop: 4 },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 14.5 },
  link: { color: theme.blue, fontWeight: "600", fontSize: 13 },
  error: { color: theme.coral, fontSize: 12.5, marginBottom: 10 },
  demoBox: { marginTop: 32, borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 16 },
  demoTitle: { fontSize: 11.5, fontWeight: "700", color: theme.inkSoft, marginBottom: 4, textTransform: "uppercase" },
  demoLine: { fontSize: 12, color: theme.inkSoft, marginTop: 2, fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
});
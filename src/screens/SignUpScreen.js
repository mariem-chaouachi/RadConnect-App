import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Logo from "../components/Logo";
import LanguageSwitch from "../components/LanguageSwitch";
import { theme } from "../theme";
import { uid } from "../data/seed";

export default function SignUpScreen({ users, onSignUp, onGoToSignIn, t, lang, setLang }) {
  const [role, setRole] = useState("technician");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!firstName.trim() || !lastName.trim() || !licenseId.trim() || !specialization.trim() || !email.trim() || !phone.trim() || !password) {
      setError(t("signup.errFillAll"));
      return;
    }
    if (password.length < 6) {
      setError(t("signup.errPasswordLength"));
      return;
    }
    if (password !== confirm) {
      setError(t("signup.errPasswordMismatch"));
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError(t("signup.errEmailExists"));
      return;
    }
    setError("");
    const initials = (firstName[0] + lastName[0]).toUpperCase();
    onSignUp({
      id: uid(), role, firstName: firstName.trim(), lastName: lastName.trim(),
      licenseId: licenseId.trim(), specialization: specialization.trim(),
      email: email.trim(), phone: phone.trim(), password, initials,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.paper }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 }}>
          <LanguageSwitch lang={lang} setLang={setLang} />
        </View>

        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Logo size={44} />
          <Text style={styles.title}>{t("signup.title")}</Text>
          <Text style={styles.subtitle}>{t("signup.subtitle")}</Text>
        </View>

        <Text style={styles.label}>{t("signup.iAmA")}</Text>
        <View style={styles.roleRow}>
          {["technician", "radiologist"].map((r) => (
            <TouchableOpacity
              key={r} onPress={() => setRole(r)}
              style={[styles.roleBtn, role === r && { backgroundColor: theme.blue, borderColor: theme.blue }]}
            >
              <Text style={[styles.roleBtnText, role === r && { color: "#fff" }]}>
                {r === "technician" ? t("role.technicianLong") : t("role.radiologistLong")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>{t("signup.firstName")}</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Marym" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>{t("signup.lastName")}</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Ben Salah" />
          </View>
        </View>

        <Text style={styles.label}>{role === "radiologist" ? t("signup.licenseIdRad") : t("signup.licenseIdTech")}</Text>
        <TextInput style={styles.input} value={licenseId} onChangeText={setLicenseId} placeholder="e.g. RAD-1187" autoCapitalize="characters" />

        <Text style={styles.label}>{role === "radiologist" ? t("signup.specializationRad") : t("signup.specializationTech")}</Text>
        <TextInput
          style={styles.input} value={specialization} onChangeText={setSpecialization}
          placeholder={role === "radiologist" ? t("signup.specializationPlaceholderRad") : t("signup.specializationPlaceholderTech")}
        />

        <Text style={styles.label}>{t("signup.email")}</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="name@hospital.tn" autoCapitalize="none" keyboardType="email-address" />

        <Text style={styles.label}>{t("signup.phone")}</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+216 20 000 000" keyboardType="phone-pad" />

        <Text style={styles.label}>{t("signup.password")}</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder={t("signup.passwordPlaceholder")} secureTextEntry />

        <Text style={styles.label}>{t("signup.confirmPassword")}</Text>
        <TextInput style={styles.input} value={confirm} onChangeText={setConfirm} placeholder={t("signup.confirmPasswordPlaceholder")} secureTextEntry />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={submit}>
          <Text style={styles.primaryBtnText}>{t("signup.createAccount")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToSignIn} style={{ marginTop: 16, alignItems: "center", marginBottom: 20 }}>
          <Text style={styles.link}>{t("signup.alreadyHaveAccount")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 32, maxWidth: 460, width: "100%", alignSelf: "center" },
  title: { fontSize: 19, fontWeight: "700", color: theme.ink, marginTop: 8 },
  subtitle: { fontSize: 12.5, color: theme.inkSoft, marginTop: 3 },
  label: { fontSize: 11.5, fontWeight: "700", color: theme.inkSoft, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 },
  input: {
    borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingHorizontal: 13, paddingVertical: 11,
    fontSize: 14, marginBottom: 14, backgroundColor: theme.surface, color: theme.ink,
  },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  roleRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  roleBtn: { flex: 1, borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingVertical: 10, alignItems: "center", backgroundColor: theme.surface },
  roleBtnText: { fontSize: 12.5, fontWeight: "700", color: theme.inkSoft, textAlign: "center" },
  primaryBtn: { backgroundColor: theme.blue, borderRadius: theme.radiusSm, paddingVertical: 13, alignItems: "center", marginTop: 4 },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 14.5 },
  link: { color: theme.blue, fontWeight: "600", fontSize: 13 },
  error: { color: theme.coral, fontSize: 12.5, marginBottom: 10 },
});

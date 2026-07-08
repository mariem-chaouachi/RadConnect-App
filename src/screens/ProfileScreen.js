import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";
import { Avatar, Field } from "../components/UI";
import LanguageSwitch from "../components/LanguageSwitch";

export default function ProfileScreen({ user, onSave, onSignOut, isWide, t, lang, setLang }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [specialization, setSpecialization] = useState(user.specialization);
  const [phone, setPhone] = useState(user.phone);
  const [saved, setSaved] = useState(false);

  const isRadiologist = user.role === "radiologist";
  const dirty = firstName !== user.firstName || lastName !== user.lastName
    || specialization !== user.specialization || phone !== user.phone;

  const save = () => {
    const initials = (firstName[0] + lastName[0]).toUpperCase();
    onSave({ firstName, lastName, specialization, phone, initials });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const confirmSignOut = () => {
    Alert.alert(
      t("profile.signOutConfirmTitle"),
      t("profile.signOutConfirmMessage"),
      [
        { text: t("profile.cancel"), style: "cancel" },
        { text: t("signOut"), style: "destructive", onPress: onSignOut },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: isWide ? 24 : 16, maxWidth: 480, width: "100%", alignSelf: "center" }}>
      <Text style={styles.heading}>{t("profile.heading")}</Text>

      <View style={styles.headerCard}>
        <Avatar initials={user.initials} role={user.role} size={56} />
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{isRadiologist ? t("role.radiologist") : t("role.technician")}</Text>
        </View>
      </View>

      <Field label={t("profile.language")}>
        <LanguageSwitch lang={lang} setLang={setLang} />
      </Field>

      <View style={styles.row}>
        <View style={styles.half}>
          <Field label={t("signup.firstName")}>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
          </Field>
        </View>
        <View style={styles.half}>
          <Field label={t("signup.lastName")}>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
          </Field>
        </View>
      </View>

      <Field label={isRadiologist ? t("signup.licenseIdRad") : t("signup.licenseIdTech")}>
        <View style={styles.readOnlyBox}>
          <Text style={styles.readOnlyText}>{user.licenseId}</Text>
          <Ionicons name="lock-closed-outline" size={13} color={theme.inkSoft} />
        </View>
      </Field>

      <Field label={isRadiologist ? t("signup.specializationRad") : t("signup.specializationTech")}>
        <TextInput style={styles.input} value={specialization} onChangeText={setSpecialization} />
      </Field>

      <Field label={t("signup.email")}>
        <View style={styles.readOnlyBox}>
          <Text style={styles.readOnlyText}>{user.email}</Text>
          <Ionicons name="lock-closed-outline" size={13} color={theme.inkSoft} />
        </View>
      </Field>

      <Field label={t("signup.phone")}>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      </Field>

      <TouchableOpacity
        disabled={!dirty}
        onPress={save}
        style={[styles.saveBtn, { backgroundColor: dirty ? theme.blue : theme.line }]}
      >
        <Ionicons name={saved ? "checkmark" : "save-outline"} size={15} color="#fff" />
        <Text style={styles.saveBtnText}>{saved ? t("profile.saved") : t("profile.saveChanges")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={confirmSignOut} style={styles.signOutBtn}>
        <Ionicons name="log-out-outline" size={15} color={theme.coral} />
        <Text style={styles.signOutText}>{t("signOut")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "700", color: theme.ink, marginBottom: 16 },
  headerCard: { alignItems: "center", marginBottom: 22 },
  name: { fontSize: 16, fontWeight: "700", color: theme.ink, marginTop: 10 },
  roleBadge: { backgroundColor: theme.blueSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  roleBadgeText: { fontSize: 11.5, fontWeight: "700", color: theme.blue },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  input: {
    borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingHorizontal: 13, paddingVertical: 11,
    fontSize: 14, backgroundColor: theme.surface, color: theme.ink,
  },
  readOnlyBox: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: theme.line,
    borderRadius: theme.radiusSm, paddingHorizontal: 13, paddingVertical: 11, backgroundColor: "#F1F2EF",
  },
  readOnlyText: { fontSize: 14, color: theme.inkSoft },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: theme.radiusSm, paddingVertical: 13, marginTop: 6 },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14, marginLeft: 6 },
  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 16, marginBottom: 30, padding: 10 },
  signOutText: { color: theme.coral, fontWeight: "700", fontSize: 13.5, marginLeft: 6 },
});
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

export function Pill({ label, fg, bg, icon }) {
  return (
    <View style={[styles.pill, { backgroundColor: theme[bg] }]}>
      {icon && <Ionicons name={icon} size={11} color={theme[fg]} style={{ marginRight: 3 }} />}
      <Text style={[styles.pillText, { color: theme[fg] }]}>{label}</Text>
    </View>
  );
}

export function Avatar({ initials, role, size = 34 }) {
  const isDoctor = role === "radiologist";
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: isDoctor ? theme.blueSoft : theme.line,
        alignItems: "center", justifyContent: "center",
      }}
    >
      <Text style={{ color: isDoctor ? theme.blue : theme.inkSoft, fontWeight: "700", fontSize: size * 0.36 }}>
        {initials}
      </Text>
    </View>
  );
}

export function Field({ label, children }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function ActionBtn({ onClick, label, icon, primary }) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.actionBtn,
        primary ? { backgroundColor: theme.blue, borderColor: theme.blue } : { backgroundColor: theme.surface, borderColor: theme.line },
      ]}
    >
      {icon && <Ionicons name={icon} size={14} color={primary ? "#fff" : theme.ink} style={{ marginRight: 5 }} />}
      <Text style={{ color: primary ? "#fff" : theme.ink, fontWeight: "600", fontSize: 12.5 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function EmptyState({ label, sub }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 50, paddingHorizontal: 20 }}>
      <Ionicons name="document-text-outline" size={26} color={theme.inkSoft} style={{ marginBottom: 8, opacity: 0.7 }} />
      <Text style={{ fontWeight: "700", color: theme.ink, fontSize: 14 }}>{label}</Text>
      <Text style={{ fontSize: 12.5, color: theme.inkSoft, marginTop: 4, textAlign: "center" }}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row", alignItems: "center", borderRadius: 999,
    paddingHorizontal: 9, paddingVertical: 3, marginRight: 6, marginBottom: 4,
  },
  pillText: { fontSize: 11.5, fontWeight: "700" },
  fieldLabel: {
    fontSize: 11.5, fontWeight: "700", color: theme.inkSoft, marginBottom: 6,
    textTransform: "uppercase", letterSpacing: 0.4,
  },
  actionBtn: {
    flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, marginLeft: 6,
  },
});

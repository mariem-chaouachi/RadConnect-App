import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";
import { LANGUAGES } from "../i18n/translations";

export default function LanguageSwitch({ lang, setLang, style }) {
  return (
    <View style={[styles.wrap, style]}>
      {LANGUAGES.map((l) => (
        <TouchableOpacity
          key={l.code} onPress={() => setLang(l.code)}
          style={[styles.btn, lang === l.code && { backgroundColor: theme.blue }]}
        >
          <Text style={[styles.btnText, lang === l.code && { color: "#fff" }]}>{l.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", backgroundColor: theme.line, borderRadius: 999, padding: 2 },
  btn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  btnText: { fontSize: 11.5, fontWeight: "700", color: theme.inkSoft },
});

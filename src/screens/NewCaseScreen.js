import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, MODALITIES, PRIORITIES, QUESTION_LABELS } from "../theme";
import { Field } from "../components/UI";

export default function NewCaseScreen({ onSubmit, onCancel, isWide, t }) {
  const [modality, setModality] = useState("xray");
  const [patientId, setPatientId] = useState("");
  const [priority, setPriority] = useState("normal");
  const [qTypes, setQTypes] = useState([]);
  const [note, setNote] = useState("");

  const toggleQ = (k) => setQTypes((qs) => (qs.includes(k) ? qs.filter((x) => x !== k) : [...qs, k]));

  return (
    <ScrollView contentContainerStyle={{ padding: isWide ? 24 : 16, maxWidth: 560, width: "100%", alignSelf: "center" }}>
      <Text style={styles.heading}>{t("newcase.heading")}</Text>

      <Field label={t("newcase.modality")}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {MODALITIES.map((m) => (
            <TouchableOpacity
              key={m.id} onPress={() => setModality(m.id)}
              style={[styles.chip, modality === m.id && { backgroundColor: theme.blue, borderColor: theme.blue }]}
            >
              <Text style={[styles.chipText, modality === m.id && { color: "#fff" }]}>{t(`modality.${m.id}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <Field label={t("newcase.patientId")}>
        <TextInput style={styles.input} value={patientId} onChangeText={setPatientId} placeholder={t("newcase.patientIdPlaceholder")} autoCapitalize="characters" />
      </Field>

      <Field label={t("newcase.priority")}>
        <View style={{ flexDirection: "row" }}>
          {Object.entries(PRIORITIES).map(([key, p]) => (
            <TouchableOpacity
              key={key} onPress={() => setPriority(key)}
              style={[styles.priorityChip, { borderColor: priority === key ? theme[p.fg] : theme.line, backgroundColor: priority === key ? theme[p.bg] : theme.surface }]}
            >
              <Text style={{ color: priority === key ? theme[p.fg] : theme.inkSoft, fontWeight: "700", fontSize: 12.5 }}>{t(`priority.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <Field label={t("newcase.questions")}>
        <View>
          {Object.keys(QUESTION_LABELS).map((key) => (
            <TouchableOpacity key={key} onPress={() => toggleQ(key)} style={styles.checkRow}>
              <Ionicons name={qTypes.includes(key) ? "checkbox" : "square-outline"} size={19} color={qTypes.includes(key) ? theme.blue : theme.inkSoft} />
              <Text style={styles.checkLabel}>{t(`question.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <Field label={t("newcase.note")}>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]} value={note} onChangeText={setNote}
          placeholder={t("newcase.notePlaceholder")} multiline
        />
      </Field>

      <View style={{ flexDirection: "row", marginTop: 8, marginBottom: 30 }}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={{ fontWeight: "700", fontSize: 13, color: theme.ink }}>{t("newcase.cancel")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!patientId.trim()}
          onPress={() => onSubmit({ modality, priority, note, questionTypes: qTypes })}
          style={[styles.submitBtn, { backgroundColor: patientId.trim() ? theme.blue : theme.line }]}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 4 }}>{t("newcase.createCase")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "700", color: theme.ink, marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingHorizontal: 13, paddingVertical: 11,
    fontSize: 14, backgroundColor: theme.surface, color: theme.ink,
  },
  chip: { borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingHorizontal: 12, paddingVertical: 8, marginRight: 6, marginBottom: 6, backgroundColor: theme.surface },
  chipText: { fontSize: 12.5, fontWeight: "700", color: theme.ink },
  priorityChip: { borderWidth: 1, borderRadius: theme.radiusSm, paddingHorizontal: 14, paddingVertical: 8, marginRight: 6 },
  checkRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, padding: 10, marginBottom: 6, backgroundColor: theme.surface },
  checkLabel: { fontSize: 13, marginLeft: 9, color: theme.ink, flex: 1 },
  cancelBtn: { borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingHorizontal: 16, paddingVertical: 11, marginRight: 8, backgroundColor: theme.surface },
  submitBtn: { flexDirection: "row", alignItems: "center", borderRadius: theme.radiusSm, paddingHorizontal: 16, paddingVertical: 11 },
});

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, PRIORITIES, STATUSES, MODALITIES } from "../theme";
import { Pill, EmptyState } from "../components/UI";
import { timeAgo } from "../data/seed";

// "Ball in whose court" — true if the radiologist still owes a response on this case:
// unanswered structured questions, no messages yet, or the technician sent the last message.
function needsRadiologistResponse(c, messages, users) {
  if (c.questions.some((q) => !q.answered)) return true;
  const caseMessages = messages.filter((m) => m.caseId === c.id).sort((a, b) => a.sentAt - b.sentAt);
  if (caseMessages.length === 0) return true;
  const last = caseMessages[caseMessages.length - 1];
  const sender = users.find((u) => u.id === last.senderId);
  return sender?.role !== "radiologist";
}

function CaseRow({ c, onOpen, t, role, messages, users }) {
  const p = PRIORITIES[c.priority];
  const s = STATUSES[c.status];
  const modality = MODALITIES.find((m) => m.id === c.modality);
  const openQ = c.questions.filter((q) => !q.answered).length;
  const isEmergency = c.priority === "emergency" && c.status !== "completed";
  const showBallInCourt = role === "radiologist" && c.status !== "completed";
  const awaitingRadiologist = showBallInCourt && needsRadiologistResponse(c, messages, users);

  return (
    <TouchableOpacity
      onPress={() => onOpen(c.id)}
      style={[
        styles.row,
        isEmergency && { backgroundColor: theme.coralSoft, borderColor: theme.coral, borderWidth: 1.5 },
      ]}
    >
      <View style={[styles.rowIcon, isEmergency && { backgroundColor: "#E7C6BB" }]}>
        <Ionicons name="scan-outline" size={18} color={isEmergency ? theme.coral : theme.inkSoft} />
      </View>
      <View style={{ flex: 1, marginRight: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.caseId, isEmergency && { color: theme.coral }]}>{c.id}</Text>
          <Text style={[styles.modality, isEmergency && { color: theme.coral }]}>  ·  {t(`modality.${modality?.id}`)}</Text>
        </View>
        <Text style={[styles.note, isEmergency && { color: theme.coral }]} numberOfLines={1}>{c.note}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
          {openQ > 0 && <Pill label={t("dashboard.openQuestions", { n: openQ })} fg="inkSoft" bg="line" icon="chatbubble-outline" />}
          {showBallInCourt && (
            <Pill
              label={awaitingRadiologist ? t("dashboard.awaitingYou") : t("dashboard.awaitingTech")}
              fg={awaitingRadiologist ? "blue" : "sage"}
              bg={awaitingRadiologist ? "blueSoft" : "sageSoft"}
            />
          )}
          <Pill label={t(`status.${c.status}`)} fg={s.fg} bg={s.bg} />
          <Pill label={t(`priority.${c.priority}`)} fg={p.fg} bg={p.bg} />
        </View>
      </View>
      <Text style={[styles.time, isEmergency && { color: theme.coral }]}>{timeAgo(c.createdAt)}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ cases, statusFilter, setStatusFilter, onOpen, isWide, role, t, messages, users }) {
  const filtered = cases.filter((c) => {
    if (role === "radiologist") {
      if (statusFilter === "all") return true;
      if (statusFilter === "completed") return c.status === "completed";
      if (statusFilter === "open") return c.status !== "completed" && needsRadiologistResponse(c, messages, users);
      if (statusFilter === "pending") return c.status !== "completed" && !needsRadiologistResponse(c, messages, users);
      return true;
    }
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });
  const emergency = filtered.filter((c) => c.priority === "emergency" && c.status !== "completed");
  const rest = filtered
    .filter((c) => !(c.priority === "emergency" && c.status !== "completed"))
    .sort((a, b) => (a.priority === "urgent" ? -1 : 1) - (b.priority === "urgent" ? -1 : 1));

  const filterTabs = role === "radiologist"
    ? ["open", "pending", "completed", "all"]
    : ["all", "pending", "active", "completed"];

  return (
    <ScrollView contentContainerStyle={{ padding: isWide ? 24 : 16, maxWidth: 720, width: "100%", alignSelf: "center" }}>
      <Text style={styles.heading}>{t("dashboard.heading")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {filterTabs.map((s) => (
          <TouchableOpacity
            key={s} onPress={() => setStatusFilter(s)}
            style={[styles.filterBtn, statusFilter === s && { backgroundColor: theme.ink, borderColor: theme.ink }]}
          >
            <Text style={[styles.filterText, statusFilter === s && { color: "#fff" }]}>
              {t(`filter.${s}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {emergency.length > 0 && (
        <View style={{ marginBottom: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Ionicons name="alert-circle" size={16} color={theme.coral} />
            <Text style={styles.emergencyTitle}>  {t("dashboard.emergencyTitle")}</Text>
            <Text style={styles.emergencySub}>  {t("dashboard.emergencySub")}</Text>
          </View>
          {emergency.map((c) => <CaseRow key={c.id} c={c} onOpen={onOpen} t={t} role={role} messages={messages} users={users} />)}
        </View>
      )}

      {rest.length > 0
        ? rest.map((c) => <CaseRow key={c.id} c={c} onOpen={onOpen} t={t} role={role} messages={messages} users={users} />)
        : emergency.length === 0 && (
          <EmptyState label={t("dashboard.emptyLabel")} sub={t("dashboard.emptySub")} />
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "700", color: theme.ink, marginBottom: 14 },
  filterBtn: {
    borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surface, borderRadius: 999,
    paddingHorizontal: 13, paddingVertical: 7, marginRight: 8,
  },
  filterText: { fontSize: 12.5, fontWeight: "700", color: theme.inkSoft },
  emergencyTitle: { fontSize: 13.5, fontWeight: "700", color: theme.coral },
  emergencySub: { fontSize: 12, color: theme.coral },
  row: {
    flexDirection: "row", alignItems: "center", backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line,
    borderRadius: 10, padding: 12, marginBottom: 8,
  },
  rowIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: theme.line, alignItems: "center", justifyContent: "center", marginRight: 12 },
  caseId: { fontSize: 13, fontWeight: "700", color: theme.ink },
  modality: { fontSize: 12.5, color: theme.inkSoft },
  note: { fontSize: 12.5, color: theme.inkSoft, marginTop: 2 },
  time: { fontSize: 11.5, color: theme.inkSoft },
});
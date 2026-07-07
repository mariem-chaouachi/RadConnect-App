import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";
import { EmptyState } from "../components/UI";
import { timeAgo } from "../data/seed";

export default function NotificationsScreen({ items, onRead, onOpen, isWide, t }) {
  return (
    <ScrollView contentContainerStyle={{ padding: isWide ? 24 : 16, maxWidth: 560, width: "100%", alignSelf: "center" }}>
      <Text style={styles.heading}>{t("notifications.heading")}</Text>
      {items.length === 0 && <EmptyState label={t("notifications.emptyLabel")} sub={t("notifications.emptySub")} />}
      {items.slice().sort((a, b) => b.createdAt - a.createdAt).map((n) => (
        <TouchableOpacity
          key={n.id} onPress={() => { onRead(n.id); onOpen(n.caseId); }}
          style={[styles.row, { backgroundColor: n.read ? theme.surface : theme.blueSoft }]}
        >
          <Ionicons
            name={n.type === "emergency" ? "alert-circle" : "chatbubble-ellipses"}
            size={16} color={n.type === "emergency" ? theme.coral : theme.blue} style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: n.read ? "500" : "700", color: theme.ink }}>{n.message}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
              <Text style={{ fontSize: 11.5, color: theme.inkSoft }}>{timeAgo(n.createdAt)}</Text>
              {!n.read && n.count > 1 && (
                <Text style={{ fontSize: 11.5, color: theme.blue, fontWeight: "700", marginLeft: 6 }}>· {t("notifications.updates", { n: n.count })}</Text>
              )}
            </View>
          </View>
          {!n.read && <View style={styles.dot} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "700", color: theme.ink, marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "flex-start", borderWidth: 1, borderColor: theme.line, borderRadius: 10, padding: 12, marginBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.blue, marginTop: 5 },
});

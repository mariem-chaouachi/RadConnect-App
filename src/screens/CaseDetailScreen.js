import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, PRIORITIES, STATUSES } from "../theme";
import { Pill, ActionBtn } from "../components/UI";
import { timeAgo } from "../data/seed";

export default function CaseDetailScreen({
  c, role, currentUser, users, messages, auditLogs, onBack, onSend, onAnswer,
  onSetStatus, onAssignSelf, onRequestImage, onAddImage, isWide, t,
}) {
  const [text, setText] = useState("");
  const [showAudit, setShowAudit] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // { text, senderName }
  const scrollRef = useRef(null);
  const p = PRIORITIES[c.priority];
  const s = STATUSES[c.status];
  const openQuestions = c.questions.filter((q) => !q.answered);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  const findUser = (id) => users.find((u) => u.id === id);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text, replyingTo ? { text: replyingTo.text, isQuestion: false } : null);
    setText("");
    setReplyingTo(null);
  };

  const confirmComplete = () => {
    Alert.alert(
      t("dashboard.confirmCompleteTitle"),
      t("dashboard.confirmCompleteMessage", { id: c.id }),
      [
        { text: t("profile.cancel"), style: "cancel" },
        { text: t("casedetail.markCompleted"), style: "default", onPress: () => onSetStatus("completed") },
      ]
    );
  };

  const handleAddImage = () => {
    onAddImage(`${t("casedetail.imageLabelPrefix")} ${c.images.length + 1}`);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: isWide ? 24 : 14, maxWidth: 900, width: "100%", alignSelf: "center" }}>
      <TouchableOpacity onPress={onBack} style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Ionicons name="chevron-back" size={15} color={theme.inkSoft} />
        <Text style={{ color: theme.inkSoft, fontWeight: "700", fontSize: 12.5 }}>{t("casedetail.back")}</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
        <Text style={styles.caseId}>{c.id}</Text>
        <Pill label={t(`priority.${c.priority}`)} fg={p.fg} bg={p.bg} />
        <Pill label={t(`status.${c.status}`)} fg={s.fg} bg={s.bg} />
      </View>
      <Text style={styles.note}>{c.note}</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 14 }}>
        {role === "radiologist" && !c.assignedRadiologist && (
          <ActionBtn onClick={onAssignSelf} label={t("casedetail.assignToMe")} icon="person-add-outline" />
        )}
        {role === "radiologist" && c.status !== "completed" && !c.imageRequested && (
          <ActionBtn onClick={onRequestImage} label={t("casedetail.requestImage")} icon="image-outline" />
        )}
        {c.status !== "completed" && (
          <ActionBtn onClick={confirmComplete} label={t("casedetail.markCompleted")} icon="checkmark-circle-outline" primary />
        )}
      </View>

      <View style={{ flexDirection: isWide ? "row" : "column", gap: 14 }}>
        {/* Imaging panel */}
        <View style={[styles.panel, isWide ? { flex: 1 } : {}]}>
          <Text style={styles.panelLabel}>{t("casedetail.imaging")}</Text>

          {c.imageRequested && (
            <View style={styles.requestBanner}>
              <Ionicons name="image-outline" size={14} color={theme.amber} />
              <Text style={styles.requestBannerText}>{t("casedetail.imageRequestedBanner")}</Text>
            </View>
          )}

          {c.images.length === 0 && !c.imageRequested ? (
            <Text style={{ color: theme.inkSoft, fontSize: 12.5, marginBottom: 8 }}>{t("casedetail.noImages")}</Text>
          ) : (
            c.images.map((img) => (
              <View key={img.id} style={styles.imageBox}>
                <Ionicons name="image-outline" size={26} color="#8A93A3" />
                <Text style={styles.imageLabel}>{img.label}</Text>
                <TouchableOpacity style={styles.zoomBtn}>
                  <Ionicons name="search" size={13} color="#fff" />
                </TouchableOpacity>
              </View>
            ))
          )}

          {role === "technician" && c.status !== "completed" && (
            <TouchableOpacity onPress={handleAddImage} style={styles.addImageBtn}>
              <Ionicons name="add" size={15} color={theme.blue} />
              <Text style={styles.addImageText}>{t("casedetail.addImage")}</Text>
            </TouchableOpacity>
          )}

          <Text style={{ fontSize: 11, color: theme.inkSoft, marginTop: 6 }}>{t("casedetail.previewNote")}</Text>
        </View>

        {/* Conversation panel */}
        <View style={[styles.panel, isWide ? { flex: 1.3 } : {}]}>
          <Text style={styles.panelLabel}>{t("casedetail.conversation")}</Text>

          {openQuestions.map((q) => (
            <View key={q.id} style={styles.questionBox}>
              <Text style={styles.questionText}>{t(`question.${q.type}`)}</Text>
              {role === "radiologist" ? (
                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <TouchableOpacity onPress={() => onAnswer(q.id, t("casedetail.yes") + ".", t(`question.${q.type}`))} style={styles.yesBtn}>
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{t("casedetail.yes")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onAnswer(q.id, t("casedetail.no") + ".", t(`question.${q.type}`))} style={styles.noBtn}>
                    <Text style={{ color: theme.blue, fontWeight: "700", fontSize: 12 }}>{t("casedetail.no")}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={{ fontSize: 11.5, color: theme.inkSoft, marginTop: 4 }}>{t("casedetail.waiting")}</Text>
              )}
            </View>
          ))}

          <ScrollView ref={scrollRef} style={{ maxHeight: 260, marginTop: 6 }}>
            {messages.length === 0 && <Text style={{ color: theme.inkSoft, fontSize: 12.5, textAlign: "center", marginTop: 16 }}>{t("casedetail.noMessages")}</Text>}
            {messages.map((m) => {
              const mine = m.senderId === currentUser.id;
              const sender = findUser(m.senderId);
              return (
                <View key={m.id} style={{ alignItems: mine ? "flex-end" : "flex-start", marginBottom: 10 }}>
                  <View style={{ flexDirection: mine ? "row-reverse" : "row", alignItems: "flex-end", maxWidth: "88%" }}>
                    <View>
                      {m.replyTo && (
                        <View style={[styles.quoteBar, { alignSelf: mine ? "flex-end" : "flex-start" }]}>
                          <View style={styles.quoteStripe} />
                          <Text style={styles.quoteText} numberOfLines={1}>
                            {m.replyTo.isQuestion ? t("casedetail.questionPrefix") : ""}{m.replyTo.text}
                          </Text>
                        </View>
                      )}
                      <View style={[styles.bubble, { backgroundColor: mine ? theme.blue : theme.line }]}>
                        <Text style={{ color: mine ? "#fff" : theme.ink, fontSize: 13 }}>{m.content}</Text>
                      </View>
                      <Text style={[styles.bubbleMeta, { textAlign: mine ? "right" : "left" }]}>{sender?.firstName} · {timeAgo(m.sentAt)}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setReplyingTo({ text: m.content, senderName: sender?.firstName })}
                      style={styles.replyIconBtn}
                    >
                      <Ionicons name="arrow-undo-outline" size={14} color={theme.inkSoft} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {replyingTo && (
            <View style={styles.replyPreview}>
              <View style={styles.quoteStripe} />
              <Text style={styles.replyPreviewText} numberOfLines={1}>
                {t("casedetail.replyingTo", { name: replyingTo.senderName, text: replyingTo.text })}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close" size={15} color={theme.inkSoft} />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TextInput
              style={styles.msgInput} value={text} onChangeText={setText}
              placeholder={t("casedetail.writeMessage")} onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Ionicons name="send" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={() => setShowAudit((v) => !v)} style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
        <Ionicons name={showAudit ? "chevron-up" : "chevron-down"} size={14} color={theme.inkSoft} />
        <Text style={{ color: theme.inkSoft, fontWeight: "700", fontSize: 12.5, marginLeft: 4 }}>{t("casedetail.auditTrail", { n: auditLogs.length })}</Text>
      </TouchableOpacity>
      {showAudit && (
        <View style={styles.auditBox}>
          {auditLogs.slice().sort((a, b) => a.createdAt - b.createdAt).map((a, i) => {
            const u = findUser(a.userId);
            return (
              <View key={a.id} style={[styles.auditRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.line }]}>
                <Text style={styles.auditTime}>{new Date(a.createdAt).toLocaleTimeString()}</Text>
                <Text style={styles.auditUser}>{u?.firstName} {u?.lastName}</Text>
                <Text style={styles.auditAction}>{t(`audit.${a.action}`)}</Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  caseId: { fontSize: 15, fontWeight: "700", color: theme.ink, marginRight: 8 },
  note: { fontSize: 13, color: theme.inkSoft, marginBottom: 12 },
  panel: { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line, borderRadius: theme.radius, padding: 14, marginBottom: 14 },
  panelLabel: { fontSize: 11.5, fontWeight: "700", color: theme.inkSoft, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 },
  requestBanner: { flexDirection: "row", alignItems: "center", backgroundColor: theme.amberSoft, borderRadius: 8, padding: 8, marginBottom: 10 },
  requestBannerText: { fontSize: 12, color: theme.amber, marginLeft: 6, flexShrink: 1 },
  imageBox: { backgroundColor: "#161C26", borderRadius: 10, paddingVertical: 30, alignItems: "center", marginBottom: 10 },
  imageLabel: { color: "#C7CDD3", fontSize: 12, marginTop: 6 },
  zoomBtn: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 6, padding: 5 },
  addImageBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.blue, borderStyle: "dashed", borderRadius: 8, paddingVertical: 8, marginBottom: 4 },
  addImageText: { color: theme.blue, fontWeight: "700", fontSize: 12.5, marginLeft: 4 },
  questionBox: { backgroundColor: theme.blueSoft, borderRadius: 10, padding: 10, marginBottom: 8 },
  questionText: { fontSize: 12.5, fontWeight: "700", color: theme.blue },
  yesBtn: { backgroundColor: theme.blue, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5, marginRight: 6 },
  noBtn: { borderWidth: 1, borderColor: theme.blue, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: theme.surface },
  bubble: { borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8, maxWidth: "100%" },
  bubbleMeta: { fontSize: 10.5, color: theme.inkSoft, marginTop: 2 },
  quoteBar: { flexDirection: "row", alignItems: "center", backgroundColor: theme.line, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginBottom: 3, maxWidth: 220 },
  quoteStripe: { width: 3, height: 14, borderRadius: 2, backgroundColor: theme.blue, marginRight: 6 },
  quoteText: { fontSize: 11, color: theme.inkSoft, flexShrink: 1 },
  replyIconBtn: { padding: 6, opacity: 0.7 },
  replyPreview: { flexDirection: "row", alignItems: "center", backgroundColor: theme.blueSoft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginTop: 8 },
  replyPreviewText: { flex: 1, fontSize: 12, color: theme.blueDark, marginLeft: 2, marginRight: 6 },
  msgInput: { flex: 1, borderWidth: 1, borderColor: theme.line, borderRadius: theme.radiusSm, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, backgroundColor: theme.surface },
  sendBtn: { backgroundColor: theme.blue, borderRadius: theme.radiusSm, width: 38, alignItems: "center", justifyContent: "center", marginLeft: 8 },
  auditBox: { borderWidth: 1, borderColor: theme.line, borderRadius: 10, backgroundColor: theme.surface, marginTop: 8, marginBottom: 30 },
  auditRow: { flexDirection: "row", alignItems: "center", padding: 10, flexWrap: "wrap" },
  auditTime: { fontSize: 11.5, color: theme.inkSoft, width: 90 },
  auditUser: { fontSize: 12, fontWeight: "700", color: theme.ink, marginRight: 6 },
  auditAction: { fontSize: 12, color: theme.inkSoft, textTransform: "capitalize" },
});
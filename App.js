import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import Logo from "./src/components/Logo";
import { Avatar } from "./src/components/UI";
import LanguageSwitch from "./src/components/LanguageSwitch";
import { theme } from "./src/theme";
import { DEMO_USERS, seedCases, seedMessages, seedAudit, uid, now } from "./src/data/seed";
import { translate } from "./src/i18n/translations";

import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import NewCaseScreen from "./src/screens/NewCaseScreen";
import CaseDetailScreen from "./src/screens/CaseDetailScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 760; // tablet / desktop-ish breakpoint

  const [lang, setLang] = useState("en");
  const t = (key, vars) => translate(lang, key, vars);

  const [users, setUsers] = useState(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("signIn"); // signIn | signUp

  const techId = DEMO_USERS[0].id;
  const radId = DEMO_USERS[1].id;
  const [cases, setCases] = useState(() => seedCases(techId, radId));
  const [messages, setMessages] = useState(() => seedMessages(techId, radId));
  const [audit, setAudit] = useState(() => seedAudit(techId, radId));
  const [notifications, setNotifications] = useState([
    { id: uid(), forRole: "radiologist", caseId: "RAD-2026-0731", type: "emergency", message: "New emergency case: RAD-2026-0731", read: false, count: 1, createdAt: now() - 1000 * 60 * 8 },
    { id: uid(), forRole: "technician", caseId: "RAD-2026-0731", type: "reply", message: "Dr. Sami Trabelsi replied on RAD-2026-0731", read: false, count: 1, createdAt: now() - 1000 * 60 * 5 },
  ]);

  const [view, setView] = useState("dashboard");
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (currentUser?.role === "radiologist") setStatusFilter("open");
  }, [currentUser?.id]);

  const addAudit = (caseId, userId, action) => setAudit((a) => [...a, { id: uid(), caseId, userId, action, createdAt: now() }]);
  const addNotification = (forRole, caseId, type, message) =>
    setNotifications((n) => {
      const idx = n.findIndex((x) => x.forRole === forRole && x.caseId === caseId);
      if (idx === -1) {
        return [{ id: uid(), forRole, caseId, type, message, read: false, count: 1, createdAt: now() }, ...n];
      }
      const existing = n[idx];
      const updated = {
        ...existing,
        type, message, read: false,
        count: existing.read ? 1 : existing.count + 1, // fresh cycle if it was already read, else keep tallying
        createdAt: now(),
      };
      const rest = n.filter((_, i) => i !== idx);
      return [updated, ...rest];
    });

  if (!currentUser) {
    return authScreen === "signIn" ? (
      <SignInScreen users={users} onSignIn={setCurrentUser} onGoToSignUp={() => setAuthScreen("signUp")} t={t} lang={lang} setLang={setLang} />
    ) : (
      <SignUpScreen
        users={users}
        onGoToSignIn={() => setAuthScreen("signIn")}
        onSignUp={(u) => { setUsers((arr) => [...arr, u]); setCurrentUser(u); }}
        t={t} lang={lang} setLang={setLang}
      />
    );
  }

  const role = currentUser.role;
  const unreadCount = notifications.filter((n) => n.forRole === role && !n.read).length;
  const activeCase = cases.find((c) => c.id === activeCaseId) || null;

  function createCase(form) {
    const id = `RAD-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const newCase = {
      id, modality: form.modality, priority: form.priority, status: "pending",
      createdBy: currentUser.id, assignedRadiologist: null, createdAt: now(), completedAt: null,
      note: form.note, questions: form.questionTypes.map((qt) => ({ id: uid(), type: qt, answered: false, answerText: null, answeredBy: null })),
      images: [],
    };
    setCases((c) => [newCase, ...c]);
    addAudit(id, currentUser.id, "created");
    addNotification("radiologist", id, form.priority, `New ${form.priority} case: ${id}`);
    setActiveCaseId(id);
    setView("caseDetail");
  }

  function sendMessage(caseId, content, replyTo = null) {
    if (!content.trim()) return;
    setMessages((m) => [...m, { id: uid(), caseId, senderId: currentUser.id, content, sentAt: now(), replyTo }]);
    addAudit(caseId, currentUser.id, "messaged");
    addNotification(role === "technician" ? "radiologist" : "technician", caseId, "reply", `${currentUser.firstName} ${currentUser.lastName} replied on ${caseId}`);
  }

  function answerQuestion(caseId, questionId, answerText, questionText) {
    setCases((cs) => cs.map((c) => c.id !== caseId ? c : {
      ...c, questions: c.questions.map((q) => q.id === questionId ? { ...q, answered: true, answerText, answeredBy: currentUser.id } : q),
    }));
    sendMessage(caseId, answerText, { text: questionText, isQuestion: true });
    addAudit(caseId, currentUser.id, "decided");
  }

  function setCaseStatus(caseId, status) {
    setCases((cs) => cs.map((c) => c.id !== caseId ? c : { ...c, status, completedAt: status === "completed" ? now() : c.completedAt }));
    addAudit(caseId, currentUser.id, status);
  }

  function assignSelf(caseId) {
    setCases((cs) => cs.map((c) => c.id !== caseId ? c : { ...c, assignedRadiologist: currentUser.id, status: c.status === "pending" ? "active" : c.status }));
    addAudit(caseId, currentUser.id, "assigned");
  }

  function openCase(caseId) {
    setActiveCaseId(caseId);
    setView("caseDetail");
    addAudit(caseId, currentUser.id, "viewed");
  }

  const NavItems = () => (
    <>
      <NavItem icon="grid-outline" label={t("nav.dashboard")} active={view === "dashboard" || view === "caseDetail"} onPress={() => setView("dashboard")} />
      {role === "technician" && <NavItem icon="add-circle-outline" label={t("nav.newCase")} active={view === "newCase"} onPress={() => setView("newCase")} />}
      <NavItem icon="notifications-outline" label={t("nav.notifications")} active={view === "notifications"} onPress={() => setView("notifications")} badge={unreadCount} />
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.paper }}>
      <StatusBar style="dark" />
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Logo size={28} />
          <Text style={styles.brand}>{t("appName")}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <LanguageSwitch lang={lang} setLang={setLang} style={{ marginRight: 10 }} />
          <TouchableOpacity onPress={() => setView("notifications")} style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={18} color={theme.inkSoft} />
            {unreadCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentUser(null)} style={{ marginLeft: 10 }}>
            <Avatar initials={currentUser.initials} role={role} size={30} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: isWide ? "row" : "column" }}>
        {isWide ? (
          <View style={styles.sidebar}>
            <NavItems />
            <View style={{ marginTop: "auto" }}>
              <Text style={styles.userName}>{currentUser.firstName} {currentUser.lastName}</Text>
              <Text style={styles.userRole}>{role === "radiologist" ? currentUser.specialization : t("role.technician")}</Text>
              <TouchableOpacity onPress={() => setCurrentUser(null)} style={{ marginTop: 8 }}>
                <Text style={{ color: theme.blue, fontSize: 12, fontWeight: "700" }}>{t("signOut")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={{ flex: 1 }}>
          {view === "dashboard" && (
            <DashboardScreen cases={cases} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onOpen={openCase} isWide={isWide} role={role} t={t} messages={messages} users={users} />
          )}
          {view === "newCase" && <NewCaseScreen onSubmit={createCase} onCancel={() => setView("dashboard")} isWide={isWide} t={t} />}
          {view === "caseDetail" && activeCase && (
            <CaseDetailScreen
              c={activeCase} role={role} currentUser={currentUser} users={users}
              messages={messages.filter((m) => m.caseId === activeCase.id)}
              auditLogs={audit.filter((a) => a.caseId === activeCase.id)}
              onBack={() => setView("dashboard")}
              onSend={(text, replyTo) => sendMessage(activeCase.id, text, replyTo)}
              onAnswer={(qid, text, questionText) => answerQuestion(activeCase.id, qid, text, questionText)}
              onSetStatus={(s) => setCaseStatus(activeCase.id, s)}
              onAssignSelf={() => assignSelf(activeCase.id)}
              isWide={isWide}
              t={t}
            />
          )}
          {view === "notifications" && (
            <NotificationsScreen
              items={notifications.filter((n) => n.forRole === role)}
              onRead={(id) => setNotifications((n) => n.map((x) => x.id === id ? { ...x, read: true } : x))}
              onOpen={openCase}
              isWide={isWide}
              t={t}
            />
          )}
        </View>
      </View>

      {/* Bottom tab bar on phones */}
      {!isWide && (
        <View style={styles.bottomBar}>
          <NavItems />
        </View>
      )}
    </SafeAreaView>
  );
}

function NavItem({ icon, label, active, onPress, badge }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.navItem}>
      <View style={{ position: "relative" }}>
        <Ionicons name={icon} size={19} color={active ? theme.blue : theme.inkSoft} />
        {!!badge && badge > 0 && <View style={styles.navBadge} />}
      </View>
      <Text style={[styles.navLabel, { color: active ? theme.blue : theme.inkSoft }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.line, backgroundColor: theme.surface,
  },
  brand: { fontSize: 16, fontWeight: "700", color: theme.ink, marginLeft: 8 },
  bellBtn: { borderWidth: 1, borderColor: theme.line, borderRadius: 8, width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: -4, right: -4, backgroundColor: theme.coral, borderRadius: 999, minWidth: 15, height: 15, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  badgeText: { color: "#fff", fontSize: 9.5, fontWeight: "700" },
  sidebar: { width: 190, borderRightWidth: 1, borderRightColor: theme.line, backgroundColor: theme.surface, padding: 14 },
  userName: { fontSize: 12.5, fontWeight: "700", color: theme.ink },
  userRole: { fontSize: 11, color: theme.inkSoft, marginTop: 1 },
  navItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 },
  navLabel: { fontSize: 13, fontWeight: "600", marginLeft: 10 },
  navBadge: { position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: 4, backgroundColor: theme.coral },
  bottomBar: {
    flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: theme.line,
    backgroundColor: theme.surface, paddingVertical: 6, paddingBottom: 10,
  },
});
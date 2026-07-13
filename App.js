import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import Logo from "./src/components/Logo";
import { Avatar } from "./src/components/UI";
import LanguageSwitch from "./src/components/LanguageSwitch";
import { theme } from "./src/theme";
import { uid, now } from "./src/data/seed";
import { translate } from "./src/i18n/translations";
import { api, clearToken } from "./src/api";
import { normalizeCase } from "./src/normalize";

import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import NewCaseScreen from "./src/screens/NewCaseScreen";
import CaseDetailScreen from "./src/screens/CaseDetailScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  const [lang, setLang] = useState("en");
  const t = (key, vars) => translate(lang, key, vars);

  const [currentUser, setCurrentUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("signIn");

  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  // Notifications are still local-only for now — the backend has a Notification
  // model in its schema, but no routes built for it yet. So these reset if the
  // app restarts and aren't shared across devices. That's a known gap, not a bug.
  const [notifications, setNotifications] = useState([]);

  const [view, setView] = useState("dashboard");
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (currentUser?.role === "radiologist") setStatusFilter("open");
  }, [currentUser?.id]);

  // Fetch real cases + users whenever we have a logged-in user (i.e. right after
  // sign-in/sign-up, and again after any action that changes case data).
  async function refreshData() {
    setDataError("");
    try {
      const [rawCases, rawUsers] = await Promise.all([api.listCases(), api.listUsers()]);
      setCases(rawCases.map(normalizeCase));
      setUsers(rawUsers);
    } catch (err) {
      setDataError(err.message);
    }
  }

  useEffect(() => {
    if (!currentUser) return;
    setDataLoading(true);
    refreshData().finally(() => setDataLoading(false));
  }, [currentUser?.id]);

  const addNotification = (forRole, caseId, type, message) =>
    setNotifications((n) => {
      const idx = n.findIndex((x) => x.forRole === forRole && x.caseId === caseId);
      if (idx === -1) {
        return [{ id: uid(), forRole, caseId, type, message, read: false, count: 1, createdAt: now() }, ...n];
      }
      const existing = n[idx];
      const updated = {
        ...existing, type, message, read: false,
        count: existing.read ? 1 : existing.count + 1,
        createdAt: now(),
      };
      return [updated, ...n.filter((_, i) => i !== idx)];
    });

  if (!currentUser) {
    return authScreen === "signIn" ? (
      <SignInScreen onSignIn={setCurrentUser} onGoToSignUp={() => setAuthScreen("signUp")} t={t} lang={lang} setLang={setLang} />
    ) : (
      <SignUpScreen
        onGoToSignIn={() => setAuthScreen("signIn")}
        onSignUp={setCurrentUser}
        t={t} lang={lang} setLang={setLang}
      />
    );
  }

  const role = currentUser.role;
  const unreadCount = notifications.filter((n) => n.forRole === role && !n.read).length;
  const activeCase = cases.find((c) => c.id === activeCaseId) || null;
  const allMessages = cases.flatMap((c) => c.messages);

  // Every action below follows the same shape: call the real API, show an
  // alert if it fails, then refreshData() so local state matches the server.
  async function createCase(form) {
    try {
      const newCase = await api.createCase({
        modality: form.modality, priority: form.priority, note: form.note,
        questionTypes: form.questionTypes, images: form.images,
      });
      addNotification("radiologist", newCase.id, form.priority, `New ${form.priority} case: ${newCase.id}`);
      await refreshData();
      setActiveCaseId(newCase.id);
      setView("caseDetail");
    } catch (err) {
      Alert.alert("Couldn't create case", err.message);
    }
  }

  async function sendMessage(caseId, content, replyTo = null) {
    if (!content.trim()) return;
    try {
      const targetCase = cases.find((c) => c.id === caseId);
      const wasCompleted = targetCase?.status === "completed";
      const recipientRole = role === "technician" ? "radiologist" : "technician";

      await api.sendMessage(caseId, {
        content,
        replyToText: replyTo?.text ?? null,
        replyToIsQ: !!replyTo?.isQuestion,
      });

      if (wasCompleted) {
        addNotification(recipientRole, caseId, "reopened", `${currentUser.firstName} ${currentUser.lastName} reopened ${caseId} with a new message`);
      } else {
        addNotification(recipientRole, caseId, "reply", `${currentUser.firstName} ${currentUser.lastName} replied on ${caseId}`);
      }
      await refreshData();
    } catch (err) {
      Alert.alert("Couldn't send message", err.message);
    }
  }

  async function answerQuestion(caseId, questionId, answerText, questionText) {
    try {
      await api.answerQuestion(caseId, questionId, { answerText });
      await api.sendMessage(caseId, { content: answerText, replyToText: questionText, replyToIsQ: true });
      await refreshData();
    } catch (err) {
      Alert.alert("Couldn't submit answer", err.message);
    }
  }

  async function setCaseStatus(caseId, status) {
    try {
      await api.setStatus(caseId, status);
      await refreshData();
    } catch (err) {
      Alert.alert("Couldn't update case", err.message);
    }
  }

  async function assignSelf(caseId) {
    try {
      await api.assignSelf(caseId);
      await refreshData();
    } catch (err) {
      Alert.alert("Couldn't assign case", err.message);
    }
  }

  async function requestImage(caseId) {
    try {
      await api.requestImage(caseId);
      addNotification("technician", caseId, "image_requested", `${currentUser.firstName} ${currentUser.lastName} requested an image for ${caseId}`);
      await refreshData();
    } catch (err) {
      Alert.alert("Couldn't request image", err.message);
    }
  }

  async function addImage(caseId, label) {
    try {
      await api.addImage(caseId, label);
      if (role === "technician") {
        addNotification("radiologist", caseId, "reply", `${currentUser.firstName} ${currentUser.lastName} added an image to ${caseId}`);
      }
      await refreshData();
    } catch (err) {
      Alert.alert("Couldn't add image", err.message);
    }
  }

  async function openCase(caseId) {
    setActiveCaseId(caseId);
    setView("caseDetail");
    try {
      await api.getCase(caseId);
      await refreshData();
    } catch (err) {
      console.log("Could not refresh after opening case:", err.message);
    }
  }

  function updateProfile(updates) {
    setCurrentUser((u) => ({ ...u, ...updates }));
  }

  function signOut() {
    clearToken();
    setCurrentUser(null);
    setCases([]);
    setUsers([]);
  }

  const NavItems = () => (
    <>
      <NavItem icon="grid-outline" label={t("nav.dashboard")} active={view === "dashboard" || view === "caseDetail"} onPress={() => setView("dashboard")} />
      {role === "technician" && <NavItem icon="add-circle-outline" label={t("nav.newCase")} active={view === "newCase"} onPress={() => setView("newCase")} />}
      <NavItem icon="notifications-outline" label={t("nav.notifications")} active={view === "notifications"} onPress={() => setView("notifications")} badge={unreadCount} />
      <NavItem icon="person-circle-outline" label={t("nav.profile")} active={view === "profile"} onPress={() => setView("profile")} />
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.paper }}>
      <StatusBar style="dark" />
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
          <TouchableOpacity onPress={() => setView("profile")} style={{ marginLeft: 10 }}>
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
              <TouchableOpacity onPress={signOut} style={{ marginTop: 8 }}>
                <Text style={{ color: theme.blue, fontSize: 12, fontWeight: "700" }}>{t("signOut")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={{ flex: 1 }}>
          {dataLoading ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator color={theme.blue} size="large" />
            </View>
          ) : dataError ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
              <Text style={{ color: theme.coral, textAlign: "center", marginBottom: 12 }}>{dataError}</Text>
              <TouchableOpacity onPress={refreshData} style={{ backgroundColor: theme.blue, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 }}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {view === "dashboard" && (
                <DashboardScreen
                  cases={cases} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onOpen={openCase}
                  isWide={isWide} role={role} t={t} messages={allMessages} users={users}
                  onCompleteCase={(caseId) => setCaseStatus(caseId, "completed")}
                />
              )}
              {view === "newCase" && <NewCaseScreen onSubmit={createCase} onCancel={() => setView("dashboard")} isWide={isWide} t={t} />}
              {view === "caseDetail" && activeCase && (
                <CaseDetailScreen
                  c={activeCase} role={role} currentUser={currentUser} users={users}
                  messages={activeCase.messages}
                  auditLogs={activeCase.auditLogs}
                  onBack={() => setView("dashboard")}
                  onSend={(text, replyTo) => sendMessage(activeCase.id, text, replyTo)}
                  onAnswer={(qid, text, questionText) => answerQuestion(activeCase.id, qid, text, questionText)}
                  onSetStatus={(s) => setCaseStatus(activeCase.id, s)}
                  onAssignSelf={() => assignSelf(activeCase.id)}
                  onRequestImage={() => requestImage(activeCase.id)}
                  onAddImage={(label) => addImage(activeCase.id, label)}
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
              {view === "profile" && (
                <ProfileScreen
                  user={currentUser} onSave={updateProfile} onSignOut={signOut}
                  isWide={isWide} t={t} lang={lang} setLang={setLang}
                />
              )}
            </>
          )}
        </View>
      </View>

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
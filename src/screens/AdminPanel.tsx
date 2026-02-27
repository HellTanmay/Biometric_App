import React, { useMemo, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import { Block, Text, Input } from "../components";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const AdminPanel = ({ navigation }: any) => {
  const [search, setSearch] = useState("");

  const items = [
    {
      key: "users",
      title: "Users",
      subtitle: "Manage system users",
      icon: "group",
      screen: "UserList",
    },
    {
      key: "roles",
      title: "Roles",
      subtitle: "Manage user roles",
      icon: "admin-panel-settings",
      screen: "Roles",
    },
  ];

  // ✅ FILTER LOGIC
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <LinearGradient
      colors={["#4e73df", "#7b2ff7"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Block style={styles.card}>

          <Text bold size={24}>
            Admin Panel
          </Text>

          <Text size={14} color="gray" style={{ marginBottom: 20 }}>
            Manage Users and Roles
          </Text>

          {/* Search */}
          <Input
            search
            placeholder="Search (users, roles...)"
            value={search}
            onChangeText={setSearch}
            style={{ marginBottom: 30 }}
          />

          {/* Boxes */}
          <Block row style={{ flexWrap: "wrap" }}>

            {filtered.map((item) => (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.9}
                onPress={() => navigation.navigate(item.screen)}
                style={styles.box}
              >
                <View style={styles.iconWrap}>
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color="#7b2ff7"
                  />
                </View>

                <Text bold size={16} style={{ marginTop: 10 }}>
                  {item.title}
                </Text>

                <Text size={12} color="gray" style={{ marginTop: 5 }}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            ))}

          </Block>

          {filtered.length === 0 && (
            <Text style={{ marginTop: 20 }}>
              No results found.
            </Text>
          )}

        </Block>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: 40,

    paddingHorizontal: 20,
    


  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 35,
    elevation: 8,
    marginTop: 120,
    marginBottom: 120,
   
  },
  box: {
    width: "48%",
    height: 140,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    justifyContent: "center",
    marginRight: "4%",
    marginBottom: 20,
   
  },
  iconWrap: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "rgba(123,47,247,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdminPanel;
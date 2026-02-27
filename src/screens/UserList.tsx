import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "../hooks";
import { Block, Button, Input, Switch, Text } from "../components";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  forceDeleteUser,
  getDeletedUsers

} from "../../api/User";
import { getRoles } from "../../api/Role";

type UserStatus = "active" | "inactive";

type UserRow = {
  id: string;
  name: string;
  mobile: string;
  role_id: string;
  role_name: string;
  status: UserStatus;
  deleted_at: string | null;
};



export default function UserList() {
  const { colors, sizes } = useTheme();

  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [headerHeight, setHeaderHeight] = useState(220);

  const [query, setQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");


useEffect(() => {
  const loadRoles = async () => {
    const res = await getRoles(); // your API
    setRoles(res.data || res);
  };

  loadRoles();
}, []);


const refresh = useCallback(async () => {
  try {
    setLoading(true);

    const response = showDeleted
      ? await getDeletedUsers()
      : await getUsers();

    const usersArray = Array.isArray(response)
      ? response
      : response.data || [];

    const formatted = usersArray.map((u: any) => ({
      id: u.id,
      name: u.name,
      mobile: u.mobile,
      role_id: u.role_id,
      role_name: u.role?.name ?? "",
      status: u.status ,
      deleted_at: u.deleted_at,
    }));

    setRows(formatted);

  } catch (error) {
    Alert.alert("Error", "Failed to fetch users");
  } finally {
    setLoading(false);
  }
}, [showDeleted]);


  useEffect(() => {
    refresh();
  }, [refresh]);

const filtered = useMemo(() => {
  return rows.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );
}, [rows, query]);


  const openAdd = () => {
    setEditingId(null);
    setName("");
    setMobile("");
    setRole("");
    setIsActive(true);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (row: UserRow) => {

    setEditingId(row.id);
    setName(row.name);
    setMobile(row.mobile);
    setRole(row.role_id);
    setIsActive(row.status === "active");
    setError("");
    setModalOpen(true);
  };

  const onSave = async () => {
  if (mobile.length !== 10) {
    setError("Mobile number must be exactly 10 digits");
    return;
  }

  if (!name.trim()) {
    setError("Name is required");
    return;
  }

  try {
    const payload = {
      name,
      mobile,
      status: isActive ? "active" : "inactive",
      role_id: role, // Default to 'user' role; adjust as needed
    };

    if (!editingId) {
      await createUser(payload);
    } else {
      await updateUser(editingId, payload);
    }

    setModalOpen(false);
    refresh();

  } catch (error: any) {
    Alert.alert( "Failed to save user");
  }
};

 const toggleStatus = async (row: UserRow) => {
  try {
    const nextStatus =
      row.status === "active" ? "inactive" : "active";
    console.log(nextStatus)

    await updateUser(row.id, {
      name: row.name,
      mobile: row.mobile,
      role_id: row.role_id, //  must be role_id
      status: nextStatus,
    });

    refresh();
  } catch (error) {
    Alert.alert("Status update failed");
  }
};

  const softDelete = async (row: UserRow) => {
  try {
    await deleteUser(row.id);
    refresh();
  } catch {
    Alert.alert("Delete failed");
  }
};
 const restore = async (row: UserRow) => {
  try {
    console.log(row)
    await restoreUser(row.id);
    refresh();
  } catch (error: any) {
    Alert.alert(error?.message || "Restore failed");
  }
};

const permanentDelete = async (row: UserRow) => {
  try {
    await forceDeleteUser(row.id);
    refresh();
  } catch {
    Alert.alert("Permanent delete failed");
  }
};

  const StatusPill = ({ status }: { status: UserStatus }) => (
    <View
      style={[
        styles.pill,
        {
          backgroundColor:
            status === "active" ? colors.primary : colors.gray,
        },
      ]}
    >
      <Text size={12} color={colors.white} semibold>
        {status}
      </Text>
    </View>
  );

  const renderRow = ({ item, index }: any) => {
    const isDeleted = !!item.deleted_at;

    return (
      <View
        style={[
          styles.row,
          {
            borderColor: colors.gray,
            opacity: isDeleted ? 0.5 : 1,
          },
        ]}
      >
        <Text style={{ width: 40 }}>{index + 1}</Text>

        <View style={{ flex: 1 }}>
          <Text semibold>{item.name}</Text>
          <Text size={12}>{item.mobile}</Text>
          <Text size={12}>{item.role_name}</Text>
        </View>

        <View style={{ width: 100 }}>
          <StatusPill status={item.status} />
        </View>
        
<View
  style={{
    width: 90,
    flexDirection: "row",
    justifyContent: "flex-end",
  }}
>
  {!isDeleted ? (
    <>
      <TouchableOpacity
        style={{ marginRight: 12 }}
        onPress={() => openEdit(item)}
      >
        <MaterialIcons name="edit" size={20} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginRight: 12 }}
        onPress={() => toggleStatus(item)}
      >
        <MaterialIcons name="sync" size={20} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => softDelete(item)}>
        <MaterialIcons name="delete" size={20} color={colors.danger} />
      </TouchableOpacity>
    </>
  ) : (
    <>
      {/* Restore */}
      <TouchableOpacity
        style={{ marginRight: 12 }}
        onPress={() => restore(item)}
      >
        <MaterialIcons name="restore" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Permanent Delete */}
      <TouchableOpacity onPress={() => permanentDelete(item)}>
        <MaterialIcons name="delete-forever" size={22} color={colors.danger} />
      </TouchableOpacity>
    </>
  )}
</View>

      </View>
    );
  };

  return (
    <Block safe style={{ flex: 1, backgroundColor: colors.background }}>

      {/* FIXED HEADER */}
      <View
        style={[styles.headerFixed, { backgroundColor: colors.background }]}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h && Math.abs(h - headerHeight) > 2) {
            setHeaderHeight(h);
          }
        }}
      >
        <Block padding={sizes.m} style={{ paddingTop: sizes.xl }}>

          <Block row justify="space-between" align="center">
            <Block flex={1}>
              <Text h4 semibold>
                User Master
              </Text>
            </Block>

            <Button primary onPress={openAdd} style={{ borderRadius: 35, paddingHorizontal: 20 }}>
              <Text semibold color={colors.white}>
                + Add User
              </Text>
            </Button>
          </Block>

          <Block row marginTop={sizes.m} align="center">
            <Block flex={1} marginRight={10}>
              <Input
                placeholder="Search user..."
                value={query}
                onChangeText={setQuery}
              />
            </Block>

            <Block row align="center">
              <Text size={12} marginRight={8}>
                Show Deleted
              </Text>
              <Switch checked={showDeleted} onPress={setShowDeleted} />
            </Block>
          </Block>

          <View style={[styles.tableHeader, { borderColor: colors.gray }]}>
            <Text style={{ width: 40 }}>SL</Text>
            <Text style={{ flex: 1 }}>User</Text>
            <Text style={{ width: 100 }}>Status</Text>
            <Text style={{ width: 90, textAlign: "right" }}>
              Actions
            </Text>
          </View>
        </Block>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        contentContainerStyle={{
          paddingTop: headerHeight + 10,
          paddingHorizontal: sizes.m,
          paddingBottom: 120,
        }}
         ListEmptyComponent={
    !loading ? (
      <View
        style={{
          marginTop: 50,
          alignItems: "center",
        }}
      >
        <Text size={14} color={colors.gray}>
          No users found
        </Text>
      </View>
    ) : null
  }
  showsVerticalScrollIndicator={false}
      />

<RNModal visible={modalOpen} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView>
        <View style={styles.modalCard}>
          <ScrollView>

            <Text h5 semibold>
              {editingId ? "Edit User" : "Add User"}
            </Text>

            <Input
              placeholder="Name"
              value={name}
              onChangeText={setName}
              marginTop={sizes.m}
            />

            <Input
              placeholder="Mobile (10 digits)"
              value={mobile}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, "");
                setMobile(cleaned);
              }}
              marginTop={sizes.m}
            />

            {error !== "" && (
              <Text size={12} color={colors.danger} marginTop={6}>
                {error}
              </Text>
            )}

            <View style={{ marginTop: sizes.m }}>
  <Text size={12} marginBottom={6}>Select Role</Text>

  <View
    style={{
      borderWidth: 1,
      borderRadius: 10,
      borderColor: colors.gray,
    }}
  >
    <Picker
      selectedValue={role}
      onValueChange={(itemValue:any) => setRole(itemValue)}
    >
      <Picker.Item label="Select Role" value="" />

      {roles.map((r) => (
        <Picker.Item
          key={r.id}
          label={r.name}
          value={r.id}
        />
      ))}
    </Picker>
  </View>
</View>


            <Block row justify="space-between" marginTop={sizes.m}>
              <Text>Status</Text>
              <Switch checked={isActive} onPress={setIsActive} />
            </Block>

            <Block row justify="space-between" marginTop={sizes.l}>
              <Button
                gray
                onPress={() => setModalOpen(false)}
                style={{ flex: 1, marginRight: 10 }}
              >
                <Text semibold>Cancel</Text>
              </Button>

              <Button
                primary
                onPress={onSave}
                style={{ flex: 1, marginLeft: 10 }}
              >
                <Text semibold color={colors.white}>
                  {editingId ? "Update" : "Save"}
                </Text>
              </Button>
            </Block>

          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  </View>
</RNModal>


    </Block>
  );
}

const styles = StyleSheet.create({
  headerFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 12,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  modalOverlay: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.35)",
},
modalCard: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
  padding: 20,
},
});
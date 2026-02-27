import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";


import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "../hooks";
import { Block, Button, Input, Switch, Text } from "../components";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  restoreRole,
  forceDeleteRole,
  getDeletedRoles
} from "../../api/Role";

type RoleStatus = "active" | "inactive";

type RoleRow = {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  deleted_at: string | null;
};



export default function Roles() {
  const { colors, sizes } = useTheme();

  const [rows, setRows] = useState<RoleRow[]>([]);
  const [headerHeight, setHeaderHeight] = useState(220);

  const [query, setQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);



const refresh = useCallback(async () => {
  try {
    const response = showDeleted
      ? await getDeletedRoles()
      : await getRoles();

    const rolesArray = Array.isArray(response)
      ? response
      : response.data;

    setRows(rolesArray || []);
  } catch (error: any) {
    console.log("FETCH ERROR:", error?.response?.data || error);
    Alert.alert("Error", "Failed to fetch roles");
  }
}, [showDeleted]);


  useEffect(() => {
    refresh();
  }, [refresh]);

const filtered = useMemo(() => {
  return rows.filter((r) =>
    (r.name ?? "").toLowerCase().includes(query.toLowerCase())
  );
}, [rows, query]);


  const openAdd = () => {
    setEditingId(null);
    setRoleName("");
    setDescription("");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (row: RoleRow) => {
    setEditingId(row.id);
    setRoleName(row.name);
    setDescription(row.description);
    setIsActive(row.status === "active");
    setModalOpen(true);
  };

  const onSave = async () => {
  if (!roleName.trim()) return;

  const status = isActive ? "active" : "inactive";
console.log({
  name: roleName,
  description,
  status,
});
  try {
    if (!editingId) {
      await createRole({
        name: roleName,
        description,
        status,
      });
    } else {
      await updateRole(editingId, {
        name: roleName,
        description,
        status,
      });
    }

    setModalOpen(false);
    refresh(); // reload from backend

  } catch (error) {
    Alert.alert("Failed to save role");
  }
};

  const toggleStatus = async (row: RoleRow) => {

      try {
    const nextStatus =
      row.status === "active" ? "inactive" : "active";

    await updateRole(row.id, {
      name: row.name,
      description: row.description,
      status: nextStatus,
    });

    refresh();
  } catch (error) {
    Alert.alert("Status update failed");
  }
  };

const softDelete = async (row: RoleRow) => {
  try {
    await deleteRole(row.id);
    refresh();
  } catch (error) {
    Alert.alert("Delete failed");
  }
};

  const restore = async (row: RoleRow) => {
  try {
    await restoreRole(row.id);
    refresh();
  } catch (error) {
    Alert.alert("Restore failed");
  }
};
const permanentDelete = async (row: RoleRow) => {
  try {
    console.log(row)
    await forceDeleteRole(row.id);
    refresh();
  } catch (error) {
    console.log("Permanent Delete Error:", error);
  }
};

  const StatusPill = ({ status }: { status: RoleStatus }) => (
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
          { borderColor: colors.gray, opacity: isDeleted ? 0.5 : 1 },
        ]}
      >
        <Text style={{ width: 40 }}>{index + 1}</Text>

        <View style={{ flex: 1 }}>
          <Text semibold>{item.name}</Text>
          <Text size={12} opacity={0.7}>
            {item.description}
          </Text>
        </View>

        <View style={{ width: 100 }}>
          <StatusPill status={item.status} />
        </View>

        <View style={{ width: 110, flexDirection: "row", justifyContent: "flex-end" }}>
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
              <TouchableOpacity
                style={{ marginRight: 12 }}
                onPress={() => restore(item)}
              >
                <MaterialIcons name="restore" size={20} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => permanentDelete(item)}>
                <MaterialIcons
                  name="delete-forever"
                  size={22}
                  color={colors.danger}
                />
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
        style={styles.headerFixed}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          setHeaderHeight(h);
        }}
      >
        <Block padding={sizes.m} style={{ paddingTop: sizes.xl }}>

          <Block row justify="space-between" align="center">
            <Text h4 semibold>
              Roles Master
            </Text>

            <Button
              primary
              onPress={openAdd}
              style={{
                borderRadius: 35,
                paddingHorizontal: 35,
                paddingVertical: 12,
                minWidth: 150,
              }}
            >
              <Text semibold color={colors.white}>
                + Add Role
              </Text>
            </Button>
          </Block>

          <Block row marginTop={sizes.m} align="center">
            <Block flex={1} marginRight={10}>
              <Input
                placeholder="Search role..."
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
            <Text style={{ flex: 1 }}>Role</Text>
            <Text style={{ width: 100 }}>Status</Text>
            <Text style={{ width: 110, textAlign: "right" }}>Actions</Text>
          </View>
        </Block>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        contentContainerStyle={{
          paddingTop: headerHeight + 10,
          paddingHorizontal: sizes.m,
          paddingBottom: 120,
        }}
      />

      {/* MODAL */}
      <RNModal
        visible={modalOpen}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <SafeAreaView>
              <View style={styles.modalCard}>
                <ScrollView>

                  <Text h5 semibold>
                    {editingId ? "Edit Role" : "Add Role"}
                  </Text>

                  <Input
                    placeholder="Role Name"
                    value={roleName}
                    onChangeText={setRoleName}
                    marginTop={sizes.m}
                  />

                  <Input
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    marginTop={sizes.m}
                  />

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
                      <Text>Cancel</Text>
                    </Button>

                    <Button
                      primary
                      onPress={onSave}
                      style={{ flex: 1, marginLeft: 10 }}
                    >
                      <Text color={colors.white}>
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
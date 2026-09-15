import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../styles/colors";

const tabs = [
	["view-dashboard-outline", "Inicio"],
	["calendar-month-outline", "Agenda"],
	["chart-line", "Progreso"],
	["account-circle-outline", "Perfil"],
];

export default function BottomNav() {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingBottom: 12 + insets.bottom }]}>
			{tabs.map(([icon, label]) => (
				<View key={label} style={styles.tab}>
					<MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
					<Text style={styles.label}>{label}</Text>
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flexDirection: "row", justifyContent: "space-around", paddingTop: 10, paddingBottom: 12, backgroundColor: colors.surfaceContainer, borderTopWidth: 1, borderTopColor: colors.outlineVariant },
	tab: { alignItems: "center", gap: 4 },
	label: { color: colors.textSecondary, fontSize: 11 },
});

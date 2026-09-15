import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/colors";

export default function ProblemCard({ icon, percentage, title, description, label }) {
	return (
		<View style={styles.card}>
			<View style={styles.iconRow}>
				<MaterialCommunityIcons name={icon} size={25} color={colors.error} />
				{percentage ? <Text style={styles.percentage}>{percentage}</Text> : null}
				{label ? <Text style={styles.label}>{label}</Text> : null}
			</View>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.description}>{description}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		marginBottom: 14,
		padding: 18,
		borderRadius: 16,
		backgroundColor: colors.surfaceContainer,
	},
	iconRow: { flexDirection: "row", alignItems: "center", gap: 10 },
	percentage: { color: colors.error, fontSize: 22, fontWeight: "800" },
	label: { color: colors.secondary, fontSize: 12, fontWeight: "700" },
	title: { marginTop: 12, color: colors.primary, fontSize: 18, fontWeight: "700" },
	description: { marginTop: 8, color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
});

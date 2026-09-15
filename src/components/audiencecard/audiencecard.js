import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/colors";

export default function AudienceCard({ icon, title, description, color }) {
	const accent = color === "purple" ? colors.secondary : colors.primaryContainer;

	return (
		<View style={styles.card}>
			<MaterialCommunityIcons name={icon} size={28} color={accent} />
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.description}>{description}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: { marginBottom: 14, padding: 18, borderRadius: 16, backgroundColor: colors.surfaceContainer },
	title: { marginTop: 12, color: colors.primary, fontSize: 17, fontWeight: "700" },
	description: { marginTop: 8, color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
});

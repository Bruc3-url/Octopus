import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/colors";

export default function GamificationCard() {
	return (
		<View style={styles.card}>
			<MaterialCommunityIcons name="fire" size={34} color={colors.secondary} />
			<View style={styles.content}>
				<Text style={styles.title}>Tu racha sigue viva</Text>
				<Text style={styles.description}>Completa una acción hoy y conserva tu progreso.</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: { marginHorizontal: 20, marginBottom: 8, padding: 18, flexDirection: "row", borderRadius: 16, backgroundColor: colors.secondaryContainer },
	content: { flex: 1, marginLeft: 14 },
	title: { color: colors.primary, fontSize: 18, fontWeight: "800" },
	description: { marginTop: 6, color: colors.primary, fontSize: 14, lineHeight: 20 },
});

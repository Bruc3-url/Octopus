import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/colors";

export default function Header() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Constancia</Text>
			<Text style={styles.subtitle}>Organiza tus metas y mantén el ritmo</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 12,
		backgroundColor: colors.surface,
	},
	title: {
		color: colors.primary,
		fontSize: 24,
		fontWeight: "800",
	},
	subtitle: {
		marginTop: 4,
		color: colors.textSecondary,
		fontSize: 13,
	},
});

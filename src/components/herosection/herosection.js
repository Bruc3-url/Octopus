import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/colors";

export default function HeroSection() {
	return (
		<View style={styles.container}>
			<Text style={styles.eyebrow}>TU PROGRESO, A TU RITMO</Text>
			<Text style={styles.title}>Convierte tus pendientes en avances visibles.</Text>
			<Text style={styles.description}>
				Divide tus proyectos en pasos pequeños y celebra cada logro.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 20,
		padding: 24,
		borderRadius: 20,
		backgroundColor: colors.primaryContainer,
	},
	eyebrow: {
		color: colors.onPrimary,
		fontSize: 11,
		fontWeight: "800",
		letterSpacing: 1,
	},
	title: {
		marginTop: 10,
		color: colors.onPrimary,
		fontSize: 27,
		lineHeight: 33,
		fontWeight: "800",
	},
	description: {
		marginTop: 12,
		color: colors.onPrimary,
		fontSize: 15,
		lineHeight: 22,
	},
});

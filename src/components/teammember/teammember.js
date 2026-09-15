import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/colors";

export default function TeamMember({ avatar, icon, name, role, specialty, description, tag }) {
	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<View style={styles.avatar}>
					{avatar ? (
						<Image source={avatar} style={styles.avatarImage} />
					) : (
						<MaterialCommunityIcons name={icon} size={26} color={colors.primaryContainer} />
					)}
				</View>
				<View style={styles.identity}>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.role}>{role}</Text>
				</View>
			</View>
			<Text style={styles.specialty}>{specialty}</Text>
			<Text style={styles.description}>{description}</Text>
			<Text style={styles.tag}>{tag}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: { marginBottom: 14, padding: 18, borderRadius: 16, backgroundColor: colors.surfaceContainer },
	header: { flexDirection: "row", alignItems: "center" },
	avatar: { width: 54, height: 54, alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 27, backgroundColor: colors.surfaceHigh },
	avatarImage: { width: "100%", height: "100%" },
	identity: { flex: 1, marginLeft: 12 },
	name: { color: colors.primary, fontSize: 16, fontWeight: "700" },
	role: { marginTop: 3, color: colors.textSecondary, fontSize: 12 },
	specialty: { marginTop: 14, color: colors.secondary, fontSize: 13, fontWeight: "700" },
	description: { marginTop: 8, color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
	tag: { alignSelf: "flex-start", marginTop: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, color: colors.onPrimary, backgroundColor: colors.primaryContainer, fontSize: 11, fontWeight: "700" },
});

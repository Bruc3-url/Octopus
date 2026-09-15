import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  solutionSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.surfaceLowest,
  },

});
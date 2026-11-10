import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SLIDES = [
  {
    id: "1",
    title: "Organiza tu día, haz crecer a Octy",
    subtitle:
      "Una experiencia de productividad minimalista. Completa tus compromisos diarios, mantén tu racha activa y ve a tu mascota marina radiante y feliz.",
    badge: "Hábitat sereno · Racha lista",
    vital: "100% vital",
    features: [
      {
        icon: "🗂️",
        backgroundColor: "#c9e6ff",
        color: "#006591",
        title: "Gestión sin estrés",
        description:
          "Divide tus proyectos personales y profesionales en pasos claros y fluidos.",
      },
      {
        icon: "🐙",
        backgroundColor: "#ffdbca",
        color: "#9d4300",
        title: "Mascota viva",
        description:
          "Octy refleja tu disciplina; si cumples el 80% estará radiante y lleno de energía.",
      },
      {
        icon: "📱",
        backgroundColor: "#dae2fd",
        color: "#006591",
        title: "Widget en tu pantalla",
        description:
          "Revisa tus microtareas y racha marina al instante sin abrir la aplicación.",
      },
    ],
  },
];

export function OnboardingScreen({ onFinish, isFinishing = false }) {
  const { width } = useWindowDimensions();
  const pageWidth = Math.max(width - 40, 0);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToSlide = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollToSlide(currentIndex + 1);
      return;
    }

    onFinish();
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "bottom", "left"]}>
      <View style={styles.header}>
        <Text style={styles.brand}>Octopus</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Omitir introducción"
          disabled={isFinishing}
          hitSlop={10}
          onPress={onFinish}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.skipLabel}>Omitir</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        getItemLayout={(_, index) => ({
          length: pageWidth,
          offset: pageWidth * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / pageWidth,
          );
          setCurrentIndex(Math.min(index, SLIDES.length - 1));
        }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: pageWidth }]}>
            <ScrollView
              style={styles.slideScroll}
              contentContainerStyle={styles.slideContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.heroCard}>
                <View style={styles.mascotContainer}>
                  <View style={styles.mascotFrame}>
                    <Image
                      source={require("../../assets/images/Logo.png")}
                      style={styles.mascotImage}
                      resizeMode="cover"
                      accessibilityLabel="Octy, la mascota de Octopus"
                    />
                  </View>
                  <View style={styles.vitalBadge}>
                    <Text style={styles.vitalIcon}>ϟ</Text>
                    <Text style={styles.vitalLabel}>{item.vital}</Text>
                  </View>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusLabel}>{item.badge}</Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.features}>
                {item.features.map((feature) => (
                  <View key={feature.title} style={styles.featureCard}>
                    <View
                      style={[
                        styles.featureIcon,
                        { backgroundColor: feature.backgroundColor },
                      ]}
                    >
                      <Text style={styles.featureEmoji}>{feature.icon}</Text>
                    </View>
                    <View style={styles.featureCopy}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription} numberOfLines={2}>
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      />

      <View style={styles.pagination} accessibilityLabel="Páginas de introducción">
        {SLIDES.map((slide, index) => (
          <Pressable
            key={slide.id}
            accessibilityRole="button"
            accessibilityLabel={`Ir a la diapositiva ${index + 1}`}
            accessibilityState={{ selected: currentIndex === index }}
            onPress={() => scrollToSlide(index)}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          currentIndex === SLIDES.length - 1
            ? "Empezar mi aventura"
            : "Continuar"
        }
        accessibilityState={{ disabled: isFinishing }}
        disabled={isFinishing}
        onPress={handleNext}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && !isFinishing && styles.primaryButtonPressed,
          isFinishing && styles.primaryButtonDisabled,
        ]}
      >
        {isFinishing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Text style={styles.primaryButtonLabel}>
              {currentIndex === SLIDES.length - 1
                ? "¡Empezar mi aventura!"
                : "Comenzar ahora"}
            </Text>
            <Text style={styles.arrow} accessibilityElementsHidden>
              →
            </Text>
          </>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#faf8ff",
    paddingHorizontal: 20,
  },
  header: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  brand: {
    color: "#006591",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  skipLabel: {
    color: "#6e7881",
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  carousel: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  slideScroll: {
    flex: 1,
  },
  slideContent: {
    paddingBottom: 8,
  },
  heroCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginTop: 8,
    shadowColor: "#131b2e",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  mascotContainer: {
    width: 116,
    height: 116,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  mascotFrame: {
    width: 104,
    height: 104,
    borderRadius: 52,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#dae2fd",
    backgroundColor: "#f2f3ff",
  },
  mascotImage: {
    width: "100%",
    height: "100%",
  },
  vitalBadge: {
    position: "absolute",
    top: 0,
    right: -2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fd761a",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  vitalIcon: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    marginRight: 3,
  },
  vitalLabel: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#6ffbbe",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  statusLabel: {
    color: "#002113",
    fontSize: 11,
    fontWeight: "700",
  },
  title: {
    color: "#131b2e",
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
  subtitle: {
    color: "#3e4850",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },
  features: {
    marginTop: 14,
  },
  featureCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 11,
    marginBottom: 10,
    shadowColor: "#131b2e",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: "#131b2e",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  featureDescription: {
    color: "#3e4850",
    fontSize: 11,
    lineHeight: 15,
  },
  pagination: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  dot: {
    height: 8,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#0ea5e9",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#bec8d2",
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 28,
    backgroundColor: "#0ea5e9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#006591",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  arrow: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "600",
    marginLeft: 9,
  },
  pressed: {
    opacity: 0.65,
  },
});

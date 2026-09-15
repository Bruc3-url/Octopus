import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AudienceCard from "../../components/audiencecard/audiencecard";
import BottomNav from "../../components/Bottomnav/bottomnav";
import FeatureCard from "../../components/featurecard/featurecard";
import GamificationCard from "../../components/gamification/gamificationcard";
import Header from "../../components/header/header";
import HeroSection from "../../components/herosection/herosection";
import ProblemCard from "../../components/problemcard/problemcard";
import TeamMember from "../../components/teammember/teammember";

import {
    audiences,
    features,
    problems,
    team,
} from "../../data/homedata";
import { styles } from "./homescreen.styles";

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>

      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <HeroSection />

        {/* Problema */}
        <View style={styles.section}>
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              {...problem}
            />
          ))}
        </View>

        {/* Solución */}
        <View style={styles.solutionSection}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              {...feature}
            />
          ))}
        </View>

        {/* Gamificación */}
        <GamificationCard />

        {/* Audiencia */}
        <View style={styles.section}>
          {audiences.map((audience) => (
            <AudienceCard
              key={audience.id}
              {...audience}
            />
          ))}
        </View>

        {/* Equipo */}
        <View style={styles.solutionSection}>
          {team.map((member) => (
            <TeamMember
              key={member.id}
              {...member}
            />
          ))}
        </View>

      </ScrollView>

      <BottomNav />

    </SafeAreaView>
  );
}
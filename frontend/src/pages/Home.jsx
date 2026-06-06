import React from "react";
import "./Home.css";
import { CatalogueSection } from "../components/core/Homepage/CatalogueSection";
// import {HeroSection} from '../components/core/Homepage/HeroSection'
import HeroSection from "../components/core/Homepage/HeroSection";
import Marquee from "../components/core/Homepage/Marquee";
import LearningPaths from "../components/core/Homepage/LearningPath";
// import { LanguagesSection } from "../components/core/Homepage/LanguagesSection";
import LanguagesSection from "../components/core/Homepage/LearnLanguageSection";
import { HowItWorks } from "../components/core/Homepage/HowItWorks";
import { FeaturesSection } from "../components/core/Homepage/FeaturesSection";
import { InstructorCTA } from "../components/core/Homepage/InstructorCTA";
// import { Footer } from "../components/core/Homepage/Footer";
import { Footer } from "../components/common/Footer";
import { Navbar } from "../components/common/Navbar";
export const Home = () => {
  return (
    <div className="home-root">
      {/* <Navbar /> */}
      <HeroSection />
      <Marquee />
      <CatalogueSection />
      <LearningPaths />
      <LanguagesSection />
      <HowItWorks />
      <FeaturesSection />
      <InstructorCTA />
      <Footer />
    </div>
  );
};
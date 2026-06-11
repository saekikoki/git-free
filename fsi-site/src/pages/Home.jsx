
import "../styles.css";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import News from "../components/News";
import Contact from "../components/Contact";
import Company from "../components/Company"; 
import Sitefooter from "../components/Site-footer";
import Footer from "../components/Footer";

import { Routes, Route } from "react-router-dom";

export default function Home() {
return (
<>
<Hero />
<Services />
<News />
<Contact />
</>
);
}
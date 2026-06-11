import "./styles.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import News from "./components/News";
import Contact from "./components/Contact";
import Company from "./components/Company";
import Sitefooter from "./components/Site-footer";
import Footer from "./components/Footer";

import Page1 from "./pages/page1";
import Entry from "./pages/entry";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";

export default function App() {
return (
<>
<Header />
<main>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/page1" element={<Page1 />} />
<Route path="/entry" element={<Entry />} />
</Routes>
</main>
<Footer />
</>
);
}
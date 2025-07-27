import './App.css'

import { Nav } from "./components/Nav/Nav";
import { Home } from "./components/Home/Home";
import { AboutMe } from "./components/AboutMe/AboutMe";
import { Projects } from "./components/Projects/Projects";

{/*

import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";
*/}


function App() {
  return (
    <>
      <Nav />
      <Home />
      <AboutMe />
      <Projects />

      {/* <main>
        <Contact />
      </main>
      <Footer /> */}
    </>
  );
}

export default App;

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./home/home.css";
import { HomeExperience } from "./home/HomeExperience";

// Runs before first paint so a returning visitor's saved theme (or ?theme=) and motion choice apply without a flash.
const themeBoot = `try{var d=document.documentElement.dataset,t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("inspectre-theme"),m=localStorage.getItem("inspectre-motion");if(t==="dark"||t==="light")d.inspectreTheme=t;if(m==="off")d.inspectreMotion=m}catch(e){}`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      <HomeExperience />
    </>
  );
}

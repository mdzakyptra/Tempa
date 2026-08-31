import { useMediaQuery } from "@/hooks/useMediaQuery";
import HeroScrollStack from "./HeroScrollStack";
import HeroStatic from "./HeroStatic";


//<---------- Hero -------------->
export default function Hero() {
  const isTabletUp = useMediaQuery("(min-width: 768px)");
  return isTabletUp ? <HeroScrollStack /> : <HeroStatic />;
}

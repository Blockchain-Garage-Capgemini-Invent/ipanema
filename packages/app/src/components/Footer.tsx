import { Link } from "@mui/material";
import capgeminiInventLogo from "./images/invent.png";

export default function Footer() {
  const capgeminiInventLink = "https://www.capgemini.com/de-de/service/invent/";

  return (
    <footer style={{ justifyContent: "center" }}>
      <Link href={capgeminiInventLink} target="_blank">
        <img src={capgeminiInventLogo} alt="Capgemini Invent Logo" width="200" />
      </Link>
    </footer>
  );
}

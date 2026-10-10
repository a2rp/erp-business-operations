import { Link } from "react-router-dom";
import { FiArrowLeft, FiGrid } from "react-icons/fi";
import styles from "./styles.module.css";

const NotFound = () => <main className={styles.page}><span className={styles.code}>404</span><h1>This page is off the ledger.</h1><p>The workspace route does not exist. Head back to your operations overview.</p><Link to="/"><FiArrowLeft aria-hidden="true" /> Return to overview <FiGrid aria-hidden="true" /></Link></main>;
export default NotFound;


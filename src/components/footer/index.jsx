import { Tooltip } from "react-tooltip";
import { FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiCoffee, FiCode, FiYoutube } from "react-icons/fi";
import { publicAsset } from "../../data/seed.js";
import styles from "./styles.module.css";

const socialLinks = [
    ["Portfolio", "ashishranjan.net", "https://www.ashishranjan.net", FiGlobe],
    ["GitHub", "github.com/a2rp", "https://github.com/a2rp", FiGithub],
    ["CodePen", "codepen.io/ash1198", "https://codepen.io/ash1198", FiCode],
    ["LinkedIn", "linkedin.com/in/aashishranjan", "https://www.linkedin.com/in/aashishranjan", FiLinkedin],
    ["Facebook", "facebook.com/theash.ashish", "https://www.facebook.com/theash.ashish/", FiFacebook],
    ["YouTube", "youtube.com/@ashishranjan-ashz", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", FiYoutube],
    ["Email", "ash.ranjan09@gmail.com", "mailto:ash.ranjan09@gmail.com", FiMail],
    ["Support", "a2rp-donation-page.netlify.app", "https://a2rp-donation-page.netlify.app/", FiHeart],
    ["Buy Me a Coffee", "buymeacoffee.com/ashishranjan", "https://buymeacoffee.com/ashishranjan", FiCoffee],
    ["Patreon", "patreon.com/ashishranjan", "https://www.patreon.com/ashishranjan", FiHeart],
    ["Source code", "github.com/a2rp/erp-business-operations", "https://github.com/a2rp/erp-business-operations", FiGithub],
];

const Footer = () => <footer className={styles.footer}>
    <div className={styles.footerInner}>
        <div className={styles.copyright}>
            <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer" className={styles.logoLink}><img src={publicAsset("logo.png")} alt="Ashish Ranjan" /></a>
            <p>© {new Date().getFullYear()} <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
        </div>
        <div className={styles.socialLinks} aria-label="External links">
            {socialLinks.map(([label, detail, href, Icon]) => <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" aria-label={label} data-tooltip-id="footer-tooltip" data-tooltip-content={`${label}\n${detail}`}><Icon aria-hidden="true" /></a>)}
            <Tooltip id="footer-tooltip" place="top" className={styles.tooltip} delayShow={250} clickable={false} />
        </div>
    </div>
</footer>;

export default Footer;


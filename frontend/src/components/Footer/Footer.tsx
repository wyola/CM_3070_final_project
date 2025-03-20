import { NavLink } from 'react-router';
import { Logo } from '@/components';
import { HOME, LOGIN, REGISTER, REPORT } from '@/constants';
import './footer.scss';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="content footer__content">
        <div className="footer__column footer__column--logo">
          <Logo />
          <p className="footer__tagline">
            Connecting people to help animals in need
          </p>
        </div>

        <div className="footer__column">
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__list">
            <li className="footer__item">
              <NavLink to={REPORT} className="footer__link">
                Report Abuse
              </NavLink>
            </li>
            <li className="footer__item">
              <NavLink to={LOGIN} className="footer__link">
                Login
              </NavLink>
            </li>
            <li className="footer__item">
              <NavLink to={REGISTER} className="footer__link">
                Register Organization
              </NavLink>
            </li>
            <li className="footer__item">
              <NavLink to={HOME} className="footer__link">
                Find Organizations
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="footer__column">
          <h3 className="footer__heading">Information</h3>
          <ul className="footer__list">
            <li className="footer__item">
              <NavLink to="" className="footer__link">
                About Us
              </NavLink>
            </li>
            <li className="footer__item">
              <NavLink to="" className="footer__link">
                Privacy Policy
              </NavLink>
            </li>
            <li className="footer__item">
              <NavLink to="" className="footer__link">
                Terms of Service
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="footer__column">
          <h3 className="footer__heading">Contact Us</h3>
          <address className="footer__contact">
            <p className="footer__contact-item">
              <img src="/pin.svg" alt="" className="footer__icon" />
              123 Animal Street, Warsaw, Poland
            </p>
            <p className="footer__contact-item">
              <img src="/phone.svg" alt="" className="footer__icon" />
              +48 123 123 123
            </p>
            <p className="footer__contact-item">
              <img src="/email.svg" alt="" className="footer__icon" />
              <a href="mailto:info@animalallies.com" className="footer__link">
                info@animalallies.com
              </a>
            </p>
          </address>
          {/* TODO: SOME find icons */}
          <div className="footer__social">
            <a href="#" aria-label="Facebook">
              <img src="/facebook.svg" alt="" width="24" height="24" />
            </a>
            <a href="#" aria-label="TikTok">
              <img src="/tiktok.svg" alt="" width="24" height="24" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src="/instagram.svg" alt="" width="24" height="24" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="content">
          <p className="footer__copyright">
            © {currentYear} AnimalAllies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

import { NavLink } from 'react-router';
import { Logo, PinIcon, PhoneIcon, EmailIcon } from '@/components';
import { HOME, LOGIN, REGISTER, REPORT } from '@/constants';
import './footer.scss';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="content footer__content">
        <div className="footer__logo">
          <div>
            <Logo />
            <p className="footer__logo--tagline">
              Connecting people to help animals in need
            </p>
          </div>
          <div className="footer__logo--social">
            <a href="#" aria-label="go to Facebook">
              <img
                src="/social-media/facebook.png"
                alt=""
                width="24"
                height="24"
              />
            </a>
            <a href="#" aria-label="go to TikTok">
              <img
                src="/social-media/tik-tok.png"
                alt=""
                width="24"
                height="24"
              />
            </a>
            <a href="#" aria-label="go to Instagram">
              <img
                src="/social-media/instagram.png"
                alt=""
                width="24"
                height="24"
              />
            </a>
          </div>
        </div>

        <div>
          <p className="footer__heading">Quick Links</p>
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

        <div>
          <p className="footer__heading">Information</p>
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

        <div>
          <p className="footer__heading">Contact Us</p>
          <address className="footer__contact">
            <p className="footer__contact-item">
              <PinIcon width={20} height={20} />
              123 Animal Street, Wroclaw, Poland
            </p>
            <p className="footer__contact-item">
              <PhoneIcon width={20} height={20} />
              <a href="tel:+48123123123">+48 123 123 123</a>
            </p>

            <p className="footer__contact-item">
              <EmailIcon width={20} height={20} />
              <a href="mailto:info@animalallies.com" className="footer__link">
                info@animalallies.com
              </a>
            </p>
          </address>
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

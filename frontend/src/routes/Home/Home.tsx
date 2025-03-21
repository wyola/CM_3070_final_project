import { OrganizationsListProvider } from '@/contexts';
import {
  OrganizationsTable,
  OrganizationsSearchFilterForm,
} from '@/components';
import './home.scss';

export const Home = () => {
  return (
    <OrganizationsListProvider>
      <section className="home">
        <div className="home__hero-wrapper">
          <div className="home__hero content">
            <div className="home__hero--intro">
              <h1 className="home__hero--header">AnimalAllies</h1>
              <p className="home__hero--slogan">
                Connecting people to help animals in need
              </p>
              <p className="home__hero--slogan">
                Search for organizations and find the one that fits your needs
              </p>
              <p className="home__hero--slogan">
                Report mistreatment of animals and help make a difference
              </p>
            </div>

            <img
              src="./images/dog-give-paw.svg"
              width="600"
              alt=""
              className="home__hero--image"
            />
          </div>
        </div>

        <div className="content">
          <OrganizationsSearchFilterForm />
          <OrganizationsTable />
        </div>
      </section>
    </OrganizationsListProvider>
  );
};

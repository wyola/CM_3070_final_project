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
                Find where your help matters most
              </p>
              <p className="home__hero--slogan">Speak up for animals in need</p>
            </div>

            <img
              src="./images/dog-give-paw.webp"
              width="800"
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

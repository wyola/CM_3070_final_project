import { OrganizationsListProvider } from '@/contexts';
import {
  OrganizationsTable,
  OrganizationsSearchFilterForm,
  Drawer,
  FiltersIcon,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  Button,
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
          <div className="home__header">
            <h2 className="heading-secondary">Browse organizations</h2>
            <Drawer>
              <DrawerTrigger className="home__filters--mobile">
                <Button>
                  <FiltersIcon className="home__filters--icon" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="home__filters--mobile-content">
                <OrganizationsSearchFilterForm />
                <DrawerClose asChild>
                  <Button className="home__filters--apply-btn">
                    See Results
                  </Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          </div>
          <OrganizationsSearchFilterForm className="home__filters--desktop" />
          <OrganizationsTable />
        </div>
      </section>
    </OrganizationsListProvider>
  );
};

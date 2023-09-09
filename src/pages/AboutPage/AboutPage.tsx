import NotebookLines from "../../components/NotebookLines/NotebookLines";
import "./AboutPage.scss";
import Header from "../../components/Header/Header";

/**
 * A React component for rendering a About Page.
 *
 *
 * @returns - A JSX Element with the About Page
 */
const AboutPage = () => {
  return (
    <div className="About-page">
      <Header heading="About Us" />
      <NotebookLines />

      <main className="About-container">
        <h2>About Me</h2>
        <p>
          Hi there! I'm Fouzan Tariq, the developer behind my logic app. I am a
          second year undergradate student at Middle East Technical University.
          Most of the contents around which the calculators of this application
          are built, are concepts that I was introduced to in my introductory
          symbolic logic course. At the time, I could not find any suitable
          online tools to help me with my course, so here we are :).
        </p>
        <h2>About my logic hub</h2>
        <p>
          My Logic Hub contains tools for performing various logical
          calculations. This app is open-source and is licensed under the Apache
          License 2.0. This application is currently in development, and I also
          intend to keep on contributing to it as I learn more logical concepts.
          You can find the repository at{" "}
          <a href="https://github.com/kror-shack/logic-app">github</a>
        </p>

        <h2>Contact</h2>
        <p>
          If you have any questions, feedback, or suggestions, please feel free
          to reach out to me at support@mylogichub.com. Your input is valuable
          and helps me improve this app for everyone.
        </p>
      </main>
    </div>
  );
};

export default AboutPage;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./InfoLink.scss";

type Props = {
  url: string;
};

/**
 * Renders a reusable info link.
 *
 * @component
 * @param Props- The objects Props
 * @param Props.url - The url of the link to be redirected to.
 * @returns - A JSX link element.
 */
const InfoLink = ({ url }: Props) => {
  const [isScrolling, setIsScrolling] = useState(false);
  let scrollTimeout: NodeJS.Timeout;

  useEffect(() => {
    //to hide the text as the user is scrolling
    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {!isScrolling && (
        <p className="Info-link">
          For details, see <Link to={url}>info</Link>
        </p>
      )}
    </>
  );
};

export default InfoLink;
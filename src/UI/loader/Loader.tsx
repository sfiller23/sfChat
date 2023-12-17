import "./loader.css";

const Loader = (props) => {
  const { className } = props;
  return (
    <div className={`loader-container ${className}`}>
      <img
        className="loader"
        src="../../assets/gifs/loader.webp"
        alt="Loader"
      />
    </div>
  );
};

export default Loader;

import "./_loader.scss";

const Loader = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div className={`loader-container ${className}`}>
      <img className="loader" src="/loader.webp" alt="Loader" />
    </div>
  );
};

export default Loader;

import "./_layout.scss";

interface AppChildren {
  children: string | JSX.Element | JSX.Element[];
}

const Layout = (props: AppChildren) => {
  const { children } = props;
  return <div className="app-container">{children}</div>;
};

export default Layout;

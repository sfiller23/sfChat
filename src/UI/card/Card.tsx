import "./_card.scss";

interface Props {
  children: string | JSX.Element | JSX.Element[];
  classNames?: string[];
}

const Card = (props: Props) => {
  const { children, classNames } = props;
  return (
    <div className={`card ${classNames && classNames.toString()}`}>
      {children}
    </div>
  );
};

export default Card;

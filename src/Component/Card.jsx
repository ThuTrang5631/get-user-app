const Card = ({ src, name, email }) => {
  return (
    <div className="card">
      <div className="card-image">
        <img alt="image card" src={src}></img>
      </div>
      <p className="first-name">{name}</p>
      <p className="email">{email}</p>
    </div>
  );
};

export default Card;

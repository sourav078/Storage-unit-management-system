import { Link } from "react-router-dom";

const StorageUnitCard = ({ unit }) => {
  return (
    <div style={styles.card}>
      <h3>{unit.unitNumber}</h3>
      <p><strong>Size:</strong> {unit.size}</p>
      <p><strong>Location:</strong> {unit.location}</p>
      <p><strong>Price:</strong> ${unit.pricePerMonth}/month</p>
      <p><strong>Status:</strong> {unit.status}</p>

      <Link to={`/storage-units/${unit._id}`} style={styles.button}>
        View Details
      </Link>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  },
  button: {
    display: "inline-block",
    marginTop: "10px",
    textDecoration: "none",
    padding: "8px 12px",
    background: "#222",
    color: "#fff",
    borderRadius: "4px",
  },
};

export default StorageUnitCard;
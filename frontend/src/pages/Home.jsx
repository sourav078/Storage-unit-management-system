import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import StorageUnitCard from "../components/StorageUnitCard";

const Home = () => {
  const [storageUnits, setStorageUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStorageUnits();
  }, []);

  const fetchStorageUnits = async () => {
    try {
      const { data } = await axiosInstance.get("/storage-units");
      setStorageUnits(data);
    } catch (error) {
      console.error("Failed to fetch storage units", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div style={styles.container}>
      <h1>Find the Right Storage Unit</h1>
      <p>Browse available units by size and location.</p>

      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Search by location or size"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Search</button>
      </form>

      <div>
        {storageUnits.map((unit) => (
          <StorageUnitCard key={unit._id} unit={unit} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  button: {
    padding: "10px 16px",
    cursor: "pointer",
  },
};

export default Home;
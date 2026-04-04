import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    unitNumber: "",
    size: "",
    location: "",
    pricePerMonth: "",
  });

  const [storageUnits, setStorageUnits] = useState([]);

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/storage-units", {
        ...formData,
        pricePerMonth: Number(formData.pricePerMonth),
      });

      alert("Storage unit created successfully");
      setFormData({
        unitNumber: "",
        size: "",
        location: "",
        pricePerMonth: "",
      });
      fetchStorageUnits();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create storage unit");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

      <div style={styles.section}>
        <h3>Create Storage Unit</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="unitNumber"
            placeholder="Unit Number"
            value={formData.unitNumber}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="size"
            placeholder="Size"
            value={formData.size}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="pricePerMonth"
            type="number"
            placeholder="Price Per Month"
            value={formData.pricePerMonth}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Create Unit
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h3>All Storage Units</h3>
        {storageUnits.length === 0 ? (
          <p>No storage units found.</p>
        ) : (
          storageUnits.map((unit) => (
            <div key={unit._id} style={styles.card}>
              <p><strong>Unit Number:</strong> {unit.unitNumber}</p>
              <p><strong>Size:</strong> {unit.size}</p>
              <p><strong>Location:</strong> {unit.location}</p>
              <p><strong>Price:</strong> ${unit.pricePerMonth}</p>
              <p><strong>Status:</strong> {unit.status}</p>
            </div>
          ))
        )}
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
  section: {
    marginBottom: "30px",
  },
  form: {
    display: "grid",
    gap: "12px",
    maxWidth: "500px",
  },
  input: {
    padding: "10px",
  },
  button: {
    padding: "10px",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
};

export default AdminDashboard;
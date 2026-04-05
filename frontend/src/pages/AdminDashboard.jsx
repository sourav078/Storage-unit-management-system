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
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      await axiosInstance.post("/storage-units", {
        unitNumber: formData.unitNumber.trim(),
        size: formData.size.trim(),
        location: formData.location.trim(),
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <p>Manage storage units from here.</p>

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
            placeholder="Size (e.g. 10x10)"
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

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create Storage Unit"}
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
              <p><strong>Price Per Month:</strong> ${unit.pricePerMonth}</p>
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
    marginBottom: "32px",
    backgroundColor: "#fff",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  form: {
    display: "grid",
    gap: "12px",
    maxWidth: "500px",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    cursor: "pointer",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "10px",
    backgroundColor: "#fafafa",
  },
};

export default AdminDashboard;
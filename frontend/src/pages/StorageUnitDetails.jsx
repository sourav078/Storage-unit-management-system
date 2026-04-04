import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

const StorageUnitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUnit();
  }, [id]);

  const fetchUnit = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.get(`/storage-units/${id}`);
      setUnit(data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch storage unit");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      setBookingLoading(true);

      await axiosInstance.post("/bookings", {
        storageUnit: unit._id,
        startDate: new Date().toISOString(),
      });

      alert("Booking successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <p style={styles.message}>Loading storage unit details...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  if (!unit) {
    return <p style={styles.message}>Storage unit not found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Storage Unit Details</h2>

      <div style={styles.card}>
        <p><strong>Unit Number:</strong> {unit.unitNumber}</p>
        <p><strong>Size:</strong> {unit.size}</p>
        <p><strong>Location:</strong> {unit.location}</p>
        <p><strong>Price Per Month:</strong> ${unit.pricePerMonth}</p>
        <p><strong>Status:</strong> {unit.status}</p>

        {unit.status === "available" ? (
          <button
            onClick={handleBooking}
            style={styles.button}
            disabled={bookingLoading}
          >
            {bookingLoading ? "Booking..." : "Book This Unit"}
          </button>
        ) : (
          <button style={styles.disabledButton} disabled>
            Occupied
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: "16px",
    padding: "10px 14px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#222",
    color: "#fff",
  },
  disabledButton: {
    marginTop: "16px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#aaa",
    color: "#fff",
    cursor: "not-allowed",
  },
  message: {
    padding: "20px",
    textAlign: "center",
  },
  error: {
    padding: "20px",
    textAlign: "center",
    color: "red",
  },
};

export default StorageUnitDetails;
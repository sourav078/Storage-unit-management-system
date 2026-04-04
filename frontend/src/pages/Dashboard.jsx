import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axiosInstance.get("/bookings/my-bookings");
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <p>Your bookings are shown below.</p>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={styles.card}>
            <p><strong>Booking Status:</strong> {booking.status}</p>
            <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
            <p><strong>Unit Number:</strong> {booking.storageUnit?.unitNumber}</p>
            <p><strong>Location:</strong> {booking.storageUnit?.location}</p>
            <p><strong>Size:</strong> {booking.storageUnit?.size}</p>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
  },
};

export default Dashboard;
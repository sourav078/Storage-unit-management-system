import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import StorageUnitCard from "../components/StorageUnitCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SearchResults = () => {
  const location = useLocation();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    searchStorageUnits();
  }, [query]);

  const searchStorageUnits = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.get(
        `/storage-units/search?q=${encodeURIComponent(query)}`
      );

      setResults(data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to search storage units");
    } finally {
      setLoading(false);
    }
  };

  return (
   
        
          <div style={styles.container}>
             <Navbar />
            <h2>Search Results</h2>
            <p>
              Showing results for: <strong>{query}</strong>
            </p>

            {loading ? (
              <p>Searching...</p>
            ) : error ? (
              <p style={styles.error}>{error}</p>
            ) : results.length === 0 ? (
              <p>No matching storage units found.</p>
            ) : (
              results.map((unit) => (
                <StorageUnitCard key={unit._id} unit={unit} />
              ))
            )}
               <Footer /> 
          </div>
        
  
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  error: {
    color: "red",
  },
};

export default SearchResults;
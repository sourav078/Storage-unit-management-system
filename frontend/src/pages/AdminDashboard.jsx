import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialFormState = {
  unitNumber: "",
  size: "",
  location: "",
  pricePerMonth: "",
  description: "",
  status: "available",
};

const AdminDashboard = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [storageUnits, setStorageUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingUnitId, setEditingUnitId] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photosToRemove, setPhotosToRemove] = useState([]);

  useEffect(() => {
    fetchStorageUnits();
  }, []);

  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const fetchStorageUnits = async () => {
    try {
      const { data } = await axiosInstance.get("/storage-units");
      setStorageUnits(data);
    } catch (error) {
      console.error("Failed to fetch storage units", error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedFiles([]);
    setEditingUnitId(null);
    setExistingPhotos([]);
    setPhotosToRemove([]);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    const keptExistingPhotos = existingPhotos.filter(
      (photo) => !photosToRemove.includes(photo)
    );

    const remainingSlots = 5 - keptExistingPhotos.length;

    if (remainingSlots <= 0) {
      alert("You already have 5 photos. Remove some existing photos first.");
      e.target.value = "";
      return;
    }

    if (files.length > remainingSlots) {
      alert(`You can upload only ${remainingSlots} more photo(s).`);
      setSelectedFiles(files.slice(0, remainingSlots));
    } else {
      setSelectedFiles(files);
    }

    e.target.value = "";
  };

  const handleRemoveExistingPhoto = (photoPath) => {
    if (photosToRemove.includes(photoPath)) {
      setPhotosToRemove((prev) => prev.filter((item) => item !== photoPath));
      return;
    }

    setPhotosToRemove((prev) => [...prev, photoPath]);
  };

  const handleRemoveSelectedFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const startEdit = (unit) => {
    setEditingUnitId(unit._id);
    setFormData({
      unitNumber: unit.unitNumber || "",
      size: unit.size || "",
      location: unit.location || "",
      pricePerMonth: unit.pricePerMonth || "",
      description: unit.description || "",
      status: unit.status || "available",
    });
    setExistingPhotos(unit.photos || []);
    setPhotosToRemove([]);
    setSelectedFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const keptExistingPhotos = existingPhotos.filter(
      (photo) => !photosToRemove.includes(photo)
    );

    if (keptExistingPhotos.length + selectedFiles.length > 5) {
      alert("A storage unit can have a maximum of 5 photos.");
      return;
    }

    try {
      setLoading(true);

      const multipartFormData = new FormData();
      multipartFormData.append("unitNumber", formData.unitNumber.trim());
      multipartFormData.append("size", formData.size.trim());
      multipartFormData.append("location", formData.location.trim());
      multipartFormData.append("pricePerMonth", String(Number(formData.pricePerMonth)));
      multipartFormData.append("description", formData.description.trim());
      multipartFormData.append("status", formData.status);

      if (editingUnitId) {
        multipartFormData.append(
          "removeExistingPhotos",
          JSON.stringify(photosToRemove)
        );
      }

      selectedFiles.forEach((file) => {
        multipartFormData.append("photos", file);
      });

      if (editingUnitId) {
        await axiosInstance.put(`/storage-units/${editingUnitId}`, multipartFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Storage unit updated successfully");
      } else {
        await axiosInstance.post("/storage-units", multipartFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Storage unit created successfully");
      }

      resetForm();
      fetchStorageUnits();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save storage unit");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (unitId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this storage unit?"
    );

    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/storage-units/${unitId}`);
      alert("Storage unit deleted successfully");

      if (editingUnitId === unitId) {
        resetForm();
      }

      fetchStorageUnits();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete storage unit");
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h2>Admin Dashboard</h2>
      <p>Manage storage units from here.</p>

      <div style={styles.section}>
        <h3>{editingUnitId ? "Edit Storage Unit" : "Create Storage Unit"}</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="unitNumber"
            placeholder="Unit Number"
            value={formData.unitNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="size"
            placeholder="Size (e.g. 10x10)"
            value={formData.size}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="pricePerMonth"
            type="number"
            placeholder="Price Per Month"
            value={formData.pricePerMonth}
            onChange={handleChange}
            style={styles.input}
            required
            min="0"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows={4}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="inactive">Inactive</option>
          </select>

          <div>
            <label style={styles.label}>Upload Photos (max 5)</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              style={styles.input}
            />
          </div>

          {editingUnitId && existingPhotos.length > 0 && (
            <div>
              <h4>Existing Photos</h4>
              <div style={styles.photoGrid}>
                {existingPhotos.map((photo, index) => {
                  const markedForRemoval = photosToRemove.includes(photo);

                  return (
                    <div
                      key={`${photo}-${index}`}
                      style={{
                        ...styles.photoCard,
                        opacity: markedForRemoval ? 0.45 : 1,
                      }}
                    >
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL.replace("/api", "")}${photo}`}
                        alt={`Storage Unit ${index + 1}`}
                        style={styles.image}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingPhoto(photo)}
                        style={styles.smallDangerButton}
                      >
                        {markedForRemoval ? "Undo Remove" : "Remove"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {previewUrls.length > 0 && (
            <div>
              <h4>New Selected Photos</h4>
              <div style={styles.photoGrid}>
                {previewUrls.map((previewUrl, index) => (
                  <div key={previewUrl} style={styles.photoCard}>
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      style={styles.image}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedFile(index)}
                      style={styles.smallDangerButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading
                ? editingUnitId
                  ? "Updating..."
                  : "Creating..."
                : editingUnitId
                ? "Update Storage Unit"
                : "Create Storage Unit"}
            </button>

            {editingUnitId && (
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.section}>
        <h3>All Storage Units</h3>

        {storageUnits.length === 0 ? (
          <p>No storage units found.</p>
        ) : (
          storageUnits.map((unit) => (
            <div key={unit._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p><strong>Unit Number:</strong> {unit.unitNumber}</p>
                  <p><strong>Size:</strong> {unit.size}</p>
                  <p><strong>Location:</strong> {unit.location}</p>
                  <p><strong>Price Per Month:</strong> ${unit.pricePerMonth}</p>
                  <p><strong>Status:</strong> {unit.status}</p>
                  {unit.description && (
                    <p><strong>Description:</strong> {unit.description}</p>
                  )}
                </div>

                <div style={styles.actions}>
                  <button
                    type="button"
                    style={styles.smallButton}
                    onClick={() => startEdit(unit)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    style={styles.smallDangerButton}
                    onClick={() => handleDelete(unit._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {unit.photos?.length > 0 && (
                <div style={styles.photoGrid}>
                  {unit.photos.map((photo, index) => (
                    <div key={`${photo}-${index}`} style={styles.photoCard}>
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL.replace("/api", "")}${photo}`}
                        alt={`Unit ${unit.unitNumber} ${index + 1}`}
                        style={styles.image}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
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
    maxWidth: "650px",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    fontSize: "14px",
    resize: "vertical",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 14px",
    cursor: "pointer",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  secondaryButton: {
    padding: "10px 14px",
    cursor: "pointer",
    backgroundColor: "#e5e5e5",
    color: "#222",
    border: "none",
    borderRadius: "4px",
  },
  smallButton: {
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  smallDangerButton: {
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: "#b42318",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "14px",
    backgroundColor: "#fafafa",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "12px",
    marginTop: "14px",
  },
  photoCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "8px",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "6px",
    display: "block",
    marginBottom: "8px",
  },
};

export default AdminDashboard;
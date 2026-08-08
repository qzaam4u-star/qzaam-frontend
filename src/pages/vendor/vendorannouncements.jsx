import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function VendorAnnouncements() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("offer");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const res = await api.get("/offers");

      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("image", image);

      const res = await api.post("/offers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      setTitle("");
      setDescription("");
      setCategory("offer");
      setStartDate("");
      setEndDate("");
      setImage(null);

      loadAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || "failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("delete this announcement?")) return;

    try {
      await api.delete(`/offers/${id}`);
      loadAnnouncements();
    } catch (err) {
      alert("failed to delete");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        vendor announcements
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-3"
          rows="4"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="offer">offer</option>
          <option value="anniversary offer">anniversary offer</option>
          <option value="festival offer">festival offer</option>
          <option value="new service">new service</option>
        </select>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg p-3"
            required
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-lime-400 hover:bg-lime-500 text-black font-bold px-6 py-3 rounded-lg"
        >
          {loading ? "submitting..." : "submit for approval"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">
          my announcements
        </h2>
        <div className="grid gap-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>

                <p className="text-sm text-gray-600 mt-1">
                  {item.description}
                </p>

                <p className="text-sm mt-2">
                  category : {item.category}
                </p>

                <p className="text-sm">
                  valid : {new Date(item.startDate).toLocaleDateString()} -{" "}
                  {new Date(item.endDate).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    item.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : item.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status.toLowerCase()}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-40 h-32 rounded-lg object-cover"
                  />
                )}

                <button
                  onClick={() => deleteAnnouncement(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  delete
                </button>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              no announcements found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

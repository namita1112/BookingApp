import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels");
  const hotelsPerPage = 20; // Number of hotels per page
  const hotelsPerRow = 4; // Number of hotels in each row

  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Slice the hotels for pagination
  const startIndex = (currentPage - 1) * hotelsPerPage;
  const endIndex = startIndex + hotelsPerPage;
  const currentHotels = data.slice(startIndex, endIndex);

  // Chunk the hotels into rows of 4
  const rows = [];
  for (let i = 0; i < currentHotels.length; i += hotelsPerRow) {
    rows.push(currentHotels.slice(i, i + hotelsPerRow));
  }

  const totalPages = Math.ceil(data.length / hotelsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="fp">
      {rows.map((row, rowIndex) => (
        <div className="fpRow" key={rowIndex}>
          {row.map((item) => (
            <div className="fpItem" key={item._id}>
              <img
                src={`https://bookingapp-api-cog2.onrender.com/${item.photos[0]}`}
                alt=""
                className="fpImg"
              />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">Starting from ₹{item.cheapestPrice}</span>
              {item.rating && (
                <div className="fpRating">
                  <button>{item.rating}</button>
                  {/* <span>Excellent</span> */}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeaturedProperties;

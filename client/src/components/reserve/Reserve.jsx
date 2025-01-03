import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reserve.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/searchContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reserve = ({ setOpen, hotelId }) => {
  const { data } = useFetch(`/hotels/find/${hotelId}`);
  const { date, options } = useContext(SearchContext);

  // State for user input
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2){
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const startDate = date[0]?.startDate ? new Date(date[0].startDate) : today;
  const endDate = date[0]?.endDate ? new Date(date[0].endDate) : tomorrow;
  const days = dayDifference(endDate, startDate);
  console.log("days",days);
  console.log("price", data.cheapestPrice);
  console.log("room", options.room);
  const grandTotal = data?.cheapestPrice && options.room
    ? days * data.cheapestPrice * options.room
    : 0;
  console.log("grandTotal: ",grandTotal);


  const handleClick = async () => {
    try {
      // Prepare reservation details
      const reservationDetails = {
        userName,
        userEmail,
        userPhone,
        hotel: {
          name: data.name,
          address: data.address,
          pricePerNight: data.cheapestPrice,
          grandTotal: grandTotal,
        },
        stayDetails: {
          startDate: startDate,
          endDate: endDate,
          numberOfNights: days
        },
        options: {
          adults: options.adult || 1,
          children: options.children || 0,
          rooms: options.room || 1,
        },
      };

      // Send the reservation details via an email service
      const response = await axios.post("/hotels/sendEmail", reservationDetails);
      if (response.status === 200) {
        toast.success("Reservation details have been sent to your email! We will contact you soon.");
        setOpen(false); // Close modal on success
      }
    } catch (err) {
      console.error("Error sending reservation details:", err);
      toast.error("Failed to send reservation details. Please try again.");
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)} />
        <span>Enter your details:</span>
        <div className="rItem">
          <label>Name</label>
          <input
            placeholder="Full Name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="rItem">
          <label>Email</label>
          <input
            placeholder="Email ID"
            type="text"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="rItem">
          <label>Mobile</label>
          <input
            placeholder="Mobile Number"
            type="number"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
          />
        </div>
        <div className="rItem">
          <button onClick={handleClick} className="rButton">
            Reserve Now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reserve;

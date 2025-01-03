import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetch from "../../hooks/useFetch";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SearchContext } from "../../context/searchContext";
import Reserve from "../../components/reserve/Reserve";
// import Reserve from "../../components/reserve/Reserve";
// import Reserve from "../../components/reserve/Reserve";

const Hotel = () => {
  const { id } = useParams(); // Extract the dynamic segment "id"

  console.log("Hotel ID:", id); 
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(`/hotels/find/${id}`)
  console.log("hotel data: ",data);

  const {date, options} = useContext(SearchContext);
  console.log("dates",date);
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
  console.log(days);
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? data.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === data.photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };

  const handleClick = () => {
    setOpenModal(true);
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      { loading ? (
        "loading"
      ) : (
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={`https://bookingapp-api-cog2.onrender.com/${data.photos[slideNumber]}`} alt="" className="sliderImg" />
              {/* <img src={data.photos[slideNumber]} alt="" className="sliderImg" /> */}
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button className="bookNow" onClick={handleClick}>Reserve or Book Now!</button>
          <h1 className="hotelTitle">{data.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{data.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {data.distance}m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ₹{data.cheapestPrice} at this property.
          </span>
          <div className="hotelImages">
            {data.photos?.slice(0, 6).map((photo, i) => (
              <div className="hotelImgWrapper" key={i} style={{ position: 'relative' }}>
              <img
                onClick={() => handleOpen(i)}
                src={`https://bookingapp-api-cog2.onrender.com/${photo}`}
                alt=""
                className="hotelImg"
                style={{
                  opacity: i === 5 ? 0.5 : 1,  // Apply opacity
                  filter: i === 5 ? 'brightness(0.7) contrast(1.2)' : 'none', // Dim and enhance contrast for last image
                }}
              />
              {i === 5 && (
                <div onClick={() => handleOpen(i)}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    height: '100%',
                    width: '100%',
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Show All Images
                </div>
              )}
            </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">{data.title}</h1>
              <p className="hotelDesc">
               {data.desc}
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a {days}-night stay!</h1>
              <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span>
              <h2>
              {(() => {
                  const basePrice = days * data.cheapestPrice * options.room;

                  // Included adults in the base price (2 adults per room)
                  const includedAdults = options.room * 2;

                  // Extra adults beyond included adults
                  const extraAdults = options.adult > includedAdults ? options.adult - includedAdults : 0;

                  // Charges for extra adults (assume they pay full price per night)
                  const extraAdultCharges = extraAdults * data.cheapestPrice * days;

                  // Charges for children (assume they pay 50% of `data.cheapestPrice`)
                  const childCharges = options.children > 0 ? options.children * (data.cheapestPrice * 0.5) * days : 0;

                  // Total price
                  const totalPrice = basePrice + extraAdultCharges + childCharges;

                  return (
                    <>
                      <b>₹{totalPrice}</b> ({days} nights for {options.adult} adults and {options.children} children)
                    </>
                  );
                })()}

              </h2>


              <button onClick={handleClick}>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
        <MailList />
        <Footer />
      </div>)}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}
    </div>
  );
};

export default Hotel;

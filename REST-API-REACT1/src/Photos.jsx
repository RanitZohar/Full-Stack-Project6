import "./css/Photos.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function Photos() {
  //const [userPhotos, setUserPhotos] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, steLoading] = useState(false);
  //   extract the album id from the URL
  const id = window.location.pathname.split("/")[2];
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState([]);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const initialLoadCount = 10; // Number of photos to load initially
  const loadCountIncrement = 5; // Number of additional photos to load on each "Load More" click

  useEffect(() => {
    steLoading(true);
    FetchPhotos(albumId);
    
}, [albumId]);

  const FetchPhotos= async (albumId) => {
    try {
      //const userId = userInfo.id;
      const response = await fetch(`http://localhost:3000/photos/:${albumId}`);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      // Process the received data
      console.log("photos");
      console.log(data);
     setPhotos(data);
     setVisiblePhotos(data.slice(0, initialLoadCount));
    setLoadMoreVisible(data.length > initialLoadCount);


    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
    }
  }

  

  const handleLoadMore = () => {
    const currentLength = visiblePhotos.length;
    const newVisiblePhotos = photos.slice(0, currentLength + loadCountIncrement);
    setVisiblePhotos(newVisiblePhotos);
    setLoadMoreVisible(photos.length > newVisiblePhotos.length);
  };

  return (
    <div className="photos-container">
      <h2 className="photos-heading">Your Photos</h2>
      <ul className="photos-list">
        {visiblePhotos.length > 0 ? (
          visiblePhotos.map((item) => (
            <li key={item.id} className="photo-item">
              <div className="photo-thumbnail">
                <img src={item.thumbnailUrl} alt={item.title} />
              </div>
              <p className="photo-title">{item.title}</p>
            </li>
          ))
        ) : (
          <p>No photos found.</p>
        )}
      </ul>
      {loadMoreVisible && (
        <button className="load-more-button" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );

}

export default Photos;

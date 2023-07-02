import "./css/Albums.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";

export function Albums({ id }) {
  const [userAlbums, setUserAlbums] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = userInfo.id;
        const response = await fetch(`http://localhost:3000/albums/:${userId}`);
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        // Process the received data
        console.log(data);

        setUserAlbums(data);
      } catch (error) {
        // Handle any errors
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="container">
      <h2 className="title">User Albums</h2>
      <div className="albums">
        {userAlbums.length > 0 ? (
          userAlbums.map((album) => (
            <div className="album" key={album.id}>
              <Link to={`/users/${userInfo.name}/albums/${album.id}/photos`} className="album-link">
                {album.title}
              </Link>
            </div>
          ))
        ) : (
          <p className="loading_message">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Albums;

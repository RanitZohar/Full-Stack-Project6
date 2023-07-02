import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, React } from "react";
import "./css/Posts.css";

export function Posts() {
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userPostsComments, setUserPostsComments] = useState([]);
  const [commentsFlag, setCommentsFlag] = useState(false);
  const [selectedPostFlag, setSelectedPostFlag] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("currentUser")) || [];
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newCommentBody, setNewCommentBody] = useState("");
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentEmail, setNewCommentEmail] = useState("");
  const [appearAddPost, setAppearAddPost] = useState(false);
  const [appearAddComment, setAppearAddComment] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // state to track the todo id being edited
  const [newComName, setNewComName] = useState("");
  const [newComMail, setNewComMail] = useState("");
  const [newComBody, setNewComBody] = useState("");
  const [editingCom, setEditingCom] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = userInfo.id;
      const response = await fetch(`http://localhost:3000/posts/:${userId}`);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      // Process the received data
      console.log(data);
      
      setUserPosts(data);
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
    }
  };

  const fetchComment = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/comments/:${postId}`);
      if (!response.ok) {
        throw new Error("Request failed of comments");
      }
      const data = await response.json();
      // Process the received data
      console.log(data);
      setUserPostsComments(data);
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
    }
  };

  const ShowComments = async (postId) => {
    if (commentsFlag) {
      setCommentsFlag(false);
    } else {
      setCommentsFlag(true);
      fetchComment(postId);
    }
  };

  const handlePostSelection = (postId) => {
    setSelectedPost(postId);
    setSelectedPostFlag(!selectedPostFlag);
  };

  const getPostTitleStyle = (postId) => {
    if (selectedPost === postId && selectedPostFlag) {
      return {
        fontWeight: "bold",
        color: "red",
      };
    } // selectedPostFlag  is false
    return {
      fontWeight: "normal",
      color: "black",
    };
  };

  const getPostBodyStyle = (postId) => {
    if (selectedPost === postId && selectedPostFlag) {
      return {
        fontWeight: "bold",
        color: "blue",
      };
    } // selectedPostFlag  is false
    return {
      fontWeight: "normal",
      color: "black",
    };
  };

  const AppearAddPost = () => {
    setAppearAddPost(!appearAddPost);
  };

  const AddPost = async () => {
    const newPost = {
      userId: userInfo.id,
      title: newPostTitle,
      body: newPostBody,
    };
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error("Failed to add new Post");
      }
      const data = await response.json();
      console.log(data[0]);
      setNewPostTitle("");
      setNewPostBody("");
      setAppearAddPost(false); // Déplacer cette ligne ici
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewPostTitleChange = (event) => {
    setNewPostTitle(event.target.value);
  };
  const handleNewPostBodyChange = (event) => {
    setNewPostBody(event.target.value);
  };

  const AppearAddComment = () => {
    setAppearAddComment(!appearAddComment);
  };

  const handleNewCommentBodyChange = (event) => {
    setNewCommentBody(event.target.value);
  };
  const handleNewCommentNameChange = (event) => {
    setNewCommentName(event.target.value);
  };
  const handleNewCommentEmailChange = (event) => {
    setNewCommentEmail(event.target.value);
  };

  const handleAddComment = async (postId) => {
    // Logic to handle adding a new comment
    const newComment = {
      postId: postId,
      body: newCommentBody,
      name: newCommentName,
      email: newCommentEmail,
    };
    try {
      const response = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error("Failed to add new comment");
      }
      const data = await response.json();
      console.log(data[0]);
      setNewCommentBody("");
      setNewCommentName("");
      setNewCommentEmail("");
      setAppearAddComment(false); // Déplacer cette ligne ici
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleEditPost = (postId) => {
    setEditingPost(postId);
    const postToEdit = userPosts.find((post) => post.id === postId);
    setNewPostTitle(postToEdit.title); // Set initial value of the input field
    setNewPostBody(postToEdit.body);
    return null;
  };
  const handleUpdatePost = async (postId, newTitle, newBody) => {
    const postEdit = {
      title: newTitle,
      body: newBody,
    };
    try {
      const response = await fetch(`http://localhost:3000/posts/:${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postEdit),
      });
      if (!response.ok) {
        throw new Error("Request failed for updating post");
      }
      const data = await response.json();
      console.log(data);
      fetchData();

      setEditingPost(null); // Reset editing state after updating
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/:${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Request failed for deleting post");
      }
      const data = await response.json();
      console.log(data);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/comments/:${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Request failed for deleting comments");
      }
      const data = await response.json();
      console.log(data);
      setUserPostsComments((prevComments) => {
        return prevComments.filter((comment) => comment.id !== commentId);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditCom = (commentId) => {
    setEditingCom(commentId);
    const comToEdit = userPostsComments.find((com) => com.id === commentId);
    setNewComName(comToEdit.name); // Set initial value of the input field
    setNewComMail(comToEdit.email);
    setNewComBody(comToEdit.body);
    return null;
  };

  const handleUpdateCom = async (
    commentId,
    newName,
    newMail,
    newBody,
    currentpostId
  ) => {
    const comEdit = {
      postId: currentpostId,
      name: newName,
      email: newMail,
      body: newBody,
    };
    try {
      const response = await fetch(
        `http://localhost:3000/comments/:${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comEdit),
        }
      );
      if (!response.ok) {
        throw new Error("Request failed for updating comment");
      }
      // const contentType = response.headers.get("Content-Type");
      // if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(data);
      fetchComment(currentpostId);

      setEditingCom(null); // Reset editing state after updating
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancelEditCom = () => {
    setEditingCom(null);
  };

  return (
    <div className="posts_container">
      {/* the headline of the page */}
      <h1 className="posts_header">{`${userInfo.name}'s Posts List:`}</h1>
      {/* print the posts list */}
      <button className="AddNewPost" onClick={AppearAddPost}>
        + Add New Post
      </button>
      {appearAddPost ? (
        <div className="addTodoSection">
          <input
            type="text"
            placeholder="title"
            minLength={2}
            maxLength={40}
            value={newPostTitle}
            onChange={handleNewPostTitleChange}
            required
          />
          <input
            type="text"
            placeholder="body"
            minLength={2}
            maxLength={45}
            value={newPostBody}
            onChange={handleNewPostBodyChange}
            required
          />
          <button className="buttonAddNewPost" onClick={AddPost}>
            Add new Post
          </button>
        </div>
      ) : (
        <div></div>
      )}
      {userPosts.length > 0 ? (
        <div className="posts_list_user">
          {userPosts.map((post) => (
            <span className="posts" key={post.id}>
              <div className="titleAndBodyPost">
                <h4 style={getPostTitleStyle(post.id)}>
                  {" "}
                  <a style={{ textDecorationLine: "underline" }}> Title:</a>
                  <a> </a>
                  {post.title}
                </h4>
                <p style={getPostBodyStyle(post.id)}>
                  <a style={{ textDecorationLine: "underline" }}> Body:</a>
                  <a> </a>
                  {post.body}
                </p>
                <div className="editPost">
                  {editingPost === post.id ? (
                    // Show input field for editing
                    <>
                      <div>
                        <textarea
                          type="text"
                          minLength={2}
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          className="title_post"
                        />
                      </div>
                      <div>
                        <textarea
                          type="text"
                          minLength={2}
                          value={newPostBody}
                          onChange={(e) => setNewPostBody(e.target.value)}
                          className="body_post"
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleUpdatePost(post.id, newPostTitle, newPostBody)
                        }
                      >
                        Finish
                      </button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    // Show edit button
                    <button
                      className="deleteEditPost"
                      onClick={() => handleEditPost(post.id)}
                    >
                      ✎
                    </button>
                  )}
                </div>
                <button
                  className="deleteEditPost"
                  onClick={() => handleDeletePost(post.id)}
                >
                  🗑
                </button>
              </div>
              <button
                className="selectButton"
                onClick={() => handlePostSelection(post.id)}
              >
                Select
              </button>
              <button
                className="commentsButton"
                onClick={() => ShowComments(post.id)}
              >
                show comments
              </button>
              {/* add CommentButton */}
              <button className="addCommentButton" onClick={AppearAddComment}>
                Add Comment
              </button>
              {appearAddComment ? (
                <div className="addPostSection">
                  <input
                    type="text"
                    placeholder="body"
                    minLength={2}
                    maxLength={35}
                    value={newCommentBody}
                    onChange={handleNewCommentBodyChange}
                    required
                  />
                  <input
                    type="text"
                    placeholder="name"
                    minLength={2}
                    maxLength={15}
                    value={newCommentName}
                    onChange={handleNewCommentNameChange}
                    required
                  />
                  <input
                    type="email"
                    placeholder="email"
                    value={newCommentEmail}
                    onChange={handleNewCommentEmailChange}
                    required
                  />
                  <button
                    className="buttonAddNewPost"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Add new Comment
                  </button>
                </div>
              ) : (
                <div></div>
              )}
              {/* end add CommentButton   */}
              {/* showig comment for the chosen post  */}
              {commentsFlag && userPostsComments.length > 0 && (
                <ul className="comments_list_user">
                  {userPostsComments
                    .filter((comment) => comment.postId === post.id) // Filter comments by postId
                    .map((comment) => (
                      <li className="comment" key={comment.id}>
                        <a style={{ textDecorationLine: "underline" }}>
                          {" "}
                          body:
                        </a>{" "}
                        {comment.body} <br />
                        <a style={{ textDecorationLine: "underline" }}>
                          {" "}
                          name:
                        </a>{" "}
                        {comment.name} <br />
                        <a style={{ textDecorationLine: "underline" }}>
                          {" "}
                          email:
                        </a>{" "}
                        {comment.email}
                        <div className="editCom">
                          {editingCom === comment.id ? (
                            // Show input field for editing
                            <>
                              <div>
                                <textarea
                                  type="text"
                                  minLength={2}
                                  value={newComBody}
                                  onChange={(e) =>
                                    setNewComBody(e.target.value)
                                  }
                                  className="body_com"
                                  required
                                />
                              </div>
                              <div>
                                <textarea
                                  type="text"
                                  minLength={2}
                                  value={newComName}
                                  onChange={(e) =>
                                    setNewComName(e.target.value)
                                  }
                                  className="name_com"
                                  required
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  minLength={2}
                                  maxLength={25}
                                  value={newComMail}
                                  onChange={(e) =>
                                    setNewComMail(e.target.value)
                                  }
                                  // className="body_post"
                                  required
                                />
                              </div>

                              <button
                                onClick={() =>
                                  handleUpdateCom(
                                    comment.id,
                                    newComName,
                                    newComMail,
                                    newComBody,
                                    comment.postId
                                  )
                                }
                              >
                                Finish
                              </button>
                              <button onClick={handleCancelEditCom}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            // Show edit button
                            <button
                              className="deleteEditComment"
                              onClick={() => handleEditCom(comment.id)}
                            >
                              ✎
                            </button>
                          )}
                        </div>
                        <button
                          className="deleteEditComment"
                          onClick={() =>
                            handleDeleteComment(comment.id, comment.postId)
                          }
                        >
                          🗑
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="loading_message">Loading...</p>
      )}
    </div>
  );
}

"use client";
import React from "react";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";
const PromptCardList = ({ data, handleTagClick, handleViewProfile }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={() => handleTagClick(post)}
          handleViewProfile={handleViewProfile}
        />
      ))}
    </div>
  );
};
const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [postLoaded, setPostLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    console.log(response);
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const showPostBySearch = async (e) => {
    e.preventDefault();
    const results = [];
    const response = await fetch("/api/prompt");
    const prompts = await response.json();
    console.log(prompts);
    for (const property in prompts) {
      if (
        prompts[property]["prompt"].includes(searchText) ||
        prompts[property]["tag"].includes(searchText) ||
        prompts[property]["creator"]["email"].includes(searchText) ||
        prompts[property]["creator"]["username"].includes(searchText)
      )
        results.push(prompts[property]);
    }
    setPosts(results);
  };

  const showPostByTag = async (post) => {
    setSearchText(post.tag);
    const results = [];
    const response = await fetch("/api/prompt");
    const prompts = await response.json();
    for (const property in prompts) {
      if (prompts[property]["tag"].includes(post.tag))
        results.push(prompts[property]);
    }
    setPosts(results);
  };

  const handleViewProfile = (userId) => {
    console.log(userId);
    // console.log(session.user._id);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center" onSubmit={showPostBySearch}>
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {
        <PromptCardList
          data={posts}
          handleTagClick={showPostByTag}
          handleViewProfile={handleViewProfile}
        />
      }
    </section>
  );
};

export default Feed;

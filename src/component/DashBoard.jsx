import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa";
import Logout from "../Buttons/Logout.jsx";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import Filter from "./Filter.jsx";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [problems, setProblems] = useState([]);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:3000/user/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/leetcode/problems", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userData) {
        setProblems(addStatusToProblems(response.data.problems));
      } else {
        setProblems(response.data.problems);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const fetchFilter = async (filters = {}) => {
    try {
      const { search = "", difficulty = "", status = "", relatedTopic = "" } = filters;
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/leetcode/all",
        {},
        {
          params: { search, difficulty, status, relatedTopic },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProblems(addStatusToProblems(response.data.data));
    } catch (error) {
      console.error("Error fetching filtered problems:", error);
    }
  };

  // Function to add solved status to problems
  const addStatusToProblems = (problemsList) => {
    if (!userData) return problemsList;
    
    const solvedProblems = userData.problems_solved?.map((p) => p.toLowerCase().trim()) || [];

    return problemsList.map((problem) => {
      const problemName = problem.main?.name?.toLowerCase().trim();
      return { ...problem, isSolved: solvedProblems.includes(problemName) };
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchProblems();
    }
  }, [userData]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-emerald-400";
      case "medium": return "text-amber-400";
      case "hard": return "text-rose-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="fixed w-full h-16 bg-zinc-900/90 flex justify-between items-center px-6 z-50">
        <Link to="/" className="text-2xl font-bold text-white">
          Fire<span className="text-orange-500">Code</span>
        </Link>
        <div className="flex items-center gap-6">
          {userData && (
            <div className="cursor-pointer group relative">
              <FaUserCircle className="w-8 h-8 text-[#b3b3b3]" />
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#2c2c2c] text-orange-500 p-3 rounded shadow-lg group-hover:scale-100 scale-0 transition-all">
                <p className="text-sm font-medium">{userData.email}</p>
              </div>
            </div>
          )}
          {userData ? (
            <Logout setUserData={setUserData} />
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="py-2 px-4 bg-[#1a1a1a] hover:bg-[#2c2c2c] text-white text-sm font-bold rounded">
                Log In
              </Link>
              <Link to="/signup" className="py-2 px-4 bg-orange-500 hover:opacity-90 text-black text-sm font-bold rounded">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-8 pb-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            "QUALITY OVER QUANTITY" <span className="ml-2">👌</span>
          </h2>
        </div>
        
        {/* Filter Component */}
        <div className="container mx-auto px-8">
          <Filter onApplyFilters={fetchFilter} />
        </div>
       
        {/* Table */}
        <div className=" rounded-xl overflow-hidden mt-6">
          <table className="w-full text-left border-collapse">
            <thead className="">
              <tr className="text-zinc-400 text-sm font-semibold bg-zinc-900">
              
                <th className="py-4 px-6 w-16">Status</th>
                
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Difficulty</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Solution</th>
                
              </tr>
             
            </thead>
            
            <tbody>

              {problems.map((problem, index) => (
                <tr key={problem._id || index} className="hover:bg-zinc-700/50 transition">
                  <td className="py-4 px-6">
                    {problem.isSolved ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Link to={`/dashboard/${problem.main?.id}`} className="text-white hover:text-orange-500">
                      {problem.main?.name}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-medium ${getDifficultyColor(problem.main?.difficulty)}`}>
                      {problem.main?.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {problem.main?.related_topics.join(", ") || "Array"}
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-500">
                    Coming soon
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

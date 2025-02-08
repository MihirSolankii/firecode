import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const Filter = ({ onApplyFilters }) => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");
  const [relatedTopic, setRelatedTopic] = useState("");

  const handleFilter = () => {
    const filters = { search, difficulty, status, relatedTopic };
    onApplyFilters(filters);
    console.log(filters);
    
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("");
    setStatus("");
    setRelatedTopic("");
    onApplyFilters({});
  };

  return (
    <div className="w-full p-4 border border-zinc-700 bg-zinc-900 rounded-xl flex flex-col md:flex-row items-center gap-4">
      {/* Search Bar */}
      <div className="flex-grow">
        <input
          type="text"
          className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          placeholder="Search problem name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Difficulty Dropdown */}
      <div className="relative">
        <select
          className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Status Dropdown */}
      <div className="relative">
        <select
          className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
          <option value="attempted">Attempted</option>
        </select>
      </div>

      {/* Related Topics */}
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          placeholder="Related topic..."
          value={relatedTopic}
          onChange={(e) => setRelatedTopic(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 text-white">
        <Button variant="secondary" onClick={handleFilter}>
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default Filter;

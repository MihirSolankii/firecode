// src/components/LearnedTopicsForm.jsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from './components/ui/button';

const LearnedTopicsForm = () => {
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [learnedTopics, setLearnedTopics] = useState([]);

  // Check if the current user is admin
  const isAdmin = email === 'adminleet@gmail.com';

  const handleAddTopic = () => {
    if (topic.trim()) {
      setLearnedTopics((prev) => [...prev, topic]);
      setTopic(''); // Clear the topic input
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Learned Topics Form</h1>

      {/* Email Input */}
      <div>
        <label className="block mb-1 text-lg">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Topic Input + Add Button */}
      <div className="space-y-2">
        <label className="block mb-1 text-lg">Learned Topic</label>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isAdmin} // Disable input for admin
          />
          <Button
            onClick={handleAddTopic}
            disabled={isAdmin || !topic.trim()} // Disable button for admin or empty input
          >
            Add Topic
          </Button>
        </div>
      </div>

      {/* Display Learned Topics */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Learned Topics:</h2>
        <ul className="list-disc pl-6 space-y-1">
          {learnedTopics.length === 0 ? (
            <li>No topics added yet.</li>
          ) : (
            learnedTopics.map((t, index) => <li key={index}>{t}</li>)
          )}
        </ul>
      </div>
    </div>
  );
};

export default LearnedTopicsForm;

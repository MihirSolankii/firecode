import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const name = localStorage.getItem("name"); // Get the name from localStorage
  
        // Make sure token is not null or undefined
        if (!token) {
          console.error('Token is missing');
          return;
        }
  
        // Send the request with proper headers
        const response = await axios.post(
          `http://localhost:3000/leetcode/submissions/${name}`,
          {}, // The body is empty or has necessary data
          {
            headers: {
              Authorization: `Bearer ${token}` // Correctly set the Authorization header
            }
          }
        );
  
        // Handle response data
        setSubmissions(response.data);
        console.log(response.data);
  
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setIsLoading(false);
      }
    };
  
    fetchSubmissions();
  }, []);

  const handleRuntimeClick = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
    setCopySuccess(''); // Reset copy success message when closing modal
  };

  const renderSubmissionDetails = () => {
    if (!selectedSubmission) return null;

    const copyToClipboard = () => {
      navigator.clipboard.writeText(selectedSubmission.code_body).then(() => {
        setCopySuccess('Code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy code: ', err);
        setCopySuccess('Failed to copy code.');
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] p-6 rounded-lg max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Submission Details</h2>
            <button 
              onClick={closeModal} 
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <p className="font-semibold">Problem Name</p>
                <p>{selectedSubmission.problem_name}</p>
              </div>
              <div>
                <p className="font-semibold">Submission Time</p>
                <p>{new Date(selectedSubmission.time).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">Language</p>
                <p>{selectedSubmission.language}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p className={`font-bold ${selectedSubmission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedSubmission.status}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="font-semibold mb-2">Submission Code</p>
              <pre className="bg-[#1a1a1a] p-2 rounded-lg overflow-x-auto text-sm text-white">
                <code>{selectedSubmission.code_body}</code>
              </pre>
              <button 
                onClick={copyToClipboard}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
              >
                Copy Code
              </button>
              {copySuccess && <p className="mt-2 text-green-500">{copySuccess}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-white p-4">Loading submissions...</div>;
  }

  return (
    <div className="p-4 bg-zinc-800 text-white">
      <h2 className="text-xl font-bold mb-4">Submissions</h2>
      
      {submissions.length === 0 ? (
        <p className="text-gray-400">No submissions found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-1000">
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Runtime</th>
              <th className="p-2 text-left">Memory</th>
              <th className="p-2 text-left">Language</th>
              <th className="p-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr 
                key={submission._id} 
                className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition"
              >
                <td className={`p-2 cursor-pointer hover:text-blue-500 ${submission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`} onClick={() => handleRuntimeClick(submission)}>
                  {submission.status}
                </td>
                <td 
                  className="p-2 "
                  
                >
                  {(submission.runtime * 1000).toFixed(2)} ms
                </td>
                <td className="p-2">{submission.memory.toFixed(2)} MB</td>
                <td className="p-2">{submission.language}</td>
                <td className="p-2">{new Date(submission.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {renderSubmissionDetails()}
    </div>
  );
};

export default Submissions;

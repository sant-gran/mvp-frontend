import React, { useState } from 'react';
import axios from 'axios';

const Algorithm = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/algorithm/', { email }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response && response.data) {
        console.log("Full API Response:", JSON.stringify(response.data, null, 2));
        setResult(response.data);
      } else {
        console.error("Unexpected API response:", response);
        setError("Unexpected response from the server");
      }
    } catch (err) {
      console.error('Error:', err.response?.data?.error || 'An error occurred');
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Find Your Similar Users</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          required
        />
        <button
          type="submit"
          style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Find Matches'}
        </button>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>Error: {error}</p>}

      {/* Display user's top traits */}
      {result?.user && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Your Predominant Traits</h2>
            <ul style={{ marginTop: '10px' }}>
              {result.user.top_traits?.length > 0 ? (
                result.user.top_traits.map((traitArr, index) => {
                  console.log("Rendering Fixed Top Trait:", traitArr);
                  const [traitName, traitScore] = traitArr; // Extract values from array
                  return (
                    <li key={index}>
                      <strong>{traitName || "Unknown Trait"}</strong>:
                      {traitScore !== undefined ? traitScore.toFixed(2) : "N/A"}
                    </li>
                  );
                })
              ) : (
                <li>No traits found</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Display similar users */}
      {result?.similar_users?.length > 0 ? (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>Top Similar Users</h2>
          {result.similar_users.map((user, idx) => (
            <div key={idx} style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.name || "Unknown User"}</h3>
              <p>Similarity Score: <strong>{user.similarity_score !== undefined ? (user.similarity_score * 100).toFixed(2) + "%" : "N/A"}</strong></p>

              <h4 style={{ marginTop: '10px', fontWeight: 'bold' }}>Shared Traits:</h4>
              <ul>
                {user.matching_traits && Object.keys(user.matching_traits).length > 0 ? (
                Object.entries(user.matching_traits).map(([traitName, scores], index) => {
                  console.log("Rendering Shared Trait:", traitName, scores);
                  return (
                    <li key={index}>
                      <strong>{traitName || "Unknown Trait"}</strong>:
                      {scores.user_score !== undefined ? ` ${scores.user_score.toFixed(2)} (You)` : " N/A"} -
                      {scores.matched_user_score !== undefined ? ` ${scores.matched_user_score.toFixed(2)} (Matched User)` : " N/A"}
                    </li>
                  );
                })
              ) : (
                <li>No shared traits found</li>
              )}

              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>We couldn't find any similar users yet.</p>
      )}
    </div>
  );
};

export default Algorithm;

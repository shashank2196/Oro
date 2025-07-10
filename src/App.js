import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGitHubData = async () => {
    if (!username) {
      setError('Please enter a GitHub username');
      return;
    }
    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);

    try {
      const profileResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!profileResponse.ok) {
        throw new Error('User not found');
      }
      const profileData = await profileResponse.json();
      setProfile(profileData);

      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!reposResponse.ok) {
        throw new Error('Error fetching repositories');
      }
      const reposData = await reposResponse.json();
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>GitHub Profile Viewer</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 8, width: '100%', marginBottom: 10, fontSize: 16 }}
      />
      <button onClick={fetchGitHubData} style={{ padding: '8px 16px', fontSize: 16 }}>
        {loading ? 'Loading...' : 'Fetch Profile'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile && (
        <div style={{ marginTop: 20 }}>
          <h2>{profile.name || profile.login}</h2>
          <img src={profile.avatar_url} alt="avatar" style={{ width: 100, borderRadius: '50%' }} />
          <p>{profile.bio}</p>
          <p>
            <strong>Followers:</strong> {profile.followers} | <strong>Following:</strong> {profile.following}
          </p>
          <p>
            <a href={profile.html_url} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </p>
        </div>
      )}
      {repos.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Repositories</h3>
          <ul>
            {repos.map((repo) => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
                {repo.description && <p>{repo.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

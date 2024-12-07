import React, { useState } from 'react';
import { getUserData } from './firebase.js';

const UserDataDisplay = ({ data }) => {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl rounded-2xl p-6 space-y-4 border border-blue-200">
        <div className="flex items-center space-x-4 border-b pb-4 border-blue-300">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-800 capitalize">{data.planet ? `${data.nickname}` : 'Interplanetary Explorer'}</h2>
            <p className="text-blue-600">Interplanetary Citizen Profile</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value], index) => {
            if (['nickname', 'planet', 'username'].includes(key)) return null;
            return (
              <div 
                key={key}
                className="bg-white p-3 rounded-lg shadow-md transition-all hover:scale-[1.02]"
              >
                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">{key.replace('_', ' ')}</p>
                <p className="text-lg font-bold text-blue-900">{value}</p>
              </div>
            );
          })}
        </div>
        
      </div>
    );
};

const Bank = () => {
  const [nickname, setNickname] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  const handleNicknameChange = (e) => {
    const arabicOnly = e.target.value.replace(/[^ء-ي\s]/g, '');
    setNickname(arabicOnly);
  };

  const handleSearch = async () => {
    setError('');
    setUserData(null);

    if (!nickname.trim() || !selectedPlanet) {
      setError('Please enter a nickname and select a planet');
      return;
    }

    setLoading(true);
    
    try {
      const data = await getUserData(`planets/${selectedPlanet}/${nickname}`);
      if (data) {
        setUserData({...data, nickname, planet: selectedPlanet});
      } else {
        setError("No data found for this nickname and planet");
      }
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md transition-all duration-500 ease-in-out">
      <section className="flex flex-col space-y-4 transform transition-transform">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter your nickname"
            className="border border-black w-6/12 p-2 rounded hover:scale-[1.02] focus:scale-[1.02] transition-transform"
            value={nickname}
            onChange={handleNicknameChange}
          />
          <select 
            value={selectedPlanet}
            onChange={(e) => setSelectedPlanet(e.target.value)}
            className="border border-black w-5/12 p-2 rounded hover:scale-[1.02] focus:scale-[1.02] transition-transform"
          >
            <option value="">Select a planet</option>
            <option value="jupiter">Jupiter</option>
            <option value="mars">Mars</option>
            <option value="venus">Venus</option>
            <option value="mercury">Mercury</option>
            <option value="neptune">Neptune</option>
          </select>
          <button 
          onClick={handleSearch} 
          disabled={loading}
          className="border border-black w-1/12 flex items-center justify-center rounded hover:scale-110 active:scale-90 transition-transform"
        >
          {loading ? '...' : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          )}
        </button>
    </div>

        {error && (
          <p className="text-red-500 transition-all duration-300 ease-in-out">
            {error}
          </p>
        )}

        {userData && (
          <div className="mt-4 transition-all duration-500 ease-in-out">
            <UserDataDisplay data={userData} />
          </div>
        )}
      </section>

      <footer className="mt-4 text-center opacity-0 animate-fade-in-delayed">
        <p>
          App created by <a href="#" className="text-blue-500">Arthur</a>
        </p>
      </footer>
    </div>
  );
};

export default Bank;
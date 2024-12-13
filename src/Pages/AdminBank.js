import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import { 
  getUserData, 
  updateUserData, 
  sendMultiUserData, 
  deleteUser 
} from "./firebase.js";

const AdminBank = () => {
  const [planetsData, setPlanetsData] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    balance: '',
    rank: 'عضو',
    bagage: 'لا يوجد',
    warnings: '0'
  });
  const [nickname, setNickname] = useState('');
  const [multiUserInput, setMultiUserInput] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPlanetsData = async () => {
      try {
        const db = getDatabase();
        const planetsRef = ref(db, 'planets');
        const snapshot = await get(planetsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const planetsList = Object.keys(data).map(planetId => ({
            id: planetId,
            name: planetId,
            users: Object.entries(data[planetId]).map(([username, userData]) => ({
              username,
              ...userData
            }))
          }));
          
          setPlanetsData(planetsList);
          if (planetsList.length > 0) {
            setSelectedPlanet(planetsList[0].id);
          }
        }
      } catch (err) {
        setError("Failed to fetch planets: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanetsData();
  }, []);

  const handlePlanetSelect = (e) => {
    setSelectedPlanet(e.target.value);
    setSelectedUser(null);
  };

  const handleUserSelect = (username) => {
    const user = planetsData
      .find(planet => planet.id === selectedPlanet)
      ?.users.find(u => u.username === username);
    
    setSelectedUser(user);
    setUserForm({
      username: user.username,
      balance: user.balance,
      rank: user.rank,
      bagage: user.bagage,
      warnings: user.warnings
    });
  };

  const handleAddUser = async () => {
    try {
      const userData = {
        username: userForm.username,
        balance: userForm.balance || '0',
        rank: userForm.rank || 'عضو',
        bagage: userForm.bagage || 'لا يوجد',
        warnings: userForm.warnings || '0'
      };
  
      await updateUserData(`planets/${selectedPlanet}/${userForm.username}`, userData);
      
      const updatedData = await fetchUpdatedPlanetsData();
      setPlanetsData(updatedData);
  
      setUserForm({
        username: '',
        balance: '',
        rank: 'عضو',
        bagage: 'لا يوجد',
        warnings: '0'
      });
  
      setSuccessMessage('User added successfully');
    } catch (err) {
      setError('Failed to add user: ' + err.message);
    }
  };
  

  const handleUpdateUser = async () => {
    try {
      await updateUserData(`planets/${selectedPlanet}/${userForm.username}`, userForm);
      
      setPlanetsData(prev => 
        prev.map(planet => 
          planet.id === selectedPlanet 
            ? { 
                ...planet, 
                users: planet.users.map(u => 
                  u.username === userForm.username ? userForm : u
                ) 
              }
            : planet
        )
      );

      setSelectedUser(null);
      setUserForm({
        username: '',
        balance: '',
        rank: 'عضو',
        bagage: 'لا يوجد',
        warnings: '0'
      });

      setSuccessMessage('User updated successfully');
    } catch (err) {
      setError('Failed to update user: ' + err.message);
    }
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Delete user ${username}?`)) {
      try {
        await deleteUser(`planets/${selectedPlanet}/${username}`);
        
        setPlanetsData(prev => 
          prev.map(planet => 
            planet.id === selectedPlanet 
              ? { ...planet, users: planet.users.filter(u => u.username !== username) }
              : planet
          )
        );

        setSuccessMessage('User deleted successfully');
      } catch (err) {
        setError('Failed to delete user: ' + err.message);
      }
    }
  };

  const parseAndAddUsers = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!selectedPlanet) {
      setError('Please select a planet');
      setLoading(false);
      return;
    }

    const lines = multiUserInput.split('\n').map(line => line.trim()).filter(line => line);

    try {
      const updatePromises = lines.map(async (line) => {
        const [username, balance, warnings, bagage] = line.split('|').map(item => item.trim());

        const userData = {
          username,
          balance: balance || '0',
          warnings: warnings || '0',
          bagage: bagage || 'لا يوجد',
          rank: 'عضو',
          bagage: 'لا يوجد'
        };

        await updateUserData(`planets/${selectedPlanet}/${username}`, userData);
      });

      await Promise.all(updatePromises);

      const updatedPlanetsData = await fetchUpdatedPlanetsData();
      setPlanetsData(updatedPlanetsData);

      setSuccessMessage(`Successfully added/updated ${lines.length} users`);
      setMultiUserInput('');
    } catch (error) {
      console.error('Error adding users:', error);
      setError('Failed to add users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatedPlanetsData = async () => {
    try {
      const db = getDatabase();
      const planetsRef = ref(db, 'planets');
      const snapshot = await get(planetsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data).map(([planetId, planetData]) => ({
          id: planetId,
          name: planetId,
          users: planetData.users || []
        }));
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch updated planets data:", err);
      return [];
    }
  };

  const handleSendData = async () => {
    setSendLoading(true);
    setError('');
    setSuccessMessage('');

    if (!multiUserInput.trim()) {
      setError('Please enter data to send');
      setSendLoading(false);
      return;
    }

    try {
      await sendMultiUserData(multiUserInput);
      setSuccessMessage('Data sent successfully');
      setMultiUserInput('');
    } catch (error) {
      console.error('Error sending data:', error);
      setError('Failed to send data');
    } finally {
      setSendLoading(false);
    }
  };

  const handleSearch = async () => {
    setError('');
    setLoading(true);

    if (!nickname.trim() || !selectedPlanet) {
      setError('Please enter a nickname and select a planet');
      setLoading(false);
      return;
    }

    try {
      const userData = await getUserData(`planets/${selectedPlanet}/${nickname}`);
      
      if (userData) {
        setSelectedUser({
          ...userData,
          username: nickname,
          planet: selectedPlanet
        });
        setSuccessMessage('User found successfully');
      } else {
        setError("No user found with this nickname");
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        <div className="mb-4">
          <select 
            value={selectedPlanet}
            onChange={handlePlanetSelect}
            className="w-full p-2 border rounded"
          >
            {planetsData.map(planet => (
              <option key={planet.id} value={planet.id}>
                {planet.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={userForm.username}
                onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                className="w-full p-2 border rounded"
                disabled={!!selectedUser}
              />
              <input
                type="text"
                placeholder="Balance"
                value={userForm.balance}
                onChange={(e) => setUserForm({...userForm, balance: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="bagage"
                value={userForm.bagage}
                onChange={(e) => setUserForm({...userForm, bagage: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <select
                value={userForm.rank}
                onChange={(e) => setUserForm({...userForm, rank: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="عضو">عضو</option>
                <option value="مشرف">مشرف</option>
                <option value="قائد">قائد</option>
                <option value="وزير">وزير</option>
                <option value="قاضي">قاضي</option>
                <option value="ملكة">ملكة</option>
              </select>

              <div className="flex space-x-2">
                {selectedUser ? (
                  <button
                    type="button"
                    onClick={handleUpdateUser}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Update User
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    Add User
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <div className="max-h-96 overflow-y-auto">
              {planetsData
                .find(p => p.id === selectedPlanet)
                ?.users.map(user => (
                  <div 
                    key={user.username} 
                    className="flex justify-between items-center p-2 border-b hover:bg-gray-100"
                  >
                    <span 
                      onClick={() => handleUserSelect(user.username)}
                      className="flex-grow cursor-pointer"
                    >
                      {user.username} - {user.rank}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Multi-User Management</h2>
            <textarea
              placeholder="Enter users (username|balance|warnings|bagage)"
              value={multiUserInput}
              onChange={(e) => setMultiUserInput(e.target.value)}
              className="w-full p-2 border rounded h-40"
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={parseAndAddUsers}
                disabled={loading}
                className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Add Multiple Users'}
              </button>
              <button
                onClick={handleSendData}
                disabled={sendLoading}
                className="w-1/2 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {sendLoading ? 'Sending...' : 'Send Data'}
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">User Search</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-grow p-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>
            
            {selectedUser && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-bold mb-2">User Details</h3>
                <p>Username: {selectedUser.username}</p>
                <p>Balance: {selectedUser.balance}</p>
                <p>Rank: {selectedUser.rank}</p>
                <p>Warnings: {selectedUser.warnings}</p>
                <p>Bagage: {selectedUser.bagage}</p>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="mt-2 bg-red-500 text-white p-2 rounded"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBank;
import React, { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import { FaUserShield } from 'react-icons/fa';

const MyProfile = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md text-center space-y-4">
      <img
        src={user?.photoURL || 'https://i.ibb.co/SnZqZZT/user-default.png'}
        alt="User Profile"
        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-green-300"
      />

      <h2 className="text-2xl font-bold">{user?.displayName || 'Anonymous User'}</h2>

      <p className="text-gray-600">
        <strong>Email:</strong> {user?.email || 'Not Available'}
      </p>

      {role && role !== 'user' && (
        <div className="inline-flex items-center gap-2 justify-center mt-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
          <FaUserShield /> {role.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default MyProfile;

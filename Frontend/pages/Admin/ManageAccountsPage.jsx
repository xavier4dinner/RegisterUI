import React, { useEffect, useState } from 'react';
import ManageAccountCard from '../../components/common/ManageAccountCard';

const ManageAccountsPage = () => {
  const [accountsByRole, setAccountsByRole] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BACKEND: Fetch all user accounts from the backend API
    // Endpoint should return an array of accounts with at least: id, name, email, role
    fetch('/api/accounts/all') // <-- Update with your real endpoint
      .then(res => res.json())
      .then(data => {
        // Group accounts by role
        const grouped = {};
        data.forEach(acc => {
          if (!grouped[acc.role]) grouped[acc.role] = [];
          grouped[acc.role].push(acc);
        });
        setAccountsByRole(grouped);
        setLoading(false);
      });
  }, []);

  // BACKEND: Call backend API to delete an account by ID
  // Endpoint should remove the account from the database
  const handleDelete = (id) => {
    fetch(`/api/accounts/${id}/delete`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          // Remove account from UI after successful backend deletion
          setAccountsByRole(prev => {
            const updated = { ...prev };
            for (const role in updated) {
              updated[role] = updated[role].filter(acc => acc.id !== id);
            }
            return updated;
          });
        }
      });
  };

  if (loading) return <div>Loading...</div>;

  const hasAccounts = Object.values(accountsByRole).some(arr => arr.length > 0);

  return (
    <div className="manage-accounts-page-container">
      {!hasAccounts && (
        <div style={{textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '1.2rem'}}>
          No accounts found.
        </div>
      )}
      {Object.entries(accountsByRole).map(([role, accounts]) => (
        accounts.length > 0 && (
          <div key={role} className="role-section">
            <h2>{role}</h2>
            {accounts.map(account => (
              <ManageAccountCard
                key={account.id}
                account={account}
                onDelete={() => handleDelete(account.id)}
              />
            ))}
          </div>
        )
      ))}
    </div>
  );
};

export default ManageAccountsPage; 
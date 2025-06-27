import React, { useEffect, useState } from 'react';
import AccountCard from '../../components/common/AccountCard';

const ApprovalOfAccountsPage = () => {
  const [accountsByRole, setAccountsByRole] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BACKEND: Fetch all pending accounts from the backend API
    // Endpoint should return an array of accounts with at least: id, name, email, role
    fetch('/api/accounts/pending') // <-- Update with your real endpoint
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

  // BACKEND: Call backend API to approve or reject an account by ID
  // Endpoint should update the account's status accordingly
  const handleAction = (id, action) => {
    fetch(`/api/accounts/${id}/${action}`, { method: 'POST' })
      .then(res => {
        if (res.ok) {
          // Remove account from UI after successful backend update
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
    <div className="approval-page-container">
      {!hasAccounts && (
        <div style={{textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '1.2rem'}}>
          No accounts pending approval.
        </div>
      )}
      {Object.entries(accountsByRole).map(([role, accounts]) => (
        accounts.length > 0 && (
          <div key={role} className="role-section">
            <h2>{role}</h2>
            {accounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                onAccept={() => handleAction(account.id, 'approve')}
                onReject={() => handleAction(account.id, 'reject')}
              />
            ))}
          </div>
        )
      ))}
    </div>
  );
};

export default ApprovalOfAccountsPage; 
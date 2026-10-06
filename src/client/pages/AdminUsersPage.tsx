import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient.ts';
import { User } from '../../types/index.ts';
import {
  Users,
  Search,
  Shield,
  GraduationCap,
  Briefcase,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.getAdminUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.warn('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      await api.suspendUser(userId, !currentStatus);
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user suspension state');
    }
  };

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          User Management &amp; Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Monitor all registered students, mentors, and administrators across the platform.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by user name or email address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer self-stretch sm:self-auto"
        >
          <option value="ALL">All Roles ({users.length})</option>
          <option value="student">Students</option>
          <option value="mentor">Mentors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Joined Date</th>
                <th className="py-3.5 px-5">Account Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map(u => {
                const isSuspended = !!u.isSuspended;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500">{u.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'mentor'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {u.createdAt.split('T')[0]}
                    </td>

                    <td className="py-3.5 px-5">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 text-[11px]">
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleSuspend(u.id, isSuspended)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isSuspended
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {isSuspended ? 'Unsuspend User' : 'Suspend Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

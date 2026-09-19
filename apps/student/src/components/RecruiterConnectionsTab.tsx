import React, { useState, useEffect } from 'react';
import {
  Users,
  Building,
  MapPin,
  Clock,
  Send,
  UserCheck,
  Check,
  X,
  Shield,
  Search,
  CheckCircle2,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { Recruiter, RecruiterInvitation, StudentProfile } from '../types';
import { api } from '../services/api';

interface RecruiterConnectionsTabProps {
  profile: StudentProfile | null;
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
}

export const RecruiterConnectionsTab: React.FC<RecruiterConnectionsTabProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [invitations, setInvitations] = useState<RecruiterInvitation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'discover' | 'network' | 'invitations'>('discover');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState<{ [id: string]: boolean }>({});

  const [permitRecruiterVisibility, setPermitRecruiterVisibility] = useState<boolean>(
    profile?.permitRecruiterVisibility ?? true
  );

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [recRes, invRes] = await Promise.all([
          api.getRecruiters().catch(() => ({ recruiters: [] })),
          api.getInvitations().catch(() => ({ invitations: [] })),
        ]);
        setRecruiters(Array.isArray(recRes?.recruiters) ? recRes.recruiters : []);
        setInvitations(Array.isArray(invRes?.invitations) ? invRes.invitations : []);
      } catch (err) {
        console.error('Failed to load recruiter data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleConnect = async (recruiterId: string) => {
    try {
      setIsSending((prev) => ({ ...prev, [recruiterId]: true }));
      await api.connectWithRecruiter(recruiterId);
      setRecruiters((prev) =>
        prev.map((r) => (r.id === recruiterId ? { ...r, connectionStatus: 'pending_sent' } : r))
      );
    } catch (err) {
      console.error('Failed to send connection request:', err);
    } finally {
      setIsSending((prev) => ({ ...prev, [recruiterId]: false }));
    }
  };

  const handleInvitationResponse = async (id: string, status: 'accepted' | 'declined') => {
    try {
      await api.respondToInvitation(id, status);
      setInvitations((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
      );
      if (status === 'accepted') {
        const inv = invitations.find((i) => i.id === id);
        if (inv) {
          setRecruiters((prev) =>
            prev.map((r) => (r.id === inv.recruiterId ? { ...r, connectionStatus: 'connected' } : r))
          );
        }
      }
    } catch (err) {
      console.error('Failed to update invitation:', err);
    }
  };

  const handleToggleRecruiterVisibility = async () => {
    const nextVal = !permitRecruiterVisibility;
    setPermitRecruiterVisibility(nextVal);
    onUpdateProfile({ permitRecruiterVisibility: nextVal });
    try {
      await api.updateProfile({ permitRecruiterVisibility: nextVal });
    } catch (err) {
      console.error('Failed to update profile visibility:', err);
    }
  };

  const safeRecruiters = Array.isArray(recruiters) ? recruiters : [];
  const safeInvitations = Array.isArray(invitations) ? invitations : [];

  const filteredRecruiters = safeRecruiters.filter((r) => {
    if (selectedDomain !== 'All') {
      const matchHiringDomain = Array.isArray(r.hiringDomains) && r.hiringDomains.includes(selectedDomain as any);
      const matchInterests = Array.isArray(r.mutualInterests) && r.mutualInterests.some((i) =>
        i.toLowerCase().includes(selectedDomain.toLowerCase())
      );
      if (!matchHiringDomain && !matchInterests) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name?.toLowerCase().includes(q);
      const matchCompany = r.company?.toLowerCase().includes(q);
      const matchTitle = r.designation?.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchTitle) return false;
    }
    return true;
  });

  const connectedList = safeRecruiters.filter((r) => r.connectionStatus === 'connected');
  const pendingList = safeRecruiters.filter((r) => r.connectionStatus === 'pending_sent');
  const pendingInvitations = safeInvitations.filter((i) => i.status === 'pending');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recruiter Connections
            </h1>
            <span className="bg-accent-subtle text-accent-themed text-xs font-semibold px-2.5 py-0.5 rounded-full border border-accent-themed/20">
              Verified Network
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Connect with technical talent partners and hiring managers looking for verified project proofs of work.
          </p>
        </div>

        {/* Profile Visibility Toggle */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-2xs">
          <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-slate-800 dark:text-white block">Profile Visible to Recruiters</span>
            <span className="text-slate-500 dark:text-slate-400">
              {permitRecruiterVisibility ? 'Public to verified recruiters' : 'Hidden'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleRecruiterVisibility}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
              permitRecruiterVisibility ? 'bg-accent-themed' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                permitRecruiterVisibility ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('discover')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'discover'
              ? 'bg-accent-themed text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Discover Recruiters ({safeRecruiters.length})
        </button>

        <button
          onClick={() => setActiveSubTab('network')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'network'
              ? 'bg-accent-themed text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          My Network ({connectedList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('invitations')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'invitations'
              ? 'bg-accent-themed text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Invitations ({safeInvitations.length})</span>
          {pendingInvitations.length > 0 && (
            <span className="bg-amber-400 text-slate-900 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingInvitations.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. Sub-Tab 1: Discover */}
      {activeSubTab === 'discover' && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recruiter name, company (e.g. Bosch, Zoho, NVIDIA)..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-themed shadow-2xs"
              />
            </div>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-accent-themed shadow-2xs"
            >
              <option value="All">All Domains</option>
              <option value="Robotics">Robotics</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Software Development">Software Development</option>
              <option value="Embedded Systems">Embedded Systems</option>
              <option value="Semiconductor Technology">Semiconductor Technology</option>
            </select>
          </div>

          {/* Recruiters Grid */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading recruiters...</div>
          ) : filteredRecruiters.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              No recruiters found matching your filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecruiters.map((recruiter) => {
                const isConnected = recruiter.connectionStatus === 'connected';
                const isPending = recruiter.connectionStatus === 'pending_sent';
                const skills = (recruiter.mutualInterests && recruiter.mutualInterests.length > 0)
                  ? recruiter.mutualInterests
                  : (recruiter.hiringDomains || []);

                return (
                  <div
                    key={recruiter.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-accent-themed transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Recruiter Header */}
                      <div className="flex items-start space-x-3 mb-3">
                        <img
                          src={recruiter.avatarUrl}
                          alt={recruiter.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {recruiter.name}
                          </h3>
                          <p className="text-xs text-accent-themed font-medium truncate">
                            {recruiter.designation}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{recruiter.company}</span>
                          </div>
                        </div>
                      </div>

                      {/* Location & Skills */}
                      <div className="space-y-2 text-xs py-3 border-t border-slate-100 dark:border-slate-800">
                        {recruiter.location && (
                          <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{recruiter.location}</span>
                          </div>
                        )}

                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            Hiring & Focus:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skills.slice(0, 4).map((sk) => (
                              <span
                                key={sk}
                                className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      {isConnected ? (
                        <div className="flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                          <UserCheck className="w-4 h-4" />
                          <span>Connected</span>
                        </div>
                      ) : isPending ? (
                        <div className="flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span>Request Sent</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConnect(recruiter.id)}
                          disabled={isSending[recruiter.id]}
                          className="w-full inline-flex items-center justify-center space-x-1.5 bg-accent-themed hover:brightness-110 text-white py-2 px-3 rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSending[recruiter.id] ? 'Sending...' : 'Connect'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Sub-Tab 2: My Network */}
      {activeSubTab === 'network' && (
        <div className="space-y-6">
          {/* Active Connections */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Connected Recruiters ({connectedList.length})</span>
            </h3>

            {connectedList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connectedList.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-10 h-10 rounded-lg object-cover border dark:border-slate-750"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {c.designation} · {c.company}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Connected via Shared DB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You haven't connected with any recruiters yet. Browse the Discover tab to connect!
              </p>
            )}
          </div>

          {/* Pending Sent Requests */}
          {pendingList.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Pending Requests ({pendingList.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pendingList.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border dark:border-slate-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{p.company}</p>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Awaiting response</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Sub-Tab 3: Invitations */}
      {activeSubTab === 'invitations' && (
        <div className="space-y-4">
          {safeInvitations.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              No interview invitations received yet. Complete more project milestones and increase your AS score to attract recruiter invitations!
            </div>
          ) : (
            safeInvitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-accent-themed bg-accent-subtle border border-accent-themed/20 px-2 py-0.5 rounded-md">
                      {inv.company}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400">{inv.sentDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Opportunity: {inv.roleTitle}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    "{inv.message}"
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Invited by: <strong className="text-slate-700 dark:text-slate-300">{inv.recruiterName}</strong>
                  </span>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center space-x-2">
                  {inv.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleInvitationResponse(inv.id, 'accepted')}
                        className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() => handleInvitationResponse(inv.id, 'declined')}
                        className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize ${
                        inv.status === 'accepted'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Invitation {inv.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

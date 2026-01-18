'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Vote,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Zap,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react';
import '../../../styles/design-system.css';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  category: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorumRequired: number;
  timeRemaining: string;
  createdAt: string;
  endDate: string;
}

const ModernGovernance = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [userVote, setUserVote] = useState<'for' | 'against' | 'abstain' | null>(null);

  const proposals: Proposal[] = [
    {
      id: '1',
      title: 'Network Upgrade: Quantum Consensus v2.0',
      description:
        'Proposal to upgrade the network to the new quantum consensus algorithm for improved security and performance.',
      proposer: 'QuantumFoundation',
      status: 'active',
      category: 'Technical',
      votesFor: 15420000,
      votesAgainst: 2340000,
      votesAbstain: 890000,
      totalVotes: 18650000,
      quorumRequired: 20000000,
      timeRemaining: '5 days 12 hours',
      createdAt: '2024-01-15',
      endDate: '2024-01-30',
    },
    {
      id: '2',
      title: 'Treasury Allocation: Community Development Fund',
      description:
        'Allocate 5% of treasury funds to community development initiatives and grants program.',
      proposer: 'CommunityDAO',
      status: 'active',
      category: 'Treasury',
      votesFor: 12890000,
      votesAgainst: 5670000,
      votesAbstain: 1200000,
      totalVotes: 19760000,
      quorumRequired: 20000000,
      timeRemaining: '2 days 8 hours',
      createdAt: '2024-01-10',
      endDate: '2024-01-25',
    },
    {
      id: '3',
      title: 'Fee Structure Update: Reduce Transaction Costs',
      description:
        'Proposal to reduce base transaction fees by 30% to improve network accessibility.',
      proposer: 'EconomicsCommittee',
      status: 'passed',
      category: 'Economic',
      votesFor: 22340000,
      votesAgainst: 3450000,
      votesAbstain: 1890000,
      totalVotes: 27680000,
      quorumRequired: 20000000,
      timeRemaining: 'Completed',
      createdAt: '2024-01-01',
      endDate: '2024-01-15',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-blue-500 to-cyan-500';
      case 'passed':
        return 'from-green-500 to-emerald-500';
      case 'rejected':
        return 'from-red-500 to-pink-500';
      case 'pending':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return Clock;
      case 'passed':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'pending':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const calculateVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const handleVote = (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    setUserVote(vote);
    // Here you would typically call an API to submit the vote
    console.log(`Voted ${vote} on proposal ${proposalId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      {/* Header */}
      <div className="quantum-glass border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
        <div className="quantum-container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 quantum-bg-primary rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Governance</h1>
                <p className="text-gray-400">Participate in community decision making</p>
              </div>
            </div>
            <button className="quantum-btn quantum-btn-primary">
              <Plus className="w-4 h-4" />
              Create Proposal
            </button>
          </div>
        </div>
      </div>

      <div className="quantum-container py-8">
        {/* Stats Overview */}
        <div className="quantum-grid quantum-grid-4 gap-6 mb-8">
          {[
            {
              label: 'Active Proposals',
              value: '12',
              icon: Vote,
              color: 'from-blue-500 to-cyan-500',
            },
            {
              label: 'Total Voters',
              value: '45.2K',
              icon: Users,
              color: 'from-purple-500 to-pink-500',
            },
            {
              label: 'Voting Power',
              value: '2.8M QAU',
              icon: Zap,
              color: 'from-emerald-500 to-teal-500',
            },
            {
              label: 'Participation',
              value: '78.5%',
              icon: TrendingUp,
              color: 'from-amber-500 to-orange-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="quantum-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { id: 'active' as const, label: 'Active Proposals', count: 2 },
            { id: 'completed' as const, label: 'Completed', count: 15 },
            { id: 'all' as const, label: 'All Proposals', count: 17 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`quantum-btn ${
                activeTab === tab.id ? 'quantum-btn-primary' : 'quantum-btn-ghost'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals
            .filter(
              (proposal) =>
                activeTab === 'all' ||
                (activeTab === 'active' && proposal.status === 'active') ||
                (activeTab === 'completed' && ['passed', 'rejected'].includes(proposal.status))
            )
            .map((proposal, index) => {
              const StatusIcon = getStatusIcon(proposal.status);
              const forPercentage = calculateVotePercentage(proposal.votesFor, proposal.totalVotes);
              const againstPercentage = calculateVotePercentage(
                proposal.votesAgainst,
                proposal.totalVotes
              );
              const abstainPercentage = calculateVotePercentage(
                proposal.votesAbstain,
                proposal.totalVotes
              );
              const quorumProgress = (proposal.totalVotes / proposal.quorumRequired) * 100;

              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="quantum-card quantum-card-interactive"
                >
                  {/* Proposal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getStatusColor(proposal.status)} flex items-center justify-center`}
                      >
                        <StatusIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{proposal.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getStatusColor(proposal.status)} text-white`}
                          >
                            {proposal.status.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 text-xs bg-white/10 text-gray-400 rounded-md">
                            {proposal.category}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{proposal.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>by {proposal.proposer}</span>
                          <span>·</span>
                          <span>{proposal.createdAt}</span>
                          <span>·</span>
                          <span>{proposal.timeRemaining}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voting Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Voting Progress</span>
                      <span className="text-sm text-gray-400">
                        {proposal.totalVotes.toLocaleString()} /{' '}
                        {proposal.quorumRequired.toLocaleString()} QAU
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div
                        className="h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(quorumProgress, 100)}%` }}
                      />
                    </div>

                    {/* Vote Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          {forPercentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">For</div>
                        <div className="text-xs text-gray-500">
                          {proposal.votesFor.toLocaleString()} QAU
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">
                          {againstPercentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">Against</div>
                        <div className="text-xs text-gray-500">
                          {proposal.votesAgainst.toLocaleString()} QAU
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-400">
                          {abstainPercentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">Abstain</div>
                        <div className="text-xs text-gray-500">
                          {proposal.votesAbstain.toLocaleString()} QAU
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voting Actions */}
                  {proposal.status === 'active' && (
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(proposal.id, 'for')}
                          className={`quantum-btn ${
                            userVote === 'for' ? 'quantum-btn-primary' : 'quantum-btn-ghost'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Vote For
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 'against')}
                          className={`quantum-btn ${
                            userVote === 'against' ? 'quantum-btn-primary' : 'quantum-btn-ghost'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Vote Against
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 'abstain')}
                          className={`quantum-btn ${
                            userVote === 'abstain' ? 'quantum-btn-primary' : 'quantum-btn-ghost'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                          Abstain
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="quantum-btn quantum-btn-ghost">
                          <FileText className="w-4 h-4" />
                          Details
                        </button>
                        <button className="quantum-btn quantum-btn-ghost">
                          <ExternalLink className="w-4 h-4" />
                          Discussion
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ModernGovernance;

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Shield, 
  DollarSign, 
  Users, 
  FileText, 
  Award,
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Building,
  Zap,
  Heart,
  Cpu,
  Target,
  CheckCircle,
  Download
} from 'lucide-react';

interface STOProject {
  project_id: string;
  name: string;
  symbol: string;
  category: string;
  description: string;
  issuer: {
    name: string;
    jurisdiction: string;
    verified: boolean;
  };
  token_details: {
    price_per_token: number;
    currency: string;
    minimum_investment: number;
    dividend_frequency: string;
  };
  funding: {
    target_amount: number;
    raised_amount: number;
    progress: number;
    investors_count: number;
  };
  status: string;
  compliance: {
    kyc_required: boolean;
    accredited_only: boolean;
    regulatory_approval: boolean;
  };
  images: string[];
  quantum_security: boolean;
}

const STOPlatformPage = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<STOProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<STOProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        setProjects([
          {
            project_id: 'STO_001',
            name: 'QuantumTech Real Estate Fund',
            symbol: 'QTREF',
            category: 'real_estate',
            description: '专注于全球优质商业地产投资的证券型代币基金',
            issuer: {
              name: 'QuantumTech Capital',
              jurisdiction: 'Singapore',
              verified: true
            },
            token_details: {
              price_per_token: 100.00,
              currency: 'QAU',
              minimum_investment: 1000.00,
              dividend_frequency: 'quarterly'
            },
            funding: {
              target_amount: 1000000000.00,
              raised_amount: 650000000.00,
              progress: 65.0,
              investors_count: 1247
            },
            status: 'active',
            compliance: {
              kyc_required: true,
              accredited_only: true,
              regulatory_approval: true
            },
            images: ['/images/sto/real-estate-1.jpg'],
            quantum_security: true
          },
          {
            project_id: 'STO_002',
            name: 'Green Energy Infrastructure',
            symbol: 'GEI',
            category: 'energy',
            description: '为可再生能源项目提供融资的绿色债券代币',
            issuer: {
              name: 'EcoPower Grid',
              jurisdiction: 'Switzerland',
              verified: true
            },
            token_details: {
              price_per_token: 50.00,
              currency: 'QAU',
              minimum_investment: 500.00,
              dividend_frequency: 'monthly'
            },
            funding: {
              target_amount: 500000000.00,
              raised_amount: 125000000.00,
              progress: 25.0,
              investors_count: 856
            },
            status: 'active',
            compliance: {
              kyc_required: true,
              accredited_only: false,
              regulatory_approval: true
            },
            images: ['/images/sto/energy-1.jpg'],
            quantum_security: true
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadProjects();
  }, []);

  const categories = [
    { id: 'real_estate', name: t('sto.categories.real_estate'), icon: Building },
    { id: 'energy', name: t('sto.categories.energy'), icon: Zap },
    { id: 'healthcare', name: t('sto.categories.healthcare'), icon: Heart },
    { id: 'technology', name: t('sto.categories.technology'), icon: Cpu },
    { id: 'finance', name: t('sto.categories.finance'), icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            {t('sto.title')}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {t('sto.description')}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by name or symbol..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.project_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                <div className="h-48 bg-slate-700 relative">
                  {/* Placeholder for project image */}
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                    {project.category === 'real_estate' ? <Building size={48} /> : 
                     project.category === 'energy' ? <Zap size={48} /> : <Target size={48} />}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white flex items-center gap-1">
                    {project.quantum_security && <Shield size={14} className="text-emerald-400" />}
                    {t(`sto.project.status.${project.status}`, project.status.toUpperCase())}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-sm text-slate-400 font-mono">{project.symbol}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{t('sto.project.raised')}</span>
                        <span className="text-white font-medium">
                          {project.funding.raised_amount.toLocaleString()} / {project.funding.target_amount.toLocaleString()} {project.token_details.currency}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${project.funding.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                      <div>
                        <span className="text-xs text-slate-500 block">{t('sto.project.min_investment')}</span>
                        <span className="text-white font-medium">
                          {project.token_details.minimum_investment} {project.token_details.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">{t('sto.project.investors')}</span>
                        <span className="text-white font-medium">
                          {project.funding.investors_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default STOPlatformPage;


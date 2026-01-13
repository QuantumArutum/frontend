'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Globe, 
  PieChart,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

const STOApp = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');

  const featuredSTOs = [
    {
      id: 1,
      name: "QuantumTech Real Estate Fund",
      symbol: "QTREF",
      type: "Real Estate",
      raised: "$65M",
      target: "$100M",
      minInvestment: "$1,000",
      apy: "8.5%",
      status: "active",
      investors: 1247,
      progress: 65
    },
    {
      id: 2,
      name: "Green Energy Infrastructure",
      symbol: "GEI",
      type: "Energy",
      raised: "$12.5M",
      target: "$50M",
      minInvestment: "$500",
      apy: "12%",
      status: "active",
      investors: 856,
      progress: 25
    },
    {
      id: 3,
      name: "Global Logistics Chain",
      symbol: "GLC",
      type: "Supply Chain",
      raised: "$28M",
      target: "$30M",
      minInvestment: "$2,000",
      apy: "9.2%",
      status: "closing_soon",
      investors: 932,
      progress: 93
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Building2 className="text-emerald-400" />
            Security Token Offerings
          </h2>
          <p className="text-slate-400">
            Invest in compliant, asset-backed digital securities secured by quantum encryption.
          </p>
        </div>
        <Button 
          variant="primary"
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          onClick={() => router.push('/sto')}
        >
          Explore All Assets <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Value Locked", value: "$2.8B", icon: TrendingUp, color: "text-emerald-400" },
          { label: "Active Investors", value: "15.2K", icon: Users, color: "text-blue-400" },
          { label: "Successful Exits", value: "124", icon: CheckCircle, color: "text-purple-400" },
          { label: "Avg. Annual Yield", value: "11.4%", icon: PieChart, color: "text-yellow-400" }
        ].map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-700/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Offerings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredSTOs.map((sto) => (
          <motion.div
            key={sto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="bg-slate-800 border-slate-700 overflow-hidden hover:border-emerald-500/50 transition-all h-full">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {sto.type}
                    </Badge>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {sto.name}
                    </h3>
                    <p className="text-sm text-slate-400 font-mono">{sto.symbol}</p>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{sto.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      style={{ width: `${sto.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{sto.raised} raised</span>
                    <span>Target: {sto.target}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-500">Min Investment</p>
                    <p className="text-white font-medium">{sto.minInvestment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Est. APY</p>
                    <p className="text-emerald-400 font-medium">{sto.apy}</p>
                  </div>
                </div>

                <Button className="w-full bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-200 transition-colors">
                  View Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default STOApp;

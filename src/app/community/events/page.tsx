'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Trophy,
  Star,
  Search,
  RefreshCw
} from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { eventsService, Event } from '../../../services/communityService';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

export default function EventsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eventsService.getEvents({ status: activeTab });
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleRegister = async (eventId: string) => {
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) {
      window.location.href = '/auth/login?redirect=/community/events';
      return;
    }
    
    setRegistering(eventId);
    try {
      const user = JSON.parse(userInfo);
      const result = await eventsService.registerForEvent(eventId, user.id);
      if (result.success) {
        await loadEvents();
      } else {
        alert(result.error || t('community_page.events.register_failed'));
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setRegistering(null);
    }
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming' || e.status === 'ongoing');
  const pastEvents = events.filter(e => e.status === 'past');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'from-blue-500 to-cyan-500';
      case 'offline': return 'from-green-500 to-emerald-500';
      case 'hackathon': return 'from-purple-500 to-pink-500';
      case 'workshop': return 'from-orange-500 to-yellow-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'online': return t('community_page.events.types.online');
      case 'offline': return t('community_page.events.types.offline');
      case 'hackathon': return t('community_page.events.types.hackathon');
      case 'workshop': return t('community_page.events.types.workshop');
      default: return t('community_page.events.types.event');
    }
  };

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
  const filteredEvents = displayEvents
    .filter(event => selectedType === 'all' || event.type === selectedType)
    .filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            {t('community_page.events.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('community_page.events.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: t('community_page.events.stats.upcoming'), value: loading ? '-' : upcomingEvents.length, icon: Calendar, color: 'text-blue-400' },
            { label: t('community_page.events.stats.total_participants'), value: loading ? '-' : events.reduce((sum, e) => sum + e.participants, 0).toLocaleString(), icon: Users, color: 'text-green-400' },
            { label: t('community_page.events.stats.past_events'), value: loading ? '-' : pastEvents.length, icon: Star, color: 'text-yellow-400' },
            { label: t('community_page.events.stats.global_cities'), value: '20+', icon: Globe, color: 'text-purple-400' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('community_page.events.tabs.upcoming')}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('community_page.events.tabs.past')}
            </button>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('community_page.events.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">{t('community_page.events.filter.all')}</option>
              <option value="online">{t('community_page.events.types.online')}</option>
              <option value="offline">{t('community_page.events.types.offline')}</option>
              <option value="hackathon">{t('community_page.events.types.hackathon')}</option>
              <option value="workshop">{t('community_page.events.types.workshop')}</option>
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 bg-gradient-to-r ${getTypeColor(event.type)} text-white text-sm rounded-full`}>
                    {getTypeLabel(event.type)}
                  </span>
                  <span className="text-gray-400 text-sm">{event.date}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.participants.toLocaleString()}{t('community_page.events.people')}
                      {event.maxParticipants && ` / ${event.maxParticipants}${t('community_page.events.people')}`}
                      {event.status === 'past' ? t('community_page.events.participated') : t('community_page.events.registered')}
                    </span>
                  </div>
                  {event.prize && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Trophy className="w-4 h-4" />
                      <span>{t('community_page.events.prize_pool')}: {event.prize}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRegister(event.id)}
                  disabled={event.status === 'past' || registering === event.id}
                  className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    event.status === 'past'
                      ? 'bg-white/10 text-gray-400 cursor-default'
                      : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50'
                  }`}
                >
                  {registering === event.id && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {event.status === 'past' ? t('community_page.events.ended') : registering === event.id ? t('community_page.events.registering') : t('community_page.events.register_now')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}

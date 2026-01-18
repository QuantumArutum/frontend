/**
 * 演唱会列表 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

// 符合前端期望的数据格式
const mockConcerts = [
  {
    concert_id: 'CT001',
    concert_title: '周杰伦 2025 世界巡回演唱会',
    concert_subtitle: '嘉年华世界巡回演唱会',
    genre: '流行',
    artist: {
      artist_id: 'A001',
      artist_name: '周杰伦',
      stage_name: 'Jay Chou',
      profile_image_url: '/artists/jay.jpg',
    },
    venue: {
      venue_id: 'V001',
      venue_name: '上海体育场',
      city: '上海',
      country: '中国',
      total_capacity: 56000,
    },
    concert_date: '2025-03-15',
    show_start_time: '19:30',
    estimated_end_time: '22:30',
    price_range: { min_price: 380, max_price: 1880, currency: 'QAU' },
    tickets_available: 5000,
    poster_url: '/concerts/jay-tour.jpg',
    status: 'ON_SALE',
    age_restriction: '全年龄',
    max_tickets_per_person: 4,
  },
  {
    concert_id: 'CT002',
    concert_title: 'Taylor Swift Eras Tour',
    concert_subtitle: 'The Eras Tour',
    genre: '流行',
    artist: {
      artist_id: 'A002',
      artist_name: 'Taylor Swift',
      stage_name: 'Taylor Swift',
      profile_image_url: '/artists/taylor.jpg',
    },
    venue: {
      venue_id: 'V002',
      venue_name: '北京国家体育场',
      city: '北京',
      country: '中国',
      total_capacity: 80000,
    },
    concert_date: '2025-04-20',
    show_start_time: '19:00',
    estimated_end_time: '22:00',
    price_range: { min_price: 580, max_price: 2880, currency: 'QAU' },
    tickets_available: 2000,
    poster_url: '/concerts/taylor-eras.jpg',
    status: 'ON_SALE',
    age_restriction: '全年龄',
    max_tickets_per_person: 4,
  },
  {
    concert_id: 'CT003',
    concert_title: '五月天 诺亚方舟 演唱会',
    concert_subtitle: "Noah's Ark World Tour",
    genre: '摇滚',
    artist: {
      artist_id: 'A003',
      artist_name: '五月天',
      stage_name: 'Mayday',
      profile_image_url: '/artists/mayday.jpg',
    },
    venue: {
      venue_id: 'V003',
      venue_name: '深圳大运中心',
      city: '深圳',
      country: '中国',
      total_capacity: 45000,
    },
    concert_date: '2025-05-01',
    show_start_time: '19:30',
    estimated_end_time: '22:30',
    price_range: { min_price: 280, max_price: 1280, currency: 'QAU' },
    tickets_available: 8000,
    poster_url: '/concerts/mayday-noah.jpg',
    status: 'ON_SALE',
    age_restriction: '全年龄',
    max_tickets_per_person: 6,
  },
  {
    concert_id: 'CT004',
    concert_title: 'BTS World Tour',
    concert_subtitle: 'Permission to Dance',
    genre: 'K-Pop',
    artist: {
      artist_id: 'A004',
      artist_name: 'BTS',
      stage_name: '防弹少年团',
      profile_image_url: '/artists/bts.jpg',
    },
    venue: {
      venue_id: 'V004',
      venue_name: 'Madison Square Garden',
      city: '纽约',
      country: '美国',
      total_capacity: 20000,
    },
    concert_date: '2025-06-15',
    show_start_time: '20:00',
    estimated_end_time: '23:00',
    price_range: { min_price: 450, max_price: 2500, currency: 'QAU' },
    tickets_available: 500,
    poster_url: '/concerts/bts-world.jpg',
    status: 'ON_SALE',
    age_restriction: '全年龄',
    max_tickets_per_person: 4,
  },
];

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const genre = searchParams.get('genre');
    const artist = searchParams.get('artist');

    let filteredConcerts = [...mockConcerts];

    // 城市映射
    const cityMap: Record<string, string[]> = {
      纽约: ['纽约', 'New York', 'NYC'],
      洛杉矶: ['洛杉矶', 'Los Angeles', 'LA'],
      伦敦: ['伦敦', 'London'],
      东京: ['东京', 'Tokyo'],
      首尔: ['首尔', 'Seoul'],
      上海: ['上海', 'Shanghai'],
      北京: ['北京', 'Beijing'],
      深圳: ['深圳', 'Shenzhen'],
    };

    if (city && city !== '全部') {
      // 查找匹配的城市
      let matchedCities: string[] = [];
      for (const [key, aliases] of Object.entries(cityMap)) {
        if (aliases.some((alias) => alias.toLowerCase() === city.toLowerCase())) {
          matchedCities = aliases;
          break;
        }
      }

      if (matchedCities.length > 0) {
        filteredConcerts = filteredConcerts.filter((c) =>
          matchedCities.some((mc) => c.venue.city.toLowerCase().includes(mc.toLowerCase()))
        );
      } else {
        filteredConcerts = filteredConcerts.filter((c) =>
          c.venue.city.toLowerCase().includes(city.toLowerCase())
        );
      }
    }

    if (genre && genre !== '全部类型') {
      filteredConcerts = filteredConcerts.filter((c) => c.genre === genre);
    }

    if (artist) {
      filteredConcerts = filteredConcerts.filter((c) =>
        c.artist.artist_name.toLowerCase().includes(artist.toLowerCase())
      );
    }

    return successResponse({
      data: filteredConcerts,
      total: filteredConcerts.length,
      timestamp: new Date().toISOString(),
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);

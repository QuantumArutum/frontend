/**
 * 航班搜索 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

// 模拟航班数据 - 符合前端期望的格式
const generateMockFlights = (departureCity: string, arrivalCity: string, date: string) => {
  const airlines = [
    { name: '量子航空', code: 'QA', logo_url: '/airlines/qa.png' },
    { name: '星际航空', code: 'SA', logo_url: '/airlines/sa.png' },
    { name: '环球航空', code: 'GA', logo_url: '/airlines/ga.png' },
  ];

  const cityAirports: Record<string, { code: string; name: string; city: string }> = {
    'New York': { code: 'JFK', name: '肯尼迪国际机场', city: '纽约' },
    'Los Angeles': { code: 'LAX', name: '洛杉矶国际机场', city: '洛杉矶' },
    'London': { code: 'LHR', name: '希思罗机场', city: '伦敦' },
    'Dubai': { code: 'DXB', name: '迪拜国际机场', city: '迪拜' },
    'Singapore': { code: 'SIN', name: '樟宜机场', city: '新加坡' },
    'Tokyo': { code: 'NRT', name: '成田机场', city: '东京' },
    'Paris': { code: 'CDG', name: '戴高乐机场', city: '巴黎' },
    'Frankfurt': { code: 'FRA', name: '法兰克福机场', city: '法兰克福' },
  };

  const depAirport = cityAirports[departureCity] || { code: 'XXX', name: '未知机场', city: departureCity };
  const arrAirport = cityAirports[arrivalCity] || { code: 'YYY', name: '未知机场', city: arrivalCity };

  return [
    {
      flight_id: 'FL001',
      flight_number: 'QA888',
      airline: airlines[0],
      departure_airport: depAirport,
      arrival_airport: arrAirport,
      departure_date: date,
      departure_time: '08:00:00',
      arrival_time: '14:30:00',
      duration_minutes: 390,
      stops: 0,
      aircraft: { manufacturer: 'Boeing', model: '787-9', wifi_available: true, entertainment_system: true },
      meal_service: true,
      price_range: { min_price: 680, max_price: 2500, currency: 'QAU' },
    },
    {
      flight_id: 'FL002',
      flight_number: 'SA666',
      airline: airlines[1],
      departure_airport: depAirport,
      arrival_airport: arrAirport,
      departure_date: date,
      departure_time: '12:00:00',
      arrival_time: '18:20:00',
      duration_minutes: 380,
      stops: 0,
      aircraft: { manufacturer: 'Airbus', model: 'A350-900', wifi_available: true, entertainment_system: true },
      meal_service: true,
      price_range: { min_price: 750, max_price: 2800, currency: 'QAU' },
    },
    {
      flight_id: 'FL003',
      flight_number: 'GA123',
      airline: airlines[2],
      departure_airport: depAirport,
      arrival_airport: arrAirport,
      departure_date: date,
      departure_time: '18:30:00',
      arrival_time: '01:00:00',
      duration_minutes: 390,
      stops: 1,
      aircraft: { manufacturer: 'Boeing', model: '777-300ER', wifi_available: true, entertainment_system: true },
      meal_service: true,
      price_range: { min_price: 520, max_price: 2200, currency: 'QAU' },
    },
  ];
};

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const departureCity = searchParams.get('departure_city') || 'New York';
    const arrivalCity = searchParams.get('arrival_city') || 'Los Angeles';
    const departureDate = searchParams.get('departure_date') || new Date().toISOString().split('T')[0];
    const returnDate = searchParams.get('return_date');
    const tripType = searchParams.get('trip_type') || 'one_way';

    const outboundFlights = generateMockFlights(departureCity, arrivalCity, departureDate);
    const returnFlights = tripType === 'round_trip' && returnDate 
      ? generateMockFlights(arrivalCity, departureCity, returnDate)
      : [];

    return successResponse({
      data: {
        search_params: {
          departure_city: departureCity,
          arrival_city: arrivalCity,
          departure_date: departureDate,
          return_date: returnDate,
          trip_type: tripType,
        },
        outbound_flights: outboundFlights,
        return_flights: returnFlights,
      },
      timestamp: new Date().toISOString()
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);

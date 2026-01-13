'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Calendar, MapPin, Plane, Users, CreditCard, Star, Wifi, Tv, Utensils } from 'lucide-react';
import DemoModuleWrapper, { DemoBadge, DemoModuleDisabledCard } from '../../components/DemoModuleWrapper';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Flight = Record<string, any>;

const FlightBookingPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    departure_city: 'New York',
    arrival_city: 'Los Angeles',
    departure_date: new Date().toISOString().split('T')[0],
    return_date: '',
    passengers: 1,
    class_type: 'ECONOMY',
    trip_type: 'one_way'
  });
  
  const [searchResults, setSearchResults] = useState<{
    search_params: {
      departure_city: string;
      arrival_city: string;
    };
    outbound_flights: Flight[];
    return_flights?: Flight[];
  } | null>(null);
  const [selectedOutbound, setSelectedOutbound] = useState<Flight | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<Flight | null>(null);
  const [selectedFares, setSelectedFares] = useState<Record<string, Flight>>({});
  const [currentStep, setCurrentStep] = useState('search');
  const [loading, setLoading] = useState(false);

  // Search flights
  const searchFlights = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...searchParams,
        passengers: String(searchParams.passengers)
      });
      const response = await fetch(`/api/flights/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
        setCurrentStep('results');
      }
    } catch (error) {
      console.error('Failed to search flights:', error);
    }
    setLoading(false);
  };

  // Get flight details and fares
  const getFlightDetails = async (flightId: string) => {
    try {
      const response = await fetch(`/api/flights/${flightId}/fares`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error('Failed to get flight details:', error);
    }
    return null;
  };

  // Select flight
  const selectFlight = async (flight: Flight, type: string) => {
    const details = await getFlightDetails(flight.flight_id);
    if (details) {
      if (type === 'outbound') {
        setSelectedOutbound(details);
      } else {
        setSelectedReturn(details);
      }
      setCurrentStep('details');
    }
  };

  // Select fare
  const selectFare = (flightId: string, fareClass: Flight) => {
    setSelectedFares({
      ...selectedFares,
      [flightId]: fareClass
    });
  };

  // Format time
  const formatTime = (timeString: string): string => {
    return timeString.slice(0, 5);
  };

  // Format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Render search form
  const renderSearchForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('flights_page.trip_type')}</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="one_way"
                checked={searchParams.trip_type === 'one_way'}
                onChange={(e) => setSearchParams({...searchParams, trip_type: e.target.value, return_date: ''})}
                className="mr-2"
              />
              {t('flights_page.one_way')}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="round_trip"
                checked={searchParams.trip_type === 'round_trip'}
                onChange={(e) => setSearchParams({...searchParams, trip_type: e.target.value})}
                className="mr-2"
              />
              {t('flights_page.round_trip')}
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('flights_page.departure_city')}</label>
          <div className="relative">
            <Plane className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={searchParams.departure_city}
              onChange={(e) => setSearchParams({...searchParams, departure_city: e.target.value})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New York">New York (JFK)</option>
              <option value="Los Angeles">Los Angeles (LAX)</option>
              <option value="London">London (LHR)</option>
              <option value="Dubai">Dubai (DXB)</option>
              <option value="Singapore">Singapore (SIN)</option>
              <option value="Tokyo">Tokyo (NRT)</option>
              <option value="Paris">Paris (CDG)</option>
              <option value="Frankfurt">Frankfurt (FRA)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('flights_page.arrival_city')}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={searchParams.arrival_city}
              onChange={(e) => setSearchParams({...searchParams, arrival_city: e.target.value})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Los Angeles">Los Angeles (LAX)</option>
              <option value="New York">New York (JFK)</option>
              <option value="London">London (LHR)</option>
              <option value="Dubai">Dubai (DXB)</option>
              <option value="Singapore">Singapore (SIN)</option>
              <option value="Tokyo">Tokyo (NRT)</option>
              <option value="Paris">Paris (CDG)</option>
              <option value="Frankfurt">Frankfurt (FRA)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('flights_page.departure_date')}</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={searchParams.departure_date}
              onChange={(e) => setSearchParams({...searchParams, departure_date: e.target.value})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {searchParams.trip_type === 'round_trip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('flights_page.return_date')}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={searchParams.return_date}
                onChange={(e) => setSearchParams({...searchParams, return_date: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('flights_page.passengers')}</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({...searchParams, passengers: parseInt(e.target.value)})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1,2,3,4,5,6,7,8,9].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('flights_page.class_type')}</label>
          <select
            value={searchParams.class_type}
            onChange={(e) => setSearchParams({...searchParams, class_type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ECONOMY">{t('flights_page.economy')}</option>
            <option value="PREMIUM_ECONOMY">{t('flights_page.premium_economy')}</option>
            <option value="BUSINESS">{t('flights_page.business')}</option>
            <option value="FIRST">{t('flights_page.first_class')}</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {t('flights_page.search_flights')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render flight card
  const renderFlightCard = (flight: Flight, type: string = 'outbound') => (
    <div key={flight.flight_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image
            src={flight.airline.logo_url || '/api/placeholder/40/40'}
            alt={flight.airline.name}
            width={40}
            height={40}
            className="w-10 h-10 mr-3"
          />
          <div>
            <h3 className="font-semibold">{flight.airline.name}</h3>
            <p className="text-sm text-gray-600">{flight.flight_number}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{flight.aircraft.manufacturer} {flight.aircraft.model}</p>
          <div className="flex items-center text-sm text-gray-500">
            {flight.aircraft.wifi_available && <Wifi className="h-4 w-4 mr-1" />}
            {flight.aircraft.entertainment_system && <Tv className="h-4 w-4 mr-1" />}
            {flight.meal_service && <Utensils className="h-4 w-4 mr-1" />}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{formatTime(flight.departure_time)}</p>
          <p className="text-sm text-gray-600">{flight.departure_airport.code}</p>
          <p className="text-xs text-gray-500">{flight.departure_airport.city}</p>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">
                {formatDuration(flight.duration_minutes)}
              </span>
            </div>
          </div>
          <div className="text-center mt-1">
            {flight.stops === 0 ? (
              <span className="text-xs text-green-600">{t('flights_page.direct')}</span>
            ) : (
              <span className="text-xs text-orange-600">{flight.stops} {t('flights_page.stop')}</span>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold">{formatTime(flight.arrival_time)}</p>
          <p className="text-sm text-gray-600">{flight.arrival_airport.code}</p>
          <p className="text-xs text-gray-500">{flight.arrival_airport.city}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-blue-600">
            {flight.price_range?.min_price ?? 0} QAU
          </span>
          <span className="text-sm text-gray-500 ml-1">{t('flights_page.from')}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {(flight as Flight & { delay_minutes?: number }).delay_minutes && (flight as Flight & { delay_minutes?: number }).delay_minutes! > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              {t('flights_page.delayed')} {(flight as Flight & { delay_minutes?: number }).delay_minutes} {t('flights_page.minutes')}
            </span>
          )}
          <button
            onClick={() => selectFlight(flight, type)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('flights_page.select_flight')}
          </button>
        </div>
      </div>
    </div>
  );

  // Render search results
  const renderSearchResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('flights_page.search_results')}</h2>
        <button
          onClick={() => setCurrentStep('search')}
          className="text-blue-600 hover:text-blue-800"
        >
          {t('flights_page.modify_search')}
        </button>
      </div>

      {/* Outbound flights */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t('flights_page.outbound_flights')}: {searchResults?.search_params.departure_city} → {searchResults?.search_params.arrival_city}
        </h3>
        <div className="space-y-4">
          {searchResults?.outbound_flights.map(flight => renderFlightCard(flight, 'outbound'))}
        </div>
      </div>

      {/* Return flights */}
      {searchResults?.return_flights && searchResults.return_flights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t('flights_page.return_flights')}: {searchResults?.search_params.arrival_city} → {searchResults?.search_params.departure_city}
          </h3>
          <div className="space-y-4">
            {searchResults?.return_flights.map(flight => renderFlightCard(flight, 'return'))}
          </div>
        </div>
      )}
    </div>
  );

  // Render flight details and fare selection
  const renderFlightDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('flights_page.select_fare')}</h2>
        <button
          onClick={() => setCurrentStep('results')}
          className="text-blue-600 hover:text-blue-800"
        >
          {t('flights_page.back_to_results')}
        </button>
      </div>

      {selectedOutbound && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">{t('flights_page.outbound_fare')}</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedOutbound.flight_number}</h4>
                <p className="text-sm text-gray-600">
                  {selectedOutbound.departure_airport.city} → {selectedOutbound.arrival_airport.city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">{selectedOutbound.departure_date}</p>
                <p className="text-sm">{formatTime(selectedOutbound.departure_time)} - {formatTime(selectedOutbound.arrival_time)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedOutbound.fare_classes.map((fareClass: Flight) => (
              <div
                key={fareClass.fare_class_id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedFares[selectedOutbound.flight_id]?.fare_class_id === fareClass.fare_class_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => selectFare(selectedOutbound.flight_id, fareClass)}
              >
                <div className="text-center mb-3">
                  <h4 className="font-semibold">{fareClass.class_type}</h4>
                  <p className="text-sm text-gray-600">{fareClass.cabin_class}</p>
                </div>

                <div className="text-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {fareClass.pricing.total_price} QAU
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('flights_page.seat_pitch')}:</span>
                    <span>{fareClass.seat_details.pitch_inches}&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('flights_page.baggage')}:</span>
                    <span>{fareClass.inclusions.baggage_kg}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('flights_page.meal')}:</span>
                    <span>{fareClass.inclusions.meal_included ? t('flights_page.included') : t('flights_page.not_included')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('flights_page.refundable')}:</span>
                    <span>{fareClass.policies.refundable ? t('flights_page.yes') : t('flights_page.no')}</span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    fareClass.availability.availability_percentage > 50 ? 'bg-green-100 text-green-800' :
                    fareClass.availability.availability_percentage > 20 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t('flights_page.seats_left')} {fareClass.availability.available_seats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReturn && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">{t('flights_page.return_fare')}</h3>
        </div>
      )}

      {Object.keys(selectedFares).length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setCurrentStep('booking')}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('flights_page.continue_booking')}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <DemoModuleWrapper 
      moduleSlug="flights"
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <DemoModuleDisabledCard 
            title="Flight Booking" 
            description="Flight booking feature is currently unavailable. Please check back later."
          />
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{t('flights_page.title')}</h1>
              <DemoBadge variant="demo" />
            </div>
            <p className="text-gray-600">{t('flights_page.subtitle')}</p>
          </div>

        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: 'search', label: t('flights_page.steps.search'), icon: Search },
              { key: 'results', label: t('flights_page.steps.select'), icon: Plane },
              { key: 'details', label: t('flights_page.steps.fare'), icon: Star },
              { key: 'booking', label: t('flights_page.steps.info'), icon: Users },
              { key: 'payment', label: t('flights_page.steps.payment'), icon: CreditCard }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted = ['search', 'results', 'details', 'booking', 'payment'].indexOf(currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 4 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        {currentStep === 'search' && renderSearchForm()}
        {currentStep === 'results' && searchResults && renderSearchResults()}
        {currentStep === 'details' && renderFlightDetails()}
      </div>
    </div>
    </DemoModuleWrapper>
  );
};

export default FlightBookingPage;

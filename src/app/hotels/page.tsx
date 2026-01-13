'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users, Star, Wifi, Car, Utensils, Dumbbell, Waves, Shield, Filter, Heart, Share2, Phone, Mail, Globe, Clock, CheckCircle } from 'lucide-react';
import DemoModuleWrapper, { DemoBadge, DemoModuleDisabledCard } from '../../components/DemoModuleWrapper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Hotel = Record<string, any>;

const HotelBookingPage = () => {
  const [currentView, setCurrentView] = useState('search');
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingData, setBookingData] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    starRating: '',
    amenities: [] as string[]
  });
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Search hotels
  const searchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        destination: searchParams.destination,
        check_in: searchParams.checkIn,
        check_out: searchParams.checkOut,
        guests: String(searchParams.guests),
        rooms: String(searchParams.rooms),
        price_min: String(filters.priceMin),
        price_max: String(filters.priceMax),
        star_rating: filters.starRating,
      });

      const response = await fetch(`/api/hotels/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setHotels(data.data.hotels);
        setCurrentView('results');
      }
    } catch (error) {
      console.error('Search hotels failed:', error);
    }
    setLoading(false);
  };

  // Get hotel details
  const getHotelDetails = async (hotelId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/hotels/${hotelId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedHotel(data.data);
        setCurrentView('details');
      }
    } catch (error) {
      console.error('Get hotel details failed:', error);
    }
    setLoading(false);
  };

  // Create booking
  const createBooking = async (bookingDetails: Hotel) => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails)
      });
      
      const data = await response.json();
      if (data.success) {
        setBookingData(data.data);
        setCurrentView('confirmation');
      }
    } catch (error) {
      console.error('Create booking failed:', error);
    }
    setLoading(false);
  };

  // Render search page
  const renderSearchPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Global Hotel Booking</h1>
          <p className="text-xl text-gray-600">Discover boutique hotels worldwide with quantum-secure booking</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                  placeholder="City, hotel name or landmark"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guests & Rooms</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={searchParams.rooms}
                  onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
                  className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1,2,3,4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={searchHotels}
              disabled={loading || !searchParams.destination || !searchParams.checkIn || !searchParams.checkOut}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search Hotels'}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Beijing', country: 'China', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400', hotels: 1250 },
              { name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', hotels: 2100 },
              { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400', hotels: 1800 }
            ].map((destination, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSearchParams({...searchParams, destination: destination.name})}
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.country}</p>
                  <p className="text-sm opacity-75">{destination.hotels} hotels</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render results page
  const renderResultsPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hotels in {searchParams.destination}
            </h1>
            <p className="text-gray-600">
              {searchParams.checkIn} - {searchParams.checkOut} - {searchParams.guests} guests - {searchParams.rooms} rooms
            </p>
          </div>
          <button
            onClick={() => setCurrentView('search')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Modify Search
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Filter</span>
            </div>
            
            <select
              value={filters.starRating}
              onChange={(e) => setFilters({...filters, starRating: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Stars</option>
              <option value="5">5 Star</option>
              <option value="4">4 Star</option>
              <option value="3">3 Star</option>
            </select>

            <div className="flex items-center space-x-2">
              <span>Price:</span>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters({...filters, priceMin: parseInt(e.target.value)})}
                placeholder="Min"
                className="w-20 px-2 py-1 border border-gray-300 rounded"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters({...filters, priceMax: parseInt(e.target.value)})}
                placeholder="Max"
                className="w-20 px-2 py-1 border border-gray-300 rounded"
              />
              <span>QAU</span>
            </div>

            <button
              onClick={searchHotels}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Apply Filter
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div key={hotel.hotel_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                <div className="w-1/3">
                  <Image
                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                    alt={hotel.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900 mr-2">{hotel.name}</h3>
                        <div className="flex items-center">
                          {[...Array(hotel.star_rating || 0)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        {hotel.quantum_security && (
                          <span title="Quantum Secure">
                            <Shield className="h-4 w-4 text-green-500 ml-2" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{hotel.location?.city}, {hotel.location?.country}</span>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center mr-4">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{hotel.rating?.overall}</span>
                          <span className="text-gray-500 ml-1">({hotel.rating?.review_count} reviews)</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities?.slice(0, 4).map((amenity: string, index: number) => (
                          <span key={index} className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                            {amenity === 'Restaurant' && <Utensils className="h-3 w-3 mr-1" />}
                            {amenity === 'Gym' && <Dumbbell className="h-3 w-3 mr-1" />}
                            {amenity === 'Pool' && <Waves className="h-3 w-3 mr-1" />}
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities?.length > 4 && (
                          <span className="text-sm text-gray-500">+{hotel.amenities.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="mb-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {hotel.room_types ? Math.min(...hotel.room_types.map((room: Hotel) => room.price_per_night)) : 0} QAU
                        </span>
                        <span className="text-gray-500 block text-sm">per night</span>
                      </div>
                      
                      <button
                        onClick={() => getHotelDetails(hotel.hotel_id)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                      
                      <div className="flex items-center justify-end mt-2 space-x-2">
                        <button className="p-1 text-gray-400 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-500">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hotels.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
              Load More Hotels
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render hotel details page
  const renderDetailsPage = () => {
    if (!selectedHotel) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setCurrentView('results')}
            className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Search Results
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div>
                <Image
                  src={selectedHotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'}
                  alt={selectedHotel.name}
                  width={600}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {selectedHotel.images?.slice(1, 4).map((image: string, index: number) => (
                    <Image
                      key={index}
                      src={image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'}
                      alt={`${selectedHotel.name} ${index + 2}`}
                      width={200}
                      height={80}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mr-4">{selectedHotel.name}</h1>
                  <div className="flex items-center">
                    {[...Array(selectedHotel.star_rating || 0)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  {selectedHotel.quantum_security && (
                    <span title="Quantum Secure">
                      <Shield className="h-5 w-5 text-green-500 ml-2" />
                    </span>
                  )}
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{selectedHotel.location?.address}</span>
                </div>

                <p className="text-gray-700 mb-6">{selectedHotel.description}</p>

                <div className="flex items-center mb-6">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold mr-3">
                    {selectedHotel.rating?.overall}
                  </div>
                  <div>
                    <div className="font-medium">Excellent</div>
                    <div className="text-sm text-gray-500">{selectedHotel.rating?.review_count} reviews</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{selectedHotel.contact_info?.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{selectedHotel.contact_info?.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{selectedHotel.contact_info?.website}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Room Type</h2>
            <div className="space-y-4">
              {selectedHotel.room_types?.map((room: Hotel) => (
                <div key={room.room_type_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      <p className="text-gray-600 mb-2">{room.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span>Max {room.max_guests} guests</span>
                        <span>{room.bed_type}</span>
                        <span>{room.room_size}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {room.amenities?.map((amenity: string, index: number) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {room.price_per_night} QAU
                      </div>
                      <div className="text-sm text-gray-500 mb-2">per night</div>
                      <div className="text-sm text-gray-500 mb-4">
                        {room.available_rooms} rooms left
                      </div>
                      
                      <button
                        onClick={() => {
                          setBookingData({
                            hotel: selectedHotel,
                            room: room,
                            searchParams: searchParams
                          });
                          setCurrentView('booking');
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedHotel.amenities?.map((amenity: Hotel, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    {(amenity.name || amenity) === 'WiFi' && <Wifi className="h-4 w-4 text-blue-600" />}
                    {(amenity.name || amenity) === 'Parking' && <Car className="h-4 w-4 text-blue-600" />}
                    {(amenity.name || amenity) === 'Restaurant' && <Utensils className="h-4 w-4 text-blue-600" />}
                    {(amenity.name || amenity) === 'Gym' && <Dumbbell className="h-4 w-4 text-blue-600" />}
                    {(amenity.name || amenity) === 'Pool' && <Waves className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div>
                    <div className="font-medium">{amenity.name || amenity}</div>
                    {amenity.free !== undefined && (
                      <div className="text-sm text-gray-500">
                        {amenity.free ? 'Free' : 'Paid'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Check-in/Check-out</h3>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Check-in: {selectedHotel.policies?.check_in_time}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Check-out: {selectedHotel.policies?.check_out_time}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                <p className="text-gray-600">{selectedHotel.policies?.cancellation_policy}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pet Policy</h3>
                <p className="text-gray-600">{selectedHotel.policies?.pet_policy}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Smoking Policy</h3>
                <p className="text-gray-600">{selectedHotel.policies?.smoking_policy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render booking page
  const renderBookingPage = () => {
    if (!bookingData) return null;

    const nights = Math.ceil((new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = bookingData.room.price_per_night * nights * searchParams.rooms;

    const handleBooking = () => {
      const bookingDetails = {
        hotel_id: bookingData.hotel.hotel_id,
        room_type_id: bookingData.room.room_type_id,
        guest_name: guestInfo.name,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone,
        special_requests: guestInfo.specialRequests,
        check_in: searchParams.checkIn,
        check_out: searchParams.checkOut,
        nights: nights,
        guests: searchParams.guests,
        rooms: searchParams.rooms,
        room_rate: bookingData.room.price_per_night,
        total_amount: totalAmount,
        signature: 'quantum_signature_placeholder',
        public_key: 'quantum_public_key_placeholder'
      };

      createBooking(bookingDetails);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setCurrentView('details')}
            className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Hotel Details
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                    <textarea
                      value={guestInfo.specialRequests}
                      onChange={(e) => setGuestInfo({...guestInfo, specialRequests: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Any special requests?"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hotel</span>
                    <span className="font-medium">{bookingData.hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room</span>
                    <span className="font-medium">{bookingData.room.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">{searchParams.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-medium">{searchParams.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nights</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms</span>
                    <span className="font-medium">{searchParams.rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate per night</span>
                    <span className="font-medium">{bookingData.room.price_per_night} QAU</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{totalAmount} QAU</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading || !guestInfo.name || !guestInfo.email || !guestInfo.phone}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render confirmation page
  const renderConfirmationPage = () => {
    if (!bookingData) return null;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-medium">{bookingData.booking_id || 'QAU-' + Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hotel</span>
                <span className="font-medium">{bookingData.hotel?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room</span>
                <span className="font-medium">{bookingData.room?.name}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('search');
              setBookingData(null);
              setSelectedHotel(null);
              setHotels([]);
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <DemoModuleWrapper 
      moduleSlug="hotels"
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <DemoModuleDisabledCard 
            title="Hotel Booking" 
            description="Hotel booking feature is currently unavailable. Please check back later."
          />
        </div>
      }
    >
      <div>
        {currentView === 'search' && renderSearchPage()}
        {currentView === 'results' && renderResultsPage()}
        {currentView === 'details' && renderDetailsPage()}
        {currentView === 'booking' && renderBookingPage()}
        {currentView === 'confirmation' && renderConfirmationPage()}
      </div>
    </DemoModuleWrapper>
  );
};

export default HotelBookingPage;

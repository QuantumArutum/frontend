'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Calendar, MapPin, Clock, Star, Users, Film, Ticket, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Movie {
  movie_id: string;
  title?: string;
  poster_url?: string;
  rating?: number;
  duration_minutes?: number;
  genre?: string;
  is_imax?: boolean;
  synopsis?: string;
  director?: string;
  imdb_rating?: number;
  rotten_tomatoes_score?: number;
}

interface Showtime {
  showtime_id: string;
  ticket_price: number;
  show_time?: string;
  show_date?: string;
  available_seats?: number;
  cinema?: { cinema_name?: string; address?: string; facilities?: string[] };
  screen?: { screen_type?: string };
  language?: string;
  special_features?: string[];
}

interface Seat {
  seat_id: string;
  is_available: boolean;
  price_modifier: number;
  row_letter?: string;
  seat_number?: number;
  seat_type?: string;
}

const MovieTicketPage = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [currentStep, setCurrentStep] = useState('movies');
  const [searchFilters, setSearchFilters] = useState({
    city: 'New York',
    date: new Date().toISOString().split('T')[0],
    genre: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.city) params.append('city', searchFilters.city);
      if (searchFilters.date) params.append('date', searchFilters.date);
      if (searchFilters.genre) params.append('genre', searchFilters.genre);
      const response = await fetch(`/api/movies?${params}`);
      const data = await response.json();
      if (data.success) setMovies(data.data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
    setLoading(false);
  }, [searchFilters]);

  const fetchShowtimes = async (movieId: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.city) params.append('city', searchFilters.city);
      params.append('date', searchFilters.date);
      const response = await fetch(`/api/movies/${movieId}/showtimes?${params}`);
      const data = await response.json();
      if (data.success) setShowtimes(data.data);
    } catch (error) {
      console.error('Failed to fetch showtimes:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const selectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentStep('showtimes');
    fetchShowtimes(movie.movie_id);
  };

  const selectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setCurrentStep('seats');
  };

  const calculateTotal = () => {
    if (!selectedShowtime || selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((total, seat) => total + (selectedShowtime.ticket_price * seat.price_modifier), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('movies_page.title')}</h1>
          <p className="text-gray-600">{t('movies_page.subtitle')}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: 'movies', label: t('movies_page.steps.select_movie'), icon: Film },
              { key: 'showtimes', label: t('movies_page.steps.select_showtime'), icon: Clock },
              { key: 'seats', label: t('movies_page.steps.select_seats'), icon: Users },
              { key: 'payment', label: t('movies_page.steps.payment'), icon: CreditCard }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted = ['movies', 'showtimes', 'seats', 'payment'].indexOf(currentStep) > index;
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>{step.label}</span>
                  {index < 3 && <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">{t('movies_page.loading')}</p>
          </div>
        )}

        {!loading && currentStep === 'movies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('movies_page.city')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select value={searchFilters.city} onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md">
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="London">London</option>
                      <option value="Tokyo">Tokyo</option>
                      <option value="Shanghai">Shanghai</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('movies_page.date')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="date" value={searchFilters.date} onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('movies_page.genre')}</label>
                  <select value={searchFilters.genre} onChange={(e) => setSearchFilters({...searchFilters, genre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">{t('movies_page.all_genres')}</option>
                    <option value="Action">{t('movies_page.action')}</option>
                    <option value="Comedy">{t('movies_page.comedy')}</option>
                    <option value="Drama">{t('movies_page.drama')}</option>
                    <option value="Sci-Fi">{t('movies_page.scifi')}</option>
                    <option value="Horror">{t('movies_page.horror')}</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={fetchMovies} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
                    <Search className="h-4 w-4 mr-2" /> {t('movies_page.search')}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <div key={movie.movie_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image src={movie.poster_url || '/api/placeholder/300/450'} alt={movie.title || 'Movie'} width={300} height={256} className="w-full h-64 object-cover" />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">{movie.rating}</div>
                    {movie.is_imax && <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">IMAX</div>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{t('movies_page.director')}: {movie.director}</p>
                    <p className="text-gray-600 text-sm mb-2">{t('movies_page.genre')}: {movie.genre}</p>
                    <p className="text-gray-600 text-sm mb-2">{t('movies_page.duration')}: {movie.duration_minutes} {t('movies_page.minutes')}</p>
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{movie.imdb_rating}</span>
                      <span className="text-gray-500 text-sm ml-2">{t('movies_page.rotten_tomatoes')} {movie.rotten_tomatoes_score}%</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{movie.synopsis}</p>
                    <button onClick={() => selectMovie(movie)} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
                      <Ticket className="h-4 w-4 mr-2" /> {t('movies_page.select_showtime_btn')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && currentStep === 'showtimes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t('movies_page.select_showtime_for', { title: selectedMovie?.title })}</h2>
              <button onClick={() => setCurrentStep('movies')} className="text-blue-600 hover:text-blue-800">{t('movies_page.back_to_movies')}</button>
            </div>
            <div className="space-y-4">
              {showtimes.map((showtime) => (
                <div key={showtime.showtime_id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{showtime.cinema?.cinema_name}</h4>
                      <p className="text-gray-600">{showtime.cinema?.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">{showtime.ticket_price} QAU</p>
                      <p className="text-sm text-gray-600">{t('movies_page.per_ticket')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center"><Clock className="h-4 w-4 text-gray-500 mr-2" /><span className="font-medium">{showtime.show_time}</span></div>
                      <p className="text-sm text-gray-600">{t('movies_page.start_time')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center"><Users className="h-4 w-4 text-gray-500 mr-2" /><span className="font-medium">{showtime.available_seats}</span></div>
                      <p className="text-sm text-gray-600">{t('movies_page.remaining_tickets')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="font-medium">{showtime.screen?.screen_type || t('movies_page.standard')}</span>
                      <p className="text-sm text-gray-600">{t('movies_page.screen_type')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="font-medium">{showtime.language}</span>
                      <p className="text-sm text-gray-600">{t('movies_page.language')}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => selectShowtime(showtime)} disabled={showtime.available_seats === 0}
                      className={`px-6 py-2 rounded-md ${showtime.available_seats === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                      {showtime.available_seats === 0 ? t('movies_page.sold_out') : t('movies_page.select_seats_btn')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && currentStep === 'seats' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t('movies_page.select_seats_title')}</h2>
              <button onClick={() => setCurrentStep('showtimes')} className="text-blue-600 hover:text-blue-800">{t('movies_page.back_to_showtimes')}</button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">{selectedMovie?.title}</h3>
                <p className="text-gray-600">{selectedShowtime?.cinema?.cinema_name} - {selectedShowtime?.show_date} {selectedShowtime?.show_time}</p>
              </div>
              <div className="text-center mb-8">
                <div className="bg-gray-800 text-white py-2 px-8 rounded-lg inline-block">{t('movies_page.screen')}</div>
              </div>
              <div className="text-center py-8 text-gray-500">{t('movies_page.seat_selection_dev')}</div>
              {selectedSeats.length > 0 && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t('movies_page.total')}: {calculateTotal().toFixed(2)} QAU</span>
                    <button onClick={() => setCurrentStep('payment')} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">{t('movies_page.confirm_seats')}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && currentStep === 'payment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t('movies_page.confirm_order')}</h2>
              <button onClick={() => setCurrentStep('seats')} className="text-blue-600 hover:text-blue-800">{t('movies_page.back_to_seats')}</button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">{t('movies_page.order_details')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span>{t('movies_page.movie')}:</span><span className="font-medium">{selectedMovie?.title}</span></div>
                <div className="flex justify-between"><span>{t('movies_page.cinema')}:</span><span className="font-medium">{selectedShowtime?.cinema?.cinema_name}</span></div>
                <div className="flex justify-between"><span>{t('movies_page.time')}:</span><span className="font-medium">{selectedShowtime?.show_date} {selectedShowtime?.show_time}</span></div>
                <hr />
                <div className="flex justify-between text-lg font-bold"><span>{t('movies_page.total')}:</span><span className="text-blue-600">{calculateTotal().toFixed(2)} QAU</span></div>
              </div>
              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium">{t('movies_page.confirm_pay')} {calculateTotal().toFixed(2)} QAU</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieTicketPage;

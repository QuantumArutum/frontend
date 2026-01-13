'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import QuantumSecurityPanel from '@/app/components/QuantumSecurityPanel';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Ticket,
  CreditCard,
  Search,
  Filter,
  ArrowRight,
  Luggage,
  Wifi,
  Coffee,
  Monitor,
  Utensils,
  ArrowUpDown,
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  CalendarDays,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Edit,
  Download,
  QrCode,
  Phone,
  Mail,
  CreditCard as CardIcon,
  Wallet,
  Globe,
  Navigation,
  Compass,
  Route,
  Timer,
  Fuel,
  Wind,
  CloudRain,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Thermometer,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Camera,
  Video,
  Music,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Speaker,
  Radio,
  Tv,
  Gamepad2,
  Joystick,
  Zap,
  Battery,
  BatteryLow,
  Plug,
  Power,
  PowerOff,
  Settings,
  Sliders,
  ToggleLeft,
  ToggleRight,
  SwitchCamera,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize,
  Move,
  Copy,
  Cut,
  Paste,
  Scissors,
  Paperclip,
  Link,
  Unlink,
  ExternalLink,
  Share,
  Share2,
  Send,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Inbox,
  Outbox,
  Trash,
  Trash2,
  Delete,
  Save,
  Upload,
  FileText,
  File,
  Folder,
  FolderOpen,
  Image,
  FileImage,
  FileVideo,
  FileAudio,
  FilePdf,
  FileSpreadsheet,
  FileCode,
  Database,
  Server,
  Cloud,
  CloudUpload,
  CloudDownload,
  CloudOff,
  Wifi as WifiIcon,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  BluetoothOff,
  Usb,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor as MonitorIcon,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  MousePointer,
  MousePointer2,
  Touchpad,
  Gamepad,
  Joystick as JoystickIcon,
  Headset,
  Microphone,
  Webcam,
  Speaker as SpeakerIcon,
  Volume,
  VolumeOff,
  Volume1,
  VolumeDown,
  VolumeUp,
  Mute,
  Unmute,
  Play,
  Pause,
  Stop,
  Record,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  List,
  Grid,
  Grid3x3,
  LayoutGrid,
  LayoutList,
  Columns,
  Rows,
  Sidebar,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  PanelTopClose,
  PanelTopOpen,
  PanelBottomClose,
  PanelBottomOpen,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Square,
  Circle,
  Triangle,
  Diamond,
  Pentagon,
  Hexagon,
  Octagon,
  Star as StarIcon,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Hash,
  AtSign,
  Percent,
  Dollar,
  Euro,
  Pound,
  Yen,
  Ruble,
  Rupee,
  Won,
  Franc,
  Lira,
  Peso,
  Real,
  Rand,
  Shekel,
  Dinar,
  Dirham,
  Riyal,
  Taka,
  Kyat,
  Kip,
  Dong,
  Tugrik,
  Som,
  Manat,
  Lari,
  Dram,
  Lek,
  Denar,
  Kuna,
  Forint,
  Zloty,
  Koruna,
  Krona,
  Krone,
  Leu,
  Lev,
  Lat,
  Litas,
  Tolar,
  Marka,
  Peso as PesoIcon,
  Quetzal,
  Colon,
  Balboa,
  Cordoba,
  Lempira,
  Guarani,
  Boliviano,
  Sol,
  Sucre,
  Austral,
  Cruzeiro,
  Escudo,
  Peseta,
  Lira as LiraIcon,
  Drachma,
  Markka,
  Guilder,
  Schilling,
  Franc as FrancIcon,
  Pfennig,
  Groschen,
  Heller,
  Kreuzer,
  Thaler,
  Ducat,
  Florin,
  Crown,
  Sovereign,
  Guinea,
  Shilling,
  Pence,
  Farthing,
  Halfpenny,
  Penny,
  Twopence,
  Threepence,
  Fourpence,
  Sixpence,
  Groat,
  Testoon,
  Angel,
  Noble,
  Ryal,
  Pistole,
  Doubloon,
  Escudo as EscudoIcon,
  Milreis,
  Cruzado,
  Real as RealIcon,
  Centavo,
  Peso as PesoIcon2,
  Quetzal as QuetzalIcon,
  Colon as ColonIcon,
  Balboa as BalboaIcon,
  Cordoba as CordobaIcon,
  Lempira as LempiraIcon,
  Guarani as GuaraniIcon,
  Boliviano as BolivianoIcon,
  Sol as SolIcon,
  Sucre as SucreIcon,
  Austral as AustralIcon,
  Cruzeiro as CruzeiroIcon
} from 'lucide-react';

const FlightBookingApp = () => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: 'PEK',
    to: 'LAX',
    departDate: '2024-07-20',
    returnDate: '2024-07-27',
    passengers: 1,
    class: 'economy'
  });
  const [tripType, setTripType] = useState('roundtrip');
  const [currentStep, setCurrentStep] = useState(0); // 0: search, 1: select, 2: booking, 3: orders
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);

  // 携程风格的数据结构
  useEffect(() => {
    const mockFlights = [
      {
        ID: "flight_001",
        FlightNumber: "QA8888",
        Airline: "量子航空",
        AirlineCode: "QA",
        AirlineLogo: "/api/placeholder/40/40",
        From: "PEK",
        FromCity: "北京",
        FromAirport: "北京首都国际机场",
        FromTerminal: "T3",
        To: "LAX",
        ToCity: "洛杉矶",
        ToAirport: "洛杉矶国际机场",
        ToTerminal: "TBIT",
        DepartureTime: "2024-07-20T14:30:00",
        ArrivalTime: "2024-07-20T10:45:00", // 跨时区
        Duration: "13h 15m",
        Aircraft: "Boeing 787-9",
        Price: {
          Economy: 450000000000, // 4,500 QAU
          Business: 1200000000000, // 12,000 QAU
          First: 2500000000000 // 25,000 QAU
        },
        OriginalPrice: {
          Economy: 520000000000, // 原价5,200 QAU
          Business: 1400000000000,
          First: 2800000000000
        },
        AvailableSeats: {
          Economy: 156,
          Business: 28,
          First: 8
        },
        Amenities: ["WiFi", "娱乐系统", "餐食", "毛毯", "充电口", "个人屏幕"],
        Rating: 4.8,
        ReviewCount: 2847,
        Stops: 0,
        StopCities: [],
        BaggageAllowance: {
          Carry: "7kg",
          Checked: "2x23kg"
        },
        CancellationPolicy: "免费取消24小时内",
        ChangePolicy: "免费改签1次",
        MealType: "正餐+小食",
        SeatPitch: "32英寸",
        OnTimeRate: 92,
        Tags: ["热门", "准点率高", "服务优质"],
        Promotions: ["早鸟优惠", "会员专享"],
        FlightType: "国际航班"
      },
      {
        ID: "flight_002",
        FlightNumber: "QA6666",
        Airline: "量子航空",
        AirlineCode: "QA",
        AirlineLogo: "/api/placeholder/40/40",
        From: "PEK",
        FromCity: "北京",
        FromAirport: "北京首都国际机场",
        FromTerminal: "T3",
        To: "LAX",
        ToCity: "洛杉矶",
        ToAirport: "洛杉矶国际机场",
        ToTerminal: "TBIT",
        DepartureTime: "2024-07-20T22:15:00",
        ArrivalTime: "2024-07-20T18:30:00",
        Duration: "12h 15m",
        Aircraft: "Airbus A350",
        Price: {
          Economy: 420000000000, // 4,200 QAU
          Business: 1100000000000, // 11,000 QAU
          First: 2200000000000 // 22,000 QAU
        },
        OriginalPrice: {
          Economy: 480000000000,
          Business: 1250000000000,
          First: 2500000000000
        },
        AvailableSeats: {
          Economy: 234,
          Business: 42,
          First: 12
        },
        Amenities: ["WiFi", "娱乐系统", "餐食", "充电口", "个人屏幕", "降噪耳机"],
        Rating: 4.9,
        ReviewCount: 3156,
        Stops: 0,
        StopCities: [],
        BaggageAllowance: {
          Carry: "7kg",
          Checked: "2x23kg"
        },
        CancellationPolicy: "免费取消48小时内",
        ChangePolicy: "免费改签2次",
        MealType: "正餐+小食+夜宵",
        SeatPitch: "34英寸",
        OnTimeRate: 95,
        Tags: ["推荐", "夜间航班", "宽体机"],
        Promotions: ["限时特价", "积分双倍"],
        FlightType: "国际航班"
      },
      {
        ID: "flight_003",
        FlightNumber: "QA1234",
        Airline: "量子航空",
        AirlineCode: "QA",
        AirlineLogo: "/api/placeholder/40/40",
        From: "PEK",
        FromCity: "北京",
        FromAirport: "北京首都国际机场",
        FromTerminal: "T3",
        To: "LAX",
        ToCity: "洛杉矶",
        ToAirport: "洛杉矶国际机场",
        ToTerminal: "TBIT",
        DepartureTime: "2024-07-20T08:45:00",
        ArrivalTime: "2024-07-20T04:20:00",
        Duration: "13h 35m",
        Aircraft: "Boeing 777-300ER",
        Price: {
          Economy: 380000000000, // 3,800 QAU
          Business: 980000000000, // 9,800 QAU
          First: 1980000000000 // 19,800 QAU
        },
        OriginalPrice: {
          Economy: 450000000000,
          Business: 1150000000000,
          First: 2300000000000
        },
        AvailableSeats: {
          Economy: 189,
          Business: 35,
          First: 10
        },
        Amenities: ["WiFi", "娱乐系统", "餐食", "睡眠套装", "个人屏幕"],
        Rating: 4.7,
        ReviewCount: 1923,
        Stops: 0,
        StopCities: [],
        BaggageAllowance: {
          Carry: "7kg",
          Checked: "2x23kg"
        },
        CancellationPolicy: "免费取消72小时内",
        ChangePolicy: "免费改签1次",
        MealType: "早餐+正餐",
        SeatPitch: "31英寸",
        OnTimeRate: 88,
        Tags: ["早班机", "性价比高"],
        Promotions: ["特价促销"],
        FlightType: "国际航班"
      },
      {
        ID: "flight_004",
        FlightNumber: "QA5555",
        Airline: "量子航空",
        AirlineCode: "QA",
        AirlineLogo: "/api/placeholder/40/40",
        From: "PEK",
        FromCity: "北京",
        FromAirport: "北京首都国际机场",
        FromTerminal: "T3",
        To: "LAX",
        ToCity: "洛杉矶",
        ToAirport: "洛杉矶国际机场",
        ToTerminal: "TBIT",
        DepartureTime: "2024-07-20T16:20:00",
        ArrivalTime: "2024-07-20T12:55:00",
        Duration: "14h 35m",
        Aircraft: "Boeing 787-8",
        Price: {
          Economy: 360000000000, // 3,600 QAU
          Business: 920000000000, // 9,200 QAU
          First: 1850000000000 // 18,500 QAU
        },
        OriginalPrice: {
          Economy: 420000000000,
          Business: 1080000000000,
          First: 2100000000000
        },
        AvailableSeats: {
          Economy: 98,
          Business: 18,
          First: 6
        },
        Amenities: ["WiFi", "娱乐系统", "餐食", "个人屏幕"],
        Rating: 4.6,
        ReviewCount: 1456,
        Stops: 1,
        StopCities: ["东京"],
        StopDuration: "2h 15m",
        BaggageAllowance: {
          Carry: "7kg",
          Checked: "2x23kg"
        },
        CancellationPolicy: "免费取消48小时内",
        ChangePolicy: "免费改签1次",
        MealType: "正餐+小食",
        SeatPitch: "30英寸",
        OnTimeRate: 85,
        Tags: ["中转航班", "最低价"],
        Promotions: ["超值特惠"],
        FlightType: "国际航班"
      }
    ];

    const mockAirports = [
      { Code: "PEK", City: "北京", Name: "北京首都国际机场", Country: "中国", IATA: "PEK", ICAO: "ZBAA" },
      { Code: "PVG", City: "上海", Name: "上海浦东国际机场", Country: "中国", IATA: "PVG", ICAO: "ZSPD" },
      { Code: "CAN", City: "广州", Name: "广州白云国际机场", Country: "中国", IATA: "CAN", ICAO: "ZGGG" },
      { Code: "LAX", City: "洛杉矶", Name: "洛杉矶国际机场", Country: "美国", IATA: "LAX", ICAO: "KLAX" },
      { Code: "NRT", City: "东京", Name: "成田国际机场", Country: "日本", IATA: "NRT", ICAO: "RJAA" },
      { Code: "LHR", City: "伦敦", Name: "希思罗机场", Country: "英国", IATA: "LHR", ICAO: "EGLL" },
      { Code: "CDG", City: "巴黎", Name: "戴高乐机场", Country: "法国", IATA: "CDG", ICAO: "LFPG" },
      { Code: "FRA", City: "法兰克福", Name: "法兰克福机场", Country: "德国", IATA: "FRA", ICAO: "EDDF" }
    ];

    // 模拟用户订单
    const mockBookings = [
      {
        ID: "booking_001",
        OrderNumber: "QA20240720001",
        FlightNumber: "QA8888",
        Airline: "量子航空",
        Route: "北京 → 洛杉矶",
        DepartureTime: "2024-07-20 14:30",
        ArrivalTime: "2024-07-20 10:45",
        Class: "经济舱",
        Passengers: 1,
        PassengerNames: ["张三"],
        TotalPrice: 450000000000, // 4,500 QAU
        Status: "已出票",
        BookingTime: "2024-06-18 14:30",
        TicketNumbers: ["7841234567890"],
        PNR: "ABC123",
        ETicket: true
      },
      {
        ID: "booking_002",
        OrderNumber: "QA20240821002",
        FlightNumber: "QA6666",
        Airline: "量子航空",
        Route: "上海 → 东京",
        DepartureTime: "2024-08-21 09:15",
        ArrivalTime: "2024-08-21 13:30",
        Class: "商务舱",
        Passengers: 2,
        PassengerNames: ["李四", "王五"],
        TotalPrice: 1040000000000, // 10,400 QAU
        Status: "待出行",
        BookingTime: "2024-07-23 16:45",
        TicketNumbers: ["7841234567891", "7841234567892"],
        PNR: "DEF456",
        ETicket: true
      }
    ];

    setFlights(mockFlights);
    setAirports(mockAirports);
    setBookings(mockBookings);
    setLoading(false);
  }, []);

  // 携程风格的功能函数
  const formatAmount = (amount) => {
    return formatCurrency(amount, 'QAU');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getClassDisplayName = (classType) => {
    const classMap = {
      'economy': '经济舱',
      'business': '商务舱',
      'first': '头等舱'
    };
    return classMap[classType] || '经济舱';
  };

  const getAirportInfo = (code) => {
    return airports.find(airport => airport.Code === code);
  };

  const calculateDiscount = (original, current) => {
    return Math.round((1 - current / original) * 100);
  };

  // 携程风格的航班筛选和排序
  const filteredAndSortedFlights = flights
    .filter(flight => {
      if (filterBy === 'all') return true;
      if (filterBy === 'direct') return flight.Stops === 0;
      if (filterBy === 'morning') {
        const hour = new Date(flight.DepartureTime).getHours();
        return hour >= 6 && hour < 12;
      }
      if (filterBy === 'afternoon') {
        const hour = new Date(flight.DepartureTime).getHours();
        return hour >= 12 && hour < 18;
      }
      if (filterBy === 'evening') {
        const hour = new Date(flight.DepartureTime).getHours();
        return hour >= 18 || hour < 6;
      }
      return true;
    })
    .sort((a, b) => {
      const classKey = searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1);
      switch (sortBy) {
        case 'price':
          return a.Price[classKey] - b.Price[classKey];
        case 'time':
          return new Date(a.DepartureTime) - new Date(b.DepartureTime);
        case 'duration':
          return parseInt(a.Duration) - parseInt(b.Duration);
        case 'rating':
          return b.Rating - a.Rating;
        default:
          return 0;
      }
    });

  // 搜索航班
  const handleSearch = () => {
    console.log('搜索航班:', searchParams);
    setCurrentStep(1);
  };

  // 预订航班
  const handleBooking = async () => {
    if (!selectedFlight) {
      alert('请选择航班');
      return;
    }

    try {
      const classKey = searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1);
      const price = selectedFlight.Price[classKey];
      const totalPrice = price * searchParams.passengers;
      
      const newBooking = {
        ID: `booking_${Date.now()}`,
        OrderNumber: `QA${Date.now()}`,
        FlightNumber: selectedFlight.FlightNumber,
        Airline: selectedFlight.Airline,
        Route: `${selectedFlight.FromCity} → ${selectedFlight.ToCity}`,
        DepartureTime: formatFullDate(selectedFlight.DepartureTime) + ' ' + formatTime(selectedFlight.DepartureTime),
        ArrivalTime: formatFullDate(selectedFlight.ArrivalTime) + ' ' + formatTime(selectedFlight.ArrivalTime),
        Class: getClassDisplayName(searchParams.class),
        Passengers: searchParams.passengers,
        PassengerNames: Array.from({ length: searchParams.passengers }, (_, i) => `乘客${i + 1}`),
        TotalPrice: totalPrice,
        Status: "已出票",
        BookingTime: new Date().toLocaleString(),
        TicketNumbers: Array.from({ length: searchParams.passengers }, (_, i) => `784${Date.now()}${i}`),
        PNR: `PNR${Date.now().toString().slice(-6)}`,
        ETicket: true
      };

      setBookings(prev => [newBooking, ...prev]);
      alert(`预订成功！\n航班: ${selectedFlight.FlightNumber}\n路线: ${selectedFlight.FromCity} → ${selectedFlight.ToCity}\n舱位: ${getClassDisplayName(searchParams.class)}\n乘客: ${searchParams.passengers}人\n总价: ${formatAmount(totalPrice)}`);
      
      setCurrentStep(3); // 跳转到订单页面
    } catch (error) {
      console.error('预订失败:', error);
      alert('预订失败，请重试');
    }
  };

  // 渲染搜索页面
  const renderSearchPage = () => (
    <div className="space-y-6">
      {/* 热门推荐横幅 */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">✈️ 热门航线</h2>
              <p className="text-gray-300">精选全球热门目的地，特价机票限时抢购</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">{flights.length}</p>
              <p className="text-gray-300">条航线</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索表单 */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plane className="w-6 h-6 mr-2" />
            机票搜索
          </CardTitle>
          <CardDescription className="text-gray-300">
            搜索全球航班，享受量子安全保障
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 行程类型 */}
          <div className="flex space-x-4">
            <Button
              variant={tripType === 'roundtrip' ? 'default' : 'outline'}
              onClick={() => setTripType('roundtrip')}
              className="flex items-center"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              往返
            </Button>
            <Button
              variant={tripType === 'oneway' ? 'default' : 'outline'}
              onClick={() => setTripType('oneway')}
              className="flex items-center"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              单程
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 出发地 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">出发地</label>
              <div className="relative">
                <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={searchParams.from}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg"
                >
                  {airports.map(airport => (
                    <option key={airport.Code} value={airport.Code}>
                      {airport.City} ({airport.Code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 目的地 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">目的地</label>
              <div className="relative">
                <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={searchParams.to}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg"
                >
                  {airports.map(airport => (
                    <option key={airport.Code} value={airport.Code}>
                      {airport.City} ({airport.Code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 出发日期 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">出发日期</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={searchParams.departDate}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, departDate: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* 返程日期 */}
            {tripType === 'roundtrip' && (
              <div>
                <label className="text-sm text-gray-300 mb-2 block">返程日期</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={searchParams.returnDate}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 乘客数量 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">乘客数量</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select 
                  value={searchParams.passengers}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg"
                >
                  {[1,2,3,4,5,6,7,8,9].map(num => (
                    <option key={num} value={num}>{num} 人</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 舱位等级 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">舱位等级</label>
              <select 
                value={searchParams.class}
                onChange={(e) => setSearchParams(prev => ({ ...prev, class: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg"
              >
                <option value="economy">经济舱</option>
                <option value="business">商务舱</option>
                <option value="first">头等舱</option>
              </select>
            </div>

            {/* 搜索按钮 */}
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-3"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索航班
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 热门航线推荐 */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">热门航线推荐</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { from: "北京", to: "洛杉矶", price: "¥3,600起", tag: "热门" },
              { from: "上海", to: "东京", price: "¥1,800起", tag: "特价" },
              { from: "广州", to: "伦敦", price: "¥4,200起", tag: "推荐" }
            ].map((route, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{route.from} → {route.to}</span>
                    <Badge className="bg-red-500/20 text-red-400">{route.tag}</Badge>
                  </div>
                  <p className="text-cyan-400 font-bold">{route.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 渲染航班选择页面
  const renderFlightSelectPage = () => {
    const fromAirport = getAirportInfo(searchParams.from);
    const toAirport = getAirportInfo(searchParams.to);

    return (
      <div className="space-y-6">
        {/* 搜索结果头部 */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(0)}
                  className="flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  修改搜索
                </Button>
                <div className="text-white">
                  <h2 className="text-xl font-bold">
                    {fromAirport?.City} → {toAirport?.City}
                  </h2>
                  <p className="text-gray-300">
                    {formatFullDate(searchParams.departDate)} • {searchParams.passengers}位乘客 • {getClassDisplayName(searchParams.class)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-400">{filteredAndSortedFlights.length}</p>
                <p className="text-gray-300">个航班</p>
              </div>
            </div>

            {/* 筛选和排序 */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">排序:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded text-sm"
                >
                  <option value="price">价格最低</option>
                  <option value="time">起飞时间</option>
                  <option value="duration">飞行时长</option>
                  <option value="rating">评分最高</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">筛选:</span>
                <select 
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded text-sm"
                >
                  <option value="all">全部航班</option>
                  <option value="direct">仅直飞</option>
                  <option value="morning">上午出发</option>
                  <option value="afternoon">下午出发</option>
                  <option value="evening">晚上出发</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 航班列表 */}
        <div className="space-y-4">
          {filteredAndSortedFlights.map((flight) => {
            const classKey = searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1);
            const currentPrice = flight.Price[classKey];
            const originalPrice = flight.OriginalPrice[classKey];
            const discount = calculateDiscount(originalPrice, currentPrice);

            return (
              <Card 
                key={flight.ID} 
                className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer ${
                  selectedFlight?.ID === flight.ID ? 'ring-2 ring-cyan-400' : ''
                }`}
                onClick={() => setSelectedFlight(flight)}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* 航班基本信息 */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{flight.Airline}</h3>
                          <p className="text-gray-300">{flight.FlightNumber} • {flight.Aircraft}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className="bg-yellow-500/20 text-yellow-400 truncate-number">
                            ⭐ {flight.Rating}
                          </Badge>
                          {flight.Tags.includes("热门") && <Badge className="bg-red-500/20 text-red-400">热门</Badge>}
                          {flight.Tags.includes("推荐") && <Badge className="bg-green-500/20 text-green-400">推荐</Badge>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{formatTime(flight.DepartureTime)}</p>
                          <p className="text-sm text-gray-400">{flight.From}</p>
                          <p className="text-xs text-gray-500">{flight.FromTerminal}</p>
                        </div>
                        
                        <div className="flex-1 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                            <div className="text-center">
                              <Plane className="w-4 h-4 text-cyan-400 mx-auto" />
                              {flight.Stops > 0 && (
                                <div className="text-xs text-yellow-400 mt-1">
                                  {flight.StopCities.join(',')}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-400 to-cyan-400"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-400">{flight.Duration}</p>
                          <p className="text-xs text-gray-500">
                            {flight.Stops === 0 ? '直飞' : `${flight.Stops}次中转`}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{formatTime(flight.ArrivalTime)}</p>
                          <p className="text-sm text-gray-400">{flight.To}</p>
                          <p className="text-xs text-gray-500">{flight.ToTerminal}</p>
                        </div>
                      </div>
                    </div>

                    {/* 价格和选择 */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through truncate-number">
                              {formatAmount(originalPrice)}
                            </span>
                          )}
                          {discount > 0 && (
                            <Badge className="bg-red-500/20 text-red-400 text-xs truncate-number">
                              {discount}折
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-green-400 truncate-number">{formatAmount(currentPrice)}</p>
                        <p className="text-xs text-gray-400">含税费</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">余票: {flight.AvailableSeats[classKey]}张</p>
                        <p className="text-sm text-gray-300">准点率: {flight.OnTimeRate}%</p>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFlight(flight);
                          setCurrentStep(2);
                        }}
                        disabled={flight.AvailableSeats[classKey] === 0}
                      >
                        {flight.AvailableSeats[classKey] === 0 ? '已售罄' : '选择'}
                      </Button>
                    </div>

                    {/* 航班详情 */}
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">航班详情</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">座椅间距:</span>
                          <span className="text-white">{flight.SeatPitch}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">餐食:</span>
                          <span className="text-white">{flight.MealType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">行李:</span>
                          <span className="text-white">{flight.BaggageAllowance.Checked}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">退改:</span>
                          <span className="text-white">{flight.CancellationPolicy}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {flight.Amenities.slice(0, 4).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染预订页面
  const renderBookingPage = () => {
    if (!selectedFlight) return null;

    const classKey = searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1);
    const unitPrice = selectedFlight.Price[classKey];
    const totalPrice = unitPrice * searchParams.passengers;

    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">确认订单</CardTitle>
            <CardDescription className="text-gray-300">
              请确认您的航班信息和乘客信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 航班信息确认 */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">航班信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">航班号</p>
                  <p className="text-white">{selectedFlight.FlightNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">航空公司</p>
                  <p className="text-white">{selectedFlight.Airline}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">出发</p>
                  <p className="text-white">{selectedFlight.FromCity} {formatTime(selectedFlight.DepartureTime)}</p>
                  <p className="text-gray-300 text-sm">{formatFullDate(selectedFlight.DepartureTime)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">到达</p>
                  <p className="text-white">{selectedFlight.ToCity} {formatTime(selectedFlight.ArrivalTime)}</p>
                  <p className="text-gray-300 text-sm">{formatFullDate(selectedFlight.ArrivalTime)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">舱位</p>
                  <p className="text-white">{getClassDisplayName(searchParams.class)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">乘客数量</p>
                  <p className="text-white">{searchParams.passengers}人</p>
                </div>
              </div>
            </div>

            {/* 乘客信息 */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">乘客信息</h3>
              <div className="space-y-4">
                {Array.from({ length: searchParams.passengers }, (_, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-4">
                    <h4 className="text-white mb-3">乘客 {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-300 mb-1 block">姓名</label>
                        <Input
                          placeholder="请输入姓名"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-1 block">证件类型</label>
                        <select className="w-full p-2 bg-white/10 border border-white/20 text-white rounded">
                          <option value="passport">护照</option>
                          <option value="id">身份证</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-1 block">证件号码</label>
                        <Input
                          placeholder="请输入证件号码"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 联系信息 */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">联系信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">手机号码</label>
                  <Input
                    placeholder="请输入手机号码"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">邮箱地址</label>
                  <Input
                    placeholder="请输入邮箱地址"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>

            {/* 价格明细 */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">价格明细</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">机票价格 × {searchParams.passengers}</span>
                  <span className="text-white truncate-number">{formatAmount(unitPrice * searchParams.passengers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">税费</span>
                  <span className="text-white">已含</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">总价</span>
                    <span className="text-green-400 truncate-number">{formatAmount(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 支付按钮 */}
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                返回选择
              </Button>
              <Button 
                onClick={handleBooking}
                className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                立即支付
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 渲染订单页面
  const renderOrdersPage = () => (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">我的订单</CardTitle>
          <CardDescription className="text-gray-300">
            查看您的机票订单和电子票
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.ID} className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {booking.FlightNumber} • {booking.Airline}
                        </h3>
                        <p className="text-gray-400">{booking.Route}</p>
                      </div>
                      <Badge className={`${
                        booking.Status === '已出票' ? 'bg-green-500/20 text-green-400' :
                        booking.Status === '待出行' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {booking.Status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">出发时间</p>
                        <p className="text-white">{booking.DepartureTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">到达时间</p>
                        <p className="text-white">{booking.ArrivalTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">舱位</p>
                        <p className="text-white">{booking.Class}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">乘客</p>
                        <p className="text-cyan-400 truncate-number">{booking.Passengers}人</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">订单号</p>
                        <p className="text-white">{booking.OrderNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">PNR</p>
                        <p className="text-white">{booking.PNR}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">总价</p>
                        <p className="text-green-400 font-bold truncate-number">{formatAmount(booking.TotalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">下单时间</p>
                        <p className="text-white">{booking.BookingTime}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <div className="text-sm text-gray-400">
                        <p>乘客: {booking.PassengerNames.join(', ')}</p>
                        <p>票号: {booking.TicketNumbers.join(', ')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4 mr-2" />
                          电子票
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          下载
                        </Button>
                        {booking.Status === '待出行' && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            改签
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">还没有订单记录</h3>
              <p className="text-gray-300 mb-6">快去搜索心仪的航班吧</p>
              <Button 
                onClick={() => setCurrentStep(0)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索航班
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="container mx-auto max-w-7xl">
        {/* 携程风格的Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                量子机票预订
              </h1>
              <p className="text-gray-300 text-lg">安全预订全球航班，享受量子加密保障</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-500/20 text-blue-400">
                <Shield className="w-4 h-4 mr-1" />
                量子安全
              </Badge>
              <Badge className="bg-green-500/20 text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                实时验证
              </Badge>
            </div>
          </div>
        </div>

        <Tabs 
          value={currentStep === 0 ? "search" : currentStep === 1 ? "select" : currentStep === 2 ? "booking" : "orders"} 
          className="space-y-6"
          onValueChange={(value) => {
            if (value === "search") setCurrentStep(0);
            else if (value === "orders") setCurrentStep(3);
          }}
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/10 rounded-lg">
            <TabsTrigger value="search" onClick={() => setCurrentStep(0)}>搜索航班</TabsTrigger>
            <TabsTrigger value="select" disabled={currentStep < 1}>选择航班</TabsTrigger>
            <TabsTrigger value="booking" disabled={currentStep < 2}>确认订单</TabsTrigger>
            <TabsTrigger value="orders" onClick={() => setCurrentStep(3)}>我的订单</TabsTrigger>
          </TabsList>

          {currentStep === 0 && <TabsContent value="search">{renderSearchPage()}</TabsContent>}
          {currentStep === 1 && <TabsContent value="select">{renderFlightSelectPage()}</TabsContent>}
          {currentStep === 2 && <TabsContent value="booking">{renderBookingPage()}</TabsContent>}
          {currentStep === 3 && <TabsContent value="orders">{renderOrdersPage()}</TabsContent>}
        </Tabs>

        {/* 量子安全面板 */}
        <div className="mt-8">
          <QuantumSecurityPanel />
        </div>
      </div>
    </div>
  );
};

export default FlightBookingApp;


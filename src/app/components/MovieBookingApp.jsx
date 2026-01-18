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
  Film,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Ticket,
  CreditCard,
  Search,
  Filter,
  Play,
  Heart,
  Share,
  ShoppingCart,
  CheckCircle,
  Eye,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Gift,
  Zap,
  Award,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Volume2,
  Camera,
  Edit,
  Download,
  Upload,
  Settings,
  Bell,
  User,
  Home,
  Navigation,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as LocationIcon,
  Car,
  Bus,
  Train,
  Plane,
  Coffee,
  Utensils,
  ShoppingBag,
  Gamepad2,
  Music,
  Headphones,
  Wifi,
  Parking,
  Baby,
  Wheelchair,
  PawPrint,
  Snowflake,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Thermometer,
  Umbrella,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  CreditCard as CardIcon,
  Wallet,
  Coins,
  DollarSign,
  Euro,
  Yen,
  PoundSterling,
  Bitcoin,
  Banknote,
  Receipt,
  Calculator,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Pulse,
  Cpu,
  HardDrive,
  Server,
  Database,
  Cloud,
  CloudUpload,
  CloudDownload,
  Folder,
  File,
  FileText,
  Image,
  Video,
  Music2,
  Mic,
  Speaker,
  Radio,
  Tv,
  Monitor as ScreenIcon,
  Projector,
  Camera as CameraIcon,
  Video as VideoIcon,
  Clapperboard,
  Megaphone,
  Bullhorn,
  Volume,
  VolumeX,
  VolumeMute,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Pause,
  Stop,
  Record,
  Disc,
  Disc2,
  Disc3,
  Cassette,
  Vinyl,
  Headset,
  Microphone,
  MicrophoneOff,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  MessageCircle,
  MessageSquareText,
  Mail as MailIcon,
  MailOpen,
  MailCheck,
  MailX,
  MailPlus,
  MailMinus,
  Inbox,
  Outbox,
  Send,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash,
  Trash2,
  Delete,
  X,
  Plus,
  Minus,
  Equal,
  Divide,
  Percent,
  Hash,
  AtSign,
  Ampersand,
  Asterisk,
  Slash,
  Backslash,
  Pipe,
  Tilde,
  Caret,
  Dollar,
  Cent,
  Currency,
  CurrencyDollar,
  CurrencyEuro,
  CurrencyPound,
  CurrencyYen,
  CurrencyRupee,
  CurrencyBitcoin,
  CurrencyEthereum,
  CurrencyLitecoin,
  CurrencyDogecoin,
  CurrencyMonero,
  CurrencyRipple,
  CurrencyCardano,
  CurrencyPolkadot,
  CurrencyChainlink,
  CurrencyStellar,
  CurrencyTether,
  CurrencyBinance,
  CurrencyUniswap,
  CurrencyAave,
  CurrencyCompound,
  CurrencyMaker,
  CurrencySushi,
  CurrencyPancake,
  CurrencyYearn,
  CurrencyCurve,
  CurrencyBalancer,
  CurrencySnx,
  CurrencyUma,
  CurrencyBand,
  CurrencyKyber,
  CurrencyZrx,
  CurrencyRen,
  CurrencyLoopring,
  CurrencyOmg,
  CurrencyBat,
  CurrencyZil,
  CurrencyIost,
  CurrencyOnt,
  CurrencyVet,
  CurrencyIcx,
  CurrencyZec,
  CurrencyDash,
  CurrencyXmr,
  CurrencyEtc,
  CurrencyBch,
  CurrencyBsv,
  CurrencyLtc,
  CurrencyXrp,
  CurrencyAda,
  CurrencyDot,
  CurrencyLink,
  CurrencyXlm,
  CurrencyUsdt,
  CurrencyBnb,
  CurrencyUni,
  CurrencyComp,
  CurrencyMkr,
  CurrencySushi as SushiIcon,
  CurrencyCake,
  CurrencyYfi,
  CurrencyCrv,
  CurrencyBal,
  CurrencySnx as SnxIcon,
  CurrencyUma as UmaIcon,
  CurrencyBand as BandIcon,
  CurrencyKnc,
  CurrencyZrx as ZrxIcon,
  CurrencyRen as RenIcon,
  CurrencyLrc,
  CurrencyOmg as OmgIcon,
  CurrencyBat as BatIcon,
  CurrencyZil as ZilIcon,
  CurrencyIost as IostIcon,
  CurrencyOnt as OntIcon,
  CurrencyVet as VetIcon,
  CurrencyIcx as IcxIcon,
} from 'lucide-react';

const MovieBookingApp = () => {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('上海');
  const [sortBy, setSortBy] = useState('hot');
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // 猫眼电影对标的数据结构
  useEffect(() => {
    const mockMovies = [
      {
        ID: 'movie_001',
        Title: '量子纪元：时空守护者',
        EnglishTitle: 'Quantum Era: Guardians of Time',
        Genre: ['科幻', '动作', '冒险'],
        Duration: 148,
        Rating: 9.2,
        WantToSee: 156789,
        ReleaseDate: '2024-06-15',
        Director: '克里斯托弗·诺兰',
        Cast: ['汤姆·哈迪', '安妮·海瑟薇', '马修·麦康纳', '杰西卡·查斯坦'],
        Synopsis:
          '在不久的将来，人类发现了量子技术的终极秘密，但这项技术也带来了前所未有的危险。一支精英团队必须穿越多重宇宙，拯救人类文明免于毁灭。影片采用最新的量子视觉效果技术，为观众呈现前所未见的视觉盛宴。',
        Poster: '/api/placeholder/300/450',
        Trailer: 'https://example.com/trailer',
        Language: '英语',
        Subtitles: ['中文', '英文'],
        AgeRating: 'PG-13',
        Price: 8000000000, // 80 QAU
        VIPPrice: 12000000000, // 120 QAU
        IMAXPrice: 15000000000, // 150 QAU
        IsNowShowing: true,
        IsHot: true,
        IsNew: true,
        BookingCount: 234567,
        BoxOffice: '15.6亿',
        Country: '美国',
        ProductionCompany: '华纳兄弟',
        Tags: ['IMAX', '杜比全景声', '4DX', '中国巨幕'],
        Photos: [
          '/api/placeholder/800/450',
          '/api/placeholder/800/450',
          '/api/placeholder/800/450',
        ],
        Videos: [
          { title: '正式预告片', url: 'https://example.com/trailer1', duration: '2:30' },
          { title: '幕后花絮', url: 'https://example.com/behind1', duration: '5:45' },
          { title: '演员访谈', url: 'https://example.com/interview1', duration: '8:20' },
        ],
        Reviews: [
          {
            user: '影迷小王',
            rating: 9.5,
            content: '视觉效果震撼，剧情紧凑，是今年最佳科幻片！',
            date: '2024-06-16',
          },
          {
            user: '电影达人',
            rating: 9.0,
            content: '诺兰再次证明了自己的天才，量子概念运用得非常巧妙。',
            date: '2024-06-17',
          },
        ],
        Awards: ['奥斯卡最佳视觉效果提名', '金球奖最佳科幻片'],
        Festivals: ['戛纳电影节', '威尼斯电影节'],
      },
      {
        ID: 'movie_002',
        Title: '星际迷航：新纪元',
        EnglishTitle: 'Star Trek: New Era',
        Genre: ['科幻', '冒险', '动作'],
        Duration: 132,
        Rating: 8.8,
        WantToSee: 98765,
        ReleaseDate: '2024-06-20',
        Director: 'J.J. 艾布拉姆斯',
        Cast: ['克里斯·派恩', '扎克瑞·昆图', '佐伊·索尔达娜', '卡尔·厄本'],
        Synopsis:
          '企业号船员发现了一个神秘的量子异常现象，这可能改变整个银河系的命运。在这场史诗般的冒险中，船员们必须面对前所未有的挑战，探索未知的星域，拯救无数文明。',
        Poster: '/api/placeholder/300/450',
        Trailer: 'https://example.com/trailer2',
        Language: '英语',
        Subtitles: ['中文', '英文'],
        AgeRating: 'PG-13',
        Price: 7500000000, // 75 QAU
        VIPPrice: 11000000000, // 110 QAU
        IMAXPrice: 14000000000, // 140 QAU
        IsNowShowing: true,
        IsHot: true,
        IsNew: false,
        BookingCount: 187432,
        BoxOffice: '12.3亿',
        Country: '美国',
        ProductionCompany: '派拉蒙影业',
        Tags: ['IMAX', '杜比全景声', '中国巨幕'],
        Photos: ['/api/placeholder/800/450', '/api/placeholder/800/450'],
        Videos: [
          { title: '官方预告', url: 'https://example.com/trailer2', duration: '2:15' },
          { title: '制作特辑', url: 'https://example.com/making2', duration: '6:30' },
        ],
        Reviews: [
          {
            user: '科幻迷',
            rating: 8.5,
            content: '经典IP的全新演绎，特效和剧情都很棒！',
            date: '2024-06-21',
          },
        ],
        Awards: ['土星奖最佳科幻电影'],
        Festivals: ['圣丹斯电影节'],
      },
      {
        ID: 'movie_003',
        Title: '复仇者联盟：量子战争',
        EnglishTitle: 'Avengers: Quantum War',
        Genre: ['动作', '科幻', '冒险'],
        Duration: 165,
        Rating: 9.5,
        WantToSee: 289456,
        ReleaseDate: '2024-06-25',
        Director: '罗素兄弟',
        Cast: ['小罗伯特·唐尼', '克里斯·埃文斯', '斯嘉丽·约翰逊', '克里斯·海姆斯沃斯'],
        Synopsis:
          '复仇者们面临史上最强大的敌人，必须利用量子技术穿越时空，集结所有英雄力量。这是一场关乎宇宙存亡的终极之战，每一个英雄都将面临前所未有的考验。',
        Poster: '/api/placeholder/300/450',
        Trailer: 'https://example.com/trailer3',
        Language: '英语',
        Subtitles: ['中文', '英文'],
        AgeRating: 'PG-13',
        Price: 9000000000, // 90 QAU
        VIPPrice: 13500000000, // 135 QAU
        IMAXPrice: 16500000000, // 165 QAU
        IsNowShowing: true,
        IsHot: true,
        IsNew: true,
        BookingCount: 456789,
        BoxOffice: '28.9亿',
        Country: '美国',
        ProductionCompany: '漫威影业',
        Tags: ['IMAX', '杜比全景声', '4DX', '中国巨幕', '杜比影院'],
        Photos: [
          '/api/placeholder/800/450',
          '/api/placeholder/800/450',
          '/api/placeholder/800/450',
          '/api/placeholder/800/450',
        ],
        Videos: [
          { title: '终极预告', url: 'https://example.com/trailer3', duration: '3:00' },
          { title: '角色特辑', url: 'https://example.com/characters3', duration: '4:20' },
          { title: '动作场面', url: 'https://example.com/action3', duration: '2:45' },
        ],
        Reviews: [
          {
            user: '漫威粉',
            rating: 10,
            content: '史诗级的超级英雄电影，每一分钟都让人热血沸腾！',
            date: '2024-06-26',
          },
          {
            user: '电影评论家',
            rating: 9.0,
            content: '罗素兄弟再次创造奇迹，这是漫威宇宙的巅峰之作。',
            date: '2024-06-27',
          },
        ],
        Awards: ['人民选择奖最受欢迎电影', 'MTV电影奖最佳动作片'],
        Festivals: ['圣地亚哥动漫展首映'],
      },
      {
        ID: 'movie_004',
        Title: '流浪地球3：量子远征',
        EnglishTitle: 'The Wandering Earth 3: Quantum Expedition',
        Genre: ['科幻', '灾难', '剧情'],
        Duration: 155,
        Rating: 9.0,
        WantToSee: 198765,
        ReleaseDate: '2024-06-30',
        Director: '郭帆',
        Cast: ['吴京', '易烊千玺', '李光洁', '沈腾'],
        Synopsis:
          '地球在宇宙中继续流浪，人类发现了量子跳跃技术，可以瞬间穿越星系。但这项技术也带来了新的危机，人类必须在拯救地球和探索未知之间做出选择。',
        Poster: '/api/placeholder/300/450',
        Trailer: 'https://example.com/trailer4',
        Language: '中文',
        Subtitles: ['英文', '日文', '韩文'],
        AgeRating: 'PG-13',
        Price: 8500000000, // 85 QAU
        VIPPrice: 12500000000, // 125 QAU
        IMAXPrice: 15500000000, // 155 QAU
        IsNowShowing: true,
        IsHot: true,
        IsNew: true,
        BookingCount: 345678,
        BoxOffice: '22.1亿',
        Country: '中国',
        ProductionCompany: '中国电影股份有限公司',
        Tags: ['IMAX', '杜比全景声', '中国巨幕', '4DX'],
        Photos: [
          '/api/placeholder/800/450',
          '/api/placeholder/800/450',
          '/api/placeholder/800/450',
        ],
        Videos: [
          { title: '正式预告', url: 'https://example.com/trailer4', duration: '2:50' },
          { title: '制作花絮', url: 'https://example.com/making4', duration: '7:15' },
        ],
        Reviews: [
          {
            user: '国产科幻迷',
            rating: 9.5,
            content: '中国科幻电影的新高度，特效和情感并重！',
            date: '2024-07-01',
          },
        ],
        Awards: ['华表奖优秀故事片', '金鸡奖最佳视觉效果'],
        Festivals: ['上海国际电影节', '北京国际电影节'],
      },
    ];

    const mockCinemas = [
      {
        ID: 'cinema_001',
        Name: '万达影城(五角场店)',
        Brand: '万达影城',
        Location: '上海市杨浦区',
        Address: '翔殷路1099号合生汇购物中心5楼',
        Distance: '1.2km',
        Facilities: ['IMAX', '杜比全景声', '4DX', 'VIP厅', '杜比影院'],
        Rating: 4.8,
        Price: '低价',
        Parking: true,
        Restaurant: true,
        Shopping: true,
        Metro: '10号线五角场站',
        Phone: '021-12345678',
        BusinessHours: '09:00-24:00',
        Showtimes: {
          movie_001: [
            {
              Time: '10:00',
              Hall: 'IMAX厅1',
              Type: 'IMAX',
              AvailableSeats: 45,
              TotalSeats: 300,
              Price: 15000000000,
            },
            {
              Time: '13:30',
              Hall: 'IMAX厅1',
              Type: 'IMAX',
              AvailableSeats: 120,
              TotalSeats: 300,
              Price: 15000000000,
            },
            {
              Time: '16:45',
              Hall: '2号厅',
              Type: '普通',
              AvailableSeats: 89,
              TotalSeats: 200,
              Price: 8000000000,
            },
            {
              Time: '20:15',
              Hall: 'VIP厅',
              Type: 'VIP',
              AvailableSeats: 12,
              TotalSeats: 50,
              Price: 12000000000,
            },
            {
              Time: '23:00',
              Hall: '杜比厅',
              Type: '杜比全景声',
              AvailableSeats: 156,
              TotalSeats: 280,
              Price: 10000000000,
            },
          ],
          movie_003: [
            {
              Time: '09:30',
              Hall: 'IMAX厅2',
              Type: 'IMAX',
              AvailableSeats: 78,
              TotalSeats: 320,
              Price: 16500000000,
            },
            {
              Time: '12:45',
              Hall: '4DX厅',
              Type: '4DX',
              AvailableSeats: 34,
              TotalSeats: 120,
              Price: 18000000000,
            },
            {
              Time: '15:30',
              Hall: '3号厅',
              Type: '普通',
              AvailableSeats: 92,
              TotalSeats: 180,
              Price: 9000000000,
            },
            {
              Time: '18:45',
              Hall: 'VIP厅',
              Type: 'VIP',
              AvailableSeats: 23,
              TotalSeats: 50,
              Price: 13500000000,
            },
            {
              Time: '21:30',
              Hall: '杜比影院',
              Type: '杜比影院',
              AvailableSeats: 67,
              TotalSeats: 150,
              Price: 20000000000,
            },
          ],
        },
        Services: ['在线选座', '退改签', '小食配送', '会员积分'],
        Promotions: ['周二半价', '学生票8折', '会员专享优惠'],
        Photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      },
      {
        ID: 'cinema_002',
        Name: 'CGV影城(大悦城店)',
        Brand: 'CGV影城',
        Location: '上海市静安区',
        Address: '西藏北路166号大悦城北座8-9楼',
        Distance: '2.8km',
        Facilities: ['4DX', 'ScreenX', '杜比全景声', 'VIP厅'],
        Rating: 4.7,
        Price: '中等',
        Parking: true,
        Restaurant: true,
        Shopping: true,
        Metro: '1号线汉中路站',
        Phone: '021-87654321',
        BusinessHours: '09:30-23:30',
        Showtimes: {
          movie_002: [
            {
              Time: '11:00',
              Hall: 'ScreenX厅',
              Type: 'ScreenX',
              AvailableSeats: 56,
              TotalSeats: 180,
              Price: 16000000000,
            },
            {
              Time: '14:15',
              Hall: '4DX厅',
              Type: '4DX',
              AvailableSeats: 28,
              TotalSeats: 100,
              Price: 18000000000,
            },
            {
              Time: '17:30',
              Hall: '1号厅',
              Type: '普通',
              AvailableSeats: 134,
              TotalSeats: 200,
              Price: 7500000000,
            },
            {
              Time: '20:45',
              Hall: 'VIP厅',
              Type: 'VIP',
              AvailableSeats: 18,
              TotalSeats: 40,
              Price: 11000000000,
            },
          ],
          movie_004: [
            {
              Time: '10:30',
              Hall: '2号厅',
              Type: '普通',
              AvailableSeats: 145,
              TotalSeats: 220,
              Price: 8500000000,
            },
            {
              Time: '13:45',
              Hall: '杜比厅',
              Type: '杜比全景声',
              AvailableSeats: 89,
              TotalSeats: 160,
              Price: 11500000000,
            },
            {
              Time: '17:00',
              Hall: 'VIP厅',
              Type: 'VIP',
              AvailableSeats: 25,
              TotalSeats: 40,
              Price: 12500000000,
            },
            {
              Time: '20:30',
              Hall: 'ScreenX厅',
              Type: 'ScreenX',
              AvailableSeats: 67,
              TotalSeats: 180,
              Price: 17000000000,
            },
          ],
        },
        Services: ['在线选座', '退改签', '爆米花套餐', '生日优惠'],
        Promotions: ['情侣套票', '家庭套票', '会员日优惠'],
        Photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      },
      {
        ID: 'cinema_003',
        Name: '上海影城',
        Brand: '上海影城',
        Location: '上海市静安区',
        Address: '新闸路160号',
        Distance: '3.5km',
        Facilities: ['IMAX', '杜比全景声', '中国巨幕', '艺术厅'],
        Rating: 4.9,
        Price: '高端',
        Parking: true,
        Restaurant: false,
        Shopping: false,
        Metro: '2号线静安寺站',
        Phone: '021-62172426',
        BusinessHours: '09:00-24:00',
        Showtimes: {
          movie_001: [
            {
              Time: '10:30',
              Hall: 'IMAX厅',
              Type: 'IMAX',
              AvailableSeats: 89,
              TotalSeats: 400,
              Price: 18000000000,
            },
            {
              Time: '14:00',
              Hall: '中国巨幕厅',
              Type: '中国巨幕',
              AvailableSeats: 123,
              TotalSeats: 350,
              Price: 16000000000,
            },
            {
              Time: '17:30',
              Hall: '1号厅',
              Type: '普通',
              AvailableSeats: 167,
              TotalSeats: 250,
              Price: 8000000000,
            },
            {
              Time: '21:00',
              Hall: '杜比厅',
              Type: '杜比全景声',
              AvailableSeats: 78,
              TotalSeats: 200,
              Price: 12000000000,
            },
          ],
          movie_003: [
            {
              Time: '09:00',
              Hall: 'IMAX厅',
              Type: 'IMAX',
              AvailableSeats: 234,
              TotalSeats: 400,
              Price: 20000000000,
            },
            {
              Time: '12:30',
              Hall: '中国巨幕厅',
              Type: '中国巨幕',
              AvailableSeats: 189,
              TotalSeats: 350,
              Price: 18000000000,
            },
            {
              Time: '16:00',
              Hall: '2号厅',
              Type: '普通',
              AvailableSeats: 145,
              TotalSeats: 220,
              Price: 9000000000,
            },
            {
              Time: '19:30',
              Hall: '杜比厅',
              Type: '杜比全景声',
              AvailableSeats: 98,
              TotalSeats: 200,
              Price: 14000000000,
            },
            {
              Time: '22:45',
              Hall: '3号厅',
              Type: '普通',
              AvailableSeats: 178,
              TotalSeats: 200,
              Price: 9000000000,
            },
          ],
        },
        Services: ['在线选座', '退改签', '艺术片专场', '影迷俱乐部'],
        Promotions: ['艺术片优惠', '老年票半价', '学生证优惠'],
        Photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      },
    ];

    // 模拟用户订单
    const mockBookings = [
      {
        ID: 'booking_001',
        MovieTitle: '量子纪元：时空守护者',
        CinemaName: '万达影城(五角场店)',
        ShowTime: '2024-06-20 20:15',
        Hall: 'VIP厅',
        Seats: ['J8', 'J9'],
        TotalPrice: 24000000000, // 240 QAU
        Status: '已支付',
        BookingTime: '2024-06-18 14:30',
        QRCode: 'QR123456789',
        TicketCode: 'T20240620001',
      },
      {
        ID: 'booking_002',
        MovieTitle: '复仇者联盟：量子战争',
        CinemaName: 'CGV影城(大悦城店)',
        ShowTime: '2024-06-25 18:45',
        Hall: '4DX厅',
        Seats: ['F5', 'F6', 'F7'],
        TotalPrice: 54000000000, // 540 QAU
        Status: '待观影',
        BookingTime: '2024-06-23 16:45',
        QRCode: 'QR987654321',
        TicketCode: 'T20240625002',
      },
    ];

    setMovies(mockMovies);
    setCinemas(mockCinemas);
    setBookings(mockBookings);
    setLoading(false);
  }, []);

  // 猫眼电影风格的功能函数
  const formatAmount = (amount) => {
    return formatCurrency(amount, 'QAU');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  const formatWantToSee = (count) => {
    return formatNumber(count) + '人想看';
  };

  // 猫眼风格的电影筛选和排序
  const filteredAndSortedMovies = movies
    .filter((movie) => {
      const matchesCategory = selectedCategory === 'all' || movie.Genre.includes(selectedCategory);
      const matchesSearch =
        movie.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.EnglishTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.Cast.some((actor) => actor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movie.Director.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'hot':
          return b.BookingCount - a.BookingCount;
        case 'rating':
          return b.Rating - a.Rating;
        case 'newest':
          return new Date(b.ReleaseDate) - new Date(a.ReleaseDate);
        case 'want_to_see':
          return b.WantToSee - a.WantToSee;
        default:
          return 0;
      }
    });

  // 座位选择组件
  const SeatMap = ({ showtime }) => {
    const rows = 15;
    const seatsPerRow = 20;
    const seatMap = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        const isSelected = selectedSeats.includes(seatId);
        const isOccupied = Math.random() < 0.3; // 30%的座位已被占用
        const isVIP = row >= 8 && row <= 11 && seat >= 6 && seat <= 13; // VIP区域

        rowSeats.push({
          id: seatId,
          isSelected,
          isOccupied,
          isVIP,
          row,
          seat,
        });
      }
      seatMap.push(rowSeats);
    }

    return (
      <div className="space-y-4">
        {/* 屏幕 */}
        <div className="text-center mb-8">
          <div className="w-full h-4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full mb-2"></div>
          <p className="text-gray-400 text-sm">屏幕</p>
        </div>

        {/* 座位图 */}
        <div className="space-y-2">
          {seatMap.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center space-x-1">
              <span className="w-6 text-center text-gray-400 text-sm">
                {String.fromCharCode(65 + rowIndex)}
              </span>
              {row.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => !seat.isOccupied && handleSeatSelect(seat.id)}
                  disabled={seat.isOccupied}
                  className={`w-6 h-6 rounded text-xs font-bold transition-all duration-200 ${
                    seat.isOccupied
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : seat.isSelected
                        ? 'bg-cyan-500 text-white scale-110'
                        : seat.isVIP
                          ? 'bg-yellow-600 text-white hover:bg-yellow-500'
                          : 'bg-green-600 text-white hover:bg-green-500'
                  }`}
                  title={seat.id}
                >
                  {seat.seat + 1}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* 座位图例 */}
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-gray-300">可选</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span className="text-gray-300">VIP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-cyan-500 rounded"></div>
            <span className="text-gray-300">已选</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span className="text-gray-300">已售</span>
          </div>
        </div>
      </div>
    );
  };

  // 选择座位
  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  // 预订电影票
  const handleBooking = async () => {
    if (!selectedMovie || !selectedCinema || !selectedShowtime || selectedSeats.length === 0) {
      alert('请完成所有选择');
      return;
    }

    try {
      const totalPrice = selectedShowtime.Price * selectedSeats.length;
      const newBooking = {
        ID: `booking_${Date.now()}`,
        MovieTitle: selectedMovie.Title,
        CinemaName: selectedCinema.Name,
        ShowTime: `2024-06-20 ${selectedShowtime.Time}`,
        Hall: selectedShowtime.Hall,
        Seats: selectedSeats,
        TotalPrice: totalPrice,
        Status: '已支付',
        BookingTime: new Date().toLocaleString(),
        QRCode: `QR${Date.now()}`,
        TicketCode: `T${Date.now()}`,
      };

      setBookings((prev) => [newBooking, ...prev]);
      alert(
        `预订成功！\n电影: ${selectedMovie.Title}\n影院: ${selectedCinema.Name}\n场次: ${selectedShowtime.Time}\n座位: ${selectedSeats.join(', ')}\n总价: ${formatAmount(totalPrice)}`
      );

      // 重置选择
      setSelectedSeats([]);
      setCurrentStep(3); // 跳转到订单页面
    } catch (error) {
      console.error('预订失败:', error);
      alert('预订失败，请重试');
    }
  };

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
        {/* 猫眼风格的Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                量子电影票务
              </h1>
              <p className="text-gray-300 text-lg">使用量子加密技术，安全预订全球影院电影票</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
              >
                <option value="上海">上海</option>
                <option value="北京">北京</option>
                <option value="深圳">深圳</option>
                <option value="广州">广州</option>
              </select>
            </div>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="搜索电影、导演、演员..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
              >
                <option value="all">全部类型</option>
                <option value="科幻">科幻</option>
                <option value="动作">动作</option>
                <option value="冒险">冒险</option>
                <option value="剧情">剧情</option>
                <option value="喜剧">喜剧</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
              >
                <option value="hot">热门</option>
                <option value="rating">评分</option>
                <option value="newest">最新</option>
                <option value="want_to_see">想看</option>
              </select>
            </div>
          </div>
        </div>

        <Tabs
          value={
            currentStep === 0
              ? 'movies'
              : currentStep === 1
                ? 'showtimes'
                : currentStep === 2
                  ? 'seats'
                  : 'orders'
          }
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/10 rounded-lg">
            <TabsTrigger value="movies" onClick={() => setCurrentStep(0)}>
              选择电影
            </TabsTrigger>
            <TabsTrigger value="showtimes" onClick={() => setCurrentStep(1)}>
              选择场次
            </TabsTrigger>
            <TabsTrigger value="seats" onClick={() => setCurrentStep(2)}>
              选择座位
            </TabsTrigger>
            <TabsTrigger value="orders" onClick={() => setCurrentStep(3)}>
              我的订单
            </TabsTrigger>
          </TabsList>

          {/* 选择电影 - 猫眼风格 */}
          <TabsContent value="movies" className="space-y-6">
            {/* 热门推荐横幅 */}
            <Card className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">🔥 本周热映</h2>
                    <p className="text-gray-300">精选本周最受欢迎的电影</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-cyan-400 truncate-number">
                      {movies.filter((m) => m.IsHot).length}
                    </p>
                    <p className="text-gray-300">部热映影片</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 电影列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedMovies.map((movie) => (
                <Card
                  key={movie.ID}
                  className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer ${
                    selectedMovie?.ID === movie.ID ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setCurrentStep(1);
                  }}
                >
                  <div className="relative">
                    <div className="w-full h-64 bg-gray-700 rounded-t-lg flex items-center justify-center">
                      <Film className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {movie.IsHot && <Badge className="bg-red-500/80 text-white">热</Badge>}
                      {movie.IsNew && <Badge className="bg-green-500/80 text-white">新</Badge>}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400 truncate-number">
                        ⭐ {movie.Rating}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-purple-500/20 text-purple-400 truncate-number">
                        {formatWantToSee(movie.WantToSee)}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{movie.Title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {movie.EnglishTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {movie.Genre.map((genre, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">时长</p>
                        <p className="text-white truncate-number">
                          {formatDuration(movie.Duration)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">起价</p>
                        <p className="text-cyan-400 font-bold truncate-number">
                          {formatAmount(movie.Price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">导演</p>
                        <p className="text-white truncate">{movie.Director}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">票房</p>
                        <p className="text-green-400 truncate-number">{movie.BoxOffice}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-2">主演</p>
                      <p className="text-gray-300 text-sm">{movie.Cast.slice(0, 3).join(' / ')}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-2">剧情简介</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{movie.Synopsis}</p>
                    </div>

                    {/* 特殊格式标签 */}
                    <div className="flex flex-wrap gap-1">
                      {movie.Tags.map((tag, index) => (
                        <Badge key={index} className="bg-cyan-500/20 text-cyan-400 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-1" />
                          预告
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-3 h-3 mr-1" />
                          想看
                        </Button>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                        购票
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 选择场次 - 猫眼风格 */}
          <TabsContent value="showtimes" className="space-y-6">
            {selectedMovie ? (
              <div className="space-y-6">
                {/* 电影信息卡片 */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <div className="w-24 h-36 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Film className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {selectedMovie.Title}
                        </h2>
                        <p className="text-gray-300 mb-4">{selectedMovie.EnglishTitle}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">类型</p>
                            <p className="text-white">{selectedMovie.Genre.join(' / ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">时长</p>
                            <p className="text-white">{formatDuration(selectedMovie.Duration)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">评分</p>
                            <p className="text-yellow-400">⭐ {selectedMovie.Rating}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">想看</p>
                            <p className="text-purple-400">
                              {formatWantToSee(selectedMovie.WantToSee)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 影院列表 */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">选择影院和场次</h3>
                  {cinemas
                    .filter((cinema) => cinema.Showtimes[selectedMovie.ID])
                    .map((cinema) => (
                      <Card
                        key={cinema.ID}
                        className="bg-white/10 backdrop-blur-md border-white/20"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white flex items-center space-x-2">
                                <span>{cinema.Name}</span>
                                <Badge className="bg-blue-500/20 text-blue-400">
                                  {cinema.Brand}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-gray-300 flex items-center space-x-4 mt-2">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {cinema.Address}
                                </span>
                                <span className="flex items-center">
                                  <Car className="w-4 h-4 mr-1" />
                                  {cinema.Distance}
                                </span>
                                <span className="flex items-center">
                                  <Train className="w-4 h-4 mr-1" />
                                  {cinema.Metro}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-yellow-500/20 text-yellow-400 mb-2">
                                ⭐ {cinema.Rating}
                              </Badge>
                              <p className="text-sm text-gray-400">{cinema.Price}价位</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* 影院设施 */}
                          <div className="flex flex-wrap gap-2">
                            {cinema.Facilities.map((facility, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {facility}
                              </Badge>
                            ))}
                          </div>

                          {/* 场次时间 */}
                          <div>
                            <h4 className="text-white font-semibold mb-3">今日场次</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {cinema.Showtimes[selectedMovie.ID].map((showtime, index) => (
                                <Card
                                  key={index}
                                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer ${
                                    selectedShowtime?.Time === showtime.Time &&
                                    selectedCinema?.ID === cinema.ID
                                      ? 'ring-2 ring-cyan-400'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    setSelectedCinema(cinema);
                                    setSelectedShowtime(showtime);
                                  }}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <p className="text-lg font-bold text-cyan-400">
                                          {showtime.Time}
                                        </p>
                                        <p className="text-sm text-gray-300">{showtime.Hall}</p>
                                      </div>
                                      <Badge className="bg-purple-500/20 text-purple-400">
                                        {showtime.Type}
                                      </Badge>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">票价</span>
                                        <span className="text-white font-bold">
                                          {formatAmount(showtime.Price)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">余票</span>
                                        <span
                                          className={`truncate-number ${showtime.AvailableSeats < 20 ? 'text-red-400' : 'text-green-400'}`}
                                        >
                                          {formatNumber(showtime.AvailableSeats)}/
                                          {formatNumber(showtime.TotalSeats)}
                                        </span>
                                      </div>
                                    </div>
                                    {showtime.AvailableSeats < 20 && (
                                      <Badge className="bg-red-500/20 text-red-400 mt-2">
                                        余票紧张
                                      </Badge>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* 影院服务 */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex space-x-4 text-sm text-gray-400">
                              {cinema.Parking && (
                                <span className="flex items-center">
                                  <Car className="w-3 h-3 mr-1" />
                                  停车
                                </span>
                              )}
                              {cinema.Restaurant && (
                                <span className="flex items-center">
                                  <Utensils className="w-3 h-3 mr-1" />
                                  餐饮
                                </span>
                              )}
                              {cinema.Shopping && (
                                <span className="flex items-center">
                                  <ShoppingBag className="w-3 h-3 mr-1" />
                                  购物
                                </span>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              <Phone className="w-3 h-3 mr-1" />
                              {cinema.Phone}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* 下一步按钮 */}
                {selectedCinema && selectedShowtime && (
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3"
                    >
                      选择座位
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="text-center py-8">
                  <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">请先选择电影</p>
                  <Button
                    onClick={() => setCurrentStep(0)}
                    className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500"
                  >
                    选择电影
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 选择座位 - 猫眼风格 */}
          <TabsContent value="seats" className="space-y-6">
            {selectedMovie && selectedCinema && selectedShowtime ? (
              <div className="space-y-6">
                {/* 场次信息 */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2">选择座位</h2>
                        <p className="text-gray-300">
                          {selectedMovie.Title} - {selectedCinema.Name} - {selectedShowtime.Time} (
                          {selectedShowtime.Hall})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400 truncate-number">
                          {formatAmount(selectedShowtime.Price)}
                        </p>
                        <p className="text-gray-400">单价</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 座位图 */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <SeatMap showtime={selectedShowtime} />
                  </CardContent>
                </Card>

                {/* 已选座位和总价 */}
                {selectedSeats.length > 0 && (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2">已选座位</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedSeats.map((seat) => (
                              <Badge key={seat} className="bg-cyan-500/20 text-cyan-400">
                                {seat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-400 truncate-number">
                            {formatAmount(selectedShowtime.Price * selectedSeats.length)}
                          </p>
                          <p className="text-gray-400 truncate-number">
                            {selectedSeats.length}张票
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={handleBooking}
                          className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 px-8 py-3"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          确认购买
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="text-center py-8">
                  <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">请先选择电影和场次</p>
                  <Button
                    onClick={() => setCurrentStep(1)}
                    className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500"
                  >
                    选择场次
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 我的订单 - 猫眼风格 */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">我的电影票</CardTitle>
                <CardDescription className="text-gray-300">
                  查看您的购票记录和电子票
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
                                {booking.MovieTitle}
                              </h3>
                              <p className="text-gray-400">{booking.CinemaName}</p>
                            </div>
                            <Badge
                              className={`${
                                booking.Status === '已支付'
                                  ? 'bg-green-500/20 text-green-400'
                                  : booking.Status === '待观影'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {booking.Status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-400">观影时间</p>
                              <p className="text-white">{booking.ShowTime}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">影厅</p>
                              <p className="text-white">{booking.Hall}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">座位</p>
                              <p className="text-cyan-400">{booking.Seats.join(', ')}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">总价</p>
                              <p className="text-green-400 font-bold truncate-number">
                                {formatAmount(booking.TotalPrice)}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <div className="text-sm text-gray-400">
                              <p>订单号: {booking.TicketCode}</p>
                              <p>下单时间: {booking.BookingTime}</p>
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
                              {booking.Status === '待观影' && (
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
                    <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">还没有购票记录</h3>
                    <p className="text-gray-300 mb-6">快去选择心仪的电影吧</p>
                    <Button
                      onClick={() => setCurrentStep(0)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    >
                      <Film className="w-4 h-4 mr-2" />
                      选择电影
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 量子安全面板 */}
        <div className="mt-8">
          <QuantumSecurityPanel />
        </div>
      </div>
    </div>
  );
};

export default MovieBookingApp;

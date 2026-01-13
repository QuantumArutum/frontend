
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
  Music,
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
  Mic,
  Guitar,
  Headphones,
  Volume2,
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
  Music2,
  Headset,
  Radio,
  Tv,
  Monitor as ScreenIcon,
  Projector,
  Camera as CameraIcon,
  Video,
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
  CurrencyIcx as IcxIcon
} from 'lucide-react';

const TicketBookingApp = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('全国');
  const [sortBy, setSortBy] = useState('hot');
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // 0: events, 1: event_detail, 2: booking, 3: orders

  // 大麦网对标的数据结构
  useEffect(() => {
    const mockEvents = [
      {
        ID: "event_001",
        Title: "Taylor Swift | The Eras Tour - 北京站",
        Artist: "Taylor Swift",
        Category: "concert",
        Genre: ["Pop", "Country"],
        Date: "2024-07-15",
        Time: "20:00",
        Duration: 180,
        Description: "泰勒·斯威夫特时代巡回演唱会，横跨她整个音乐生涯的经典曲目。这将是一场史诗般的音乐之旅，重温每一个时代的经典歌曲。北京站特别呈现，不容错过！",
        Image: "/api/placeholder/400/300",
        VenueID: "venue_001",
        VenueName: "鸟巢国家体育场",
        VenueLocation: "北京市朝阳区",
        City: "北京",
        Rating: 9.8,
        Status: "on_sale",
        TicketTypes: [
          { ID: "vip", Name: "VIP包厢", Price: 200000000000, Available: 50, Total: 100, Description: "最佳视野，尊享服务" },
          { ID: "premium", Name: "内场前排", Price: 150000000000, Available: 1200, Total: 2000, Description: "近距离感受偶像魅力" },
          { ID: "standard", Name: "看台A区", Price: 80000000000, Available: 3500, Total: 5000, Description: "性价比之选" },
          { ID: "lawn", Name: "看台B区", Price: 50000000000, Available: 8000, Total: 10000, Description: "经济实惠" }
        ],
        BookingCount: 45230,
        WantToSee: 189000,
        AgeRestriction: "全年龄",
        Language: "英语",
        Subtitles: ["中文字幕"],
        Tags: ["热门", "国际巨星", "流行金曲"],
        Promotions: ["早鸟票9折", "学生票8折"],
        SeatMap: "/api/placeholder/800/600", // 模拟座位图URL
        Highlights: ["全球巡演北京站", "经典歌曲串烧", "震撼舞台效果"],
        Notice: ["实名制购票", "每人限购2张", "演出前3天停止退票"]
      },
      {
        ID: "event_002",
        Title: "周杰伦 | 嘉年华世界巡回演唱会 - 上海站",
        Artist: "周杰伦",
        Category: "concert",
        Genre: ["华语流行", "R&B"],
        Date: "2024-08-20",
        Time: "19:30",
        Duration: 150,
        Description: "周杰伦嘉年华世界巡回演唱会，带来全新舞台设计和经典歌曲演绎。现场将有特别嘉宾和惊喜环节。上海站独家呈现，与你共赴音乐盛宴。",
        Image: "/api/placeholder/400/300",
        VenueID: "venue_002",
        VenueName: "上海体育场",
        VenueLocation: "上海市徐汇区",
        City: "上海",
        Rating: 9.6,
        Status: "on_sale",
        TicketTypes: [
          { ID: "vip", Name: "VIP包厢", Price: 180000000000, Available: 80, Total: 120, Description: "尊贵体验，私密空间" },
          { ID: "premium", Name: "内场摇滚区", Price: 120000000000, Available: 1800, Total: 3000, Description: "与偶像零距离互动" },
          { ID: "standard", Name: "看台1层", Price: 60000000000, Available: 4200, Total: 6000, Description: "视野开阔" },
          { ID: "lawn", Name: "看台2层", Price: 35000000000, Available: 7500, Total: 8000, Description: "超值选择" }
        ],
        BookingCount: 38750,
        WantToSee: 250000,
        AgeRestriction: "全年龄",
        Language: "中文",
        Subtitles: [],
        Tags: ["热门", "华语天王", "经典重现"],
        Promotions: ["情侣套票优惠", "团购85折"],
        SeatMap: "/api/placeholder/800/600",
        Highlights: ["全新舞台设计", "经典歌曲联唱", "神秘嘉宾助阵"],
        Notice: ["实名制购票", "每人限购4张", "演出前7天停止退票"]
      },
      {
        ID: "event_003",
        Title: "开心麻花 | 《乌龙山伯爵》经典版 - 深圳站",
        Artist: "开心麻花",
        Category: "theater",
        Genre: ["喜剧", "话剧"],
        Date: "2024-09-10",
        Time: "19:30",
        Duration: 120,
        Description: "开心麻花经典爆笑舞台剧《乌龙山伯爵》，千万观众口碑认证。深圳站特别加场，让你笑出腹肌！",
        Image: "/api/placeholder/400/300",
        VenueID: "venue_003",
        VenueName: "深圳保利剧院",
        VenueLocation: "深圳市南山区",
        City: "深圳",
        Rating: 9.4,
        Status: "on_sale",
        TicketTypes: [
          { ID: "vip", Name: "VIP座", Price: 88000000000, Available: 100, Total: 150, Description: "最佳观演位置" },
          { ID: "premium", Name: "甲等座", Price: 68000000000, Available: 300, Total: 400, Description: "视野良好" },
          { ID: "standard", Name: "乙等座", Price: 48000000000, Available: 500, Total: 600, Description: "经济实惠" },
          { ID: "student", Name: "学生票", Price: 28000000000, Available: 100, Total: 100, Description: "凭学生证购买" }
        ],
        BookingCount: 15670,
        WantToSee: 85000,
        AgeRestriction: "6岁以上",
        Language: "中文",
        Subtitles: [],
        Tags: ["热门", "爆笑喜剧", "经典话剧"],
        Promotions: ["家庭套票9折", "会员专享88折"],
        SeatMap: "/api/placeholder/800/600",
        Highlights: ["经典剧目重演", "原班人马打造", "笑点密集"],
        Notice: ["实名制购票", "儿童需凭票入场", "演出前1天停止退票"]
      },
      {
        ID: "event_004",
        Title: "草莓音乐节 - 广州站",
        Artist: "多组艺人",
        Category: "festival",
        Genre: ["摇滚", "民谣", "电子"],
        Date: "2024-10-01",
        Time: "14:00 - 22:00",
        Duration: 480, // 8 hours
        Description: "一年一度的草莓音乐节空降广州！集结国内外顶尖乐队和音乐人，打造最燃的音乐现场。",
        Image: "/api/placeholder/400/300",
        VenueID: "venue_004",
        VenueName: "广州长隆度假区音乐节广场",
        VenueLocation: "广州市番禺区",
        City: "广州",
        Rating: 9.5,
        Status: "upcoming",
        TicketTypes: [
          { ID: "early_bird", Name: "早鸟票", Price: 38000000000, Available: 2000, Total: 2000, Description: "限量发售" },
          { ID: "single_day", Name: "单日票", Price: 48000000000, Available: 10000, Total: 10000, Description: "畅玩一天" },
          { ID: "two_day_pass", Name: "两日通票", Price: 88000000000, Available: 5000, Total: 5000, Description: "两日狂欢" },
          { ID: "vip_pass", Name: "VIP通票", Price: 128000000000, Available: 500, Total: 500, Description: "专属区域，快速通道" }
        ],
        BookingCount: 8900,
        WantToSee: 120000,
        AgeRestriction: "12岁以上",
        Language: "多语言",
        Subtitles: [],
        Tags: ["音乐节", "户外", "摇滚盛宴"],
        Promotions: ["学生团体票优惠"],
        SeatMap: null, // 音乐节通常无固定座位
        Highlights: ["超强阵容", "三大舞台", "美食市集", "创意互动"],
        Notice: ["凭身份证入场", "禁止携带违禁品", "注意防晒补水"]
      }
    ];

    const mockVenues = [
      {
        ID: "venue_001",
        Name: "鸟巢国家体育场",
        Location: "北京市朝阳区",
        Address: "国家体育场南路1号",
        Capacity: 80000,
        Type: "stadium",
        Facilities: ["停车场", "餐饮", "无障碍通道", "VIP休息室"],
        Rating: 4.8,
        Description: "2008年北京奥运会主体育场，现代化大型体育场馆。",
        Traffic: "地铁8号线奥体中心站A口出，步行约500米。公交：82路、419路、538路、645路等到国家体育场东站。",
        Nearby: ["奥林匹克公园", "水立方", "国家会议中心"]
      },
      {
        ID: "venue_002",
        Name: "上海体育场",
        Location: "上海市徐汇区",
        Address: "天钥桥路666号",
        Capacity: 56000,
        Type: "stadium",
        Facilities: ["地铁直达", "停车场", "餐饮", "商店"],
        Rating: 4.7,
        Description: "上海标志性体育场馆，交通便利，设施完善。",
        Traffic: "地铁4号线上海体育场站3号口出。公交：42路、49路、122路、754路、926路等到上海体育场站。",
        Nearby: ["徐家汇商圈", "上海游泳馆", "八万人体育场"]
      },
      {
        ID: "venue_003",
        Name: "深圳保利剧院",
        Location: "深圳市南山区",
        Address: "后海滨路与文心五路交界处",
        Capacity: 1500,
        Type: "theater",
        Facilities: ["地下停车场", "咖啡厅", "贵宾休息室"],
        Rating: 4.9,
        Description: "深圳顶级的现代化剧院，音响效果一流。",
        Traffic: "地铁2号线/11号线后海站E2出口。公交：B737路、M429路、M474路等到保利剧院站。",
        Nearby: ["海岸城购物中心", "深圳湾公园", "人才公园"]
      },
      {
        ID: "venue_004",
        Name: "广州长隆度假区音乐节广场",
        Location: "广州市番禺区",
        Address: "长隆旅游度假区内",
        Capacity: 30000, // 户外场地
        Type: "outdoor",
        Facilities: ["临时停车场", "餐饮区", "医疗救助点", "卫生间"],
        Rating: 4.6,
        Description: "位于长隆度假区内的大型户外活动场地，适合举办音乐节等大型活动。",
        Traffic: "地铁3号线汉溪长隆站E口出，转乘度假区免费穿梭巴士。自驾：导航至长隆欢乐世界停车场。",
        Nearby: ["长隆欢乐世界", "长隆水上乐园", "长隆野生动物世界"]
      }
    ];

    // 模拟用户订单
    const mockBookings = [
      {
        ID: "booking_001",
        EventTitle: "Taylor Swift | The Eras Tour - 北京站",
        VenueName: "鸟巢国家体育场",
        ShowTime: "2024-07-15 20:00",
        TicketType: "内场前排",
        Quantity: 2,
        Seats: ["A区5排10座", "A区5排11座"], // 模拟座位信息
        TotalPrice: 300000000000, // 3000 QAU
        Status: "已支付",
        BookingTime: "2024-06-18 14:30",
        QRCode: "QR123456789",
        TicketCode: "T20240715001"
      },
      {
        ID: "booking_002",
        EventTitle: "周杰伦 | 嘉年华世界巡回演唱会 - 上海站",
        VenueName: "上海体育场",
        ShowTime: "2024-08-20 19:30",
        TicketType: "看台1层",
        Quantity: 1,
        Seats: ["102区15排8座"],
        TotalPrice: 60000000000, // 600 QAU
        Status: "待观演",
        BookingTime: "2024-07-23 16:45",
        QRCode: "QR987654321",
        TicketCode: "T20240820002"
      }
    ];

    setEvents(mockEvents);
    setVenues(mockVenues);
    setBookings(mockBookings);
    setLoading(false);
  }, []);

  // 大麦网风格的功能函数
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

  // 大麦网风格的演出筛选和排序
  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.Category === selectedCategory;
      const matchesCity = selectedCity === '全国' || event.City === selectedCity;
      const matchesSearch = event.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.Artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.VenueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.Genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesCity && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'hot':
          return b.BookingCount - a.BookingCount;
        case 'rating':
          return b.Rating - a.Rating;
        case 'newest':
          return new Date(b.Date) - new Date(a.Date);
        case 'want_to_see':
          return b.WantToSee - a.WantToSee;
        default:
          return 0;
      }
    });

  // 获取分类图标
  const getCategoryIcon = (category) => {
    const iconMap = {
      'concert': Music,
      'festival': Headphones,
      'theater': Mic,
      'sports': Users,
      'exhibition': Eye,
      'parent_child': Users, // Using Users for parent-child for now
      'classical': Guitar
    };
    return iconMap[category] || Music;
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colorMap = {
      'on_sale': 'text-green-400',
      'sold_out': 'text-red-400',
      'cancelled': 'text-gray-400',
      'upcoming': 'text-yellow-400'
    };
    return colorMap[status] || 'text-gray-400';
  };

  // 预订门票
  const handleBooking = async () => {
    if (!selectedEvent || !selectedTicketType || ticketQuantity <= 0) {
      alert('请完成所有选择并确保票数大于0');
      return;
    }

    try {
      const totalPrice = selectedTicketType.Price * ticketQuantity;
      const newBooking = {
        ID: `booking_${Date.now()}`,
        EventTitle: selectedEvent.Title,
        VenueName: selectedEvent.VenueName,
        ShowTime: `${selectedEvent.Date} ${selectedEvent.Time}`,
        TicketType: selectedTicketType.Name,
        Quantity: ticketQuantity,
        Seats: Array.from({ length: ticketQuantity }, (_, i) => `模拟座位${i + 1}`), // 简化座位信息
        TotalPrice: totalPrice,
        Status: "已支付",
        BookingTime: new Date().toLocaleString(),
        QRCode: `QR${Date.now()}`,
        TicketCode: `T${Date.now()}`
      };

      setBookings(prev => [newBooking, ...prev]);
      alert(`预订成功！\n演出: ${selectedEvent.Title}\n票种: ${selectedTicketType.Name}\n数量: ${ticketQuantity}张\n总价: ${formatAmount(totalPrice)}`);
      
      // 重置选择
      setSelectedTicketType(null);
      setTicketQuantity(1);
      setCurrentStep(3); // 跳转到订单页面
    } catch (error) {
      console.error('预订失败:', error);
      alert('预订失败，请重试');
    }
  };

  // 渲染主页内容
  const renderEventsPage = () => (
    <div className="space-y-6">
      {/* 热门推荐横幅 */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">🔥 热门演出</h2>
              <p className="text-gray-300">精选本周最受欢迎的演出活动</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">{events.filter(e => e.Tags.includes('热门')).length}</p>
              <p className="text-gray-300">场热门演出</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 演出列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedEvents.map((event) => {
          const CategoryIcon = getCategoryIcon(event.Category);
          return (
            <Card 
              key={event.ID} 
              className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer`}
              onClick={() => {
                setSelectedEvent(event);
                setSelectedVenue(venues.find(v => v.ID === event.VenueID));
                setCurrentStep(1);
              }}
            >
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-t-lg flex items-center justify-center">
                  <CategoryIcon className="w-16 h-16 text-white/80" />
                </div>
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {event.Tags.includes("热门") && <Badge className="bg-red-500/80 text-white">热门</Badge>}
                  {event.Status === "upcoming" && <Badge className="bg-yellow-500/80 text-white">预售</Badge>}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 truncate-number">
                    ⭐ {event.Rating}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-purple-500/20 text-purple-400 truncate-number">
                    {formatWantToSee(event.WantToSee)}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-white text-lg truncate">{event.Title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {event.Artist}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{event.Date} {event.Time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.VenueName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-cyan-400 truncate-number">
                    {formatAmount(Math.min(...event.TicketTypes.map(t => t.Price)))}
                    <span className="text-sm text-gray-300"> 起</span>
                  </span>
                  <Badge className={`${getStatusColor(event.Status)} capitalize`}>
                    {event.Status === 'on_sale' ? '售票中' :
                     event.Status === 'sold_out' ? '已售罄' :
                     event.Status === 'upcoming' ? '即将开售' : '已结束'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // 渲染演出详情页
  const renderEventDetailPage = () => {
    if (!selectedEvent || !selectedVenue) return null;
    const CategoryIcon = getCategoryIcon(selectedEvent.Category);

    return (
      <div className="space-y-6">
        {/* 演出信息头部 */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <CategoryIcon className="w-24 h-24 text-white/80" />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold text-white">{selectedEvent.Title}</h2>
                <p className="text-gray-300 text-lg">{selectedEvent.Artist}</p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-lg px-3 py-1 truncate-number">
                    ⭐ {selectedEvent.Rating}
                  </Badge>
                  <span className="text-purple-400 text-lg truncate-number">{formatWantToSee(selectedEvent.WantToSee)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">时间</p>
                    <p className="text-white">{selectedEvent.Date} {selectedEvent.Time}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">地点</p>
                    <p className="text-white">{selectedVenue.Name} ({selectedVenue.Location})</p>
                  </div>
                  <div>
                    <p className="text-gray-400">票价</p>
                    <p className="text-cyan-400 font-bold truncate-number">
                      {formatAmount(Math.min(...selectedEvent.TicketTypes.map(t => t.Price)))} 起
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">状态</p>
                    <p className={`${getStatusColor(selectedEvent.Status)} capitalize`}>
                      {selectedEvent.Status === 'on_sale' ? '售票中' :
                       selectedEvent.Status === 'sold_out' ? '已售罄' :
                       selectedEvent.Status === 'upcoming' ? '即将开售' : '已结束'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4 border-t border-white/10">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 flex-1">
                    <Ticket className="w-5 h-5 mr-2" />
                    立即购票
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    想看
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share className="w-5 h-5 mr-2" />
                    分享
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 演出详情、场馆信息、购票须知 Tabs */}
        <Tabs defaultValue="details" className="bg-white/10 backdrop-blur-md border-white/20 rounded-lg p-1">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-md">
            <TabsTrigger value="details">演出详情</TabsTrigger>
            <TabsTrigger value="venue">场馆信息</TabsTrigger>
            <TabsTrigger value="notice">购票须知</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">演出介绍</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{selectedEvent.Description}</p>
            <h3 className="text-xl font-bold text-white mt-6">亮点推荐</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {selectedEvent.Highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
            {/* 可以添加更多如演员阵容、媒体评价等 */} 
          </TabsContent>
          <TabsContent value="venue" className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">{selectedVenue.Name}</h3>
            <p className="text-gray-300"><LocationIcon className="w-4 h-4 inline mr-1" /> {selectedVenue.Address}</p>
            <p className="text-gray-300">容量: <span className="truncate-number">{formatNumber(selectedVenue.Capacity)}人</span></p>
            <h4 className="text-lg font-semibold text-white mt-4">场馆设施</h4>
            <div className="flex flex-wrap gap-2">
              {selectedVenue.Facilities.map((facility, index) => (
                <Badge key={index} variant="secondary">{facility}</Badge>
              ))}
            </div>
            <h4 className="text-lg font-semibold text-white mt-4">交通指南</h4>
            <p className="text-gray-300 whitespace-pre-line">{selectedVenue.Traffic}</p>
            <h4 className="text-lg font-semibold text-white mt-4">周边推荐</h4>
            <p className="text-gray-300">{selectedVenue.Nearby.join("、")}</p>
            {/* 可以添加场馆图片、座位图预览等 */}
          </TabsContent>
          <TabsContent value="notice" className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">购票须知</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {selectedEvent.Notice.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
              <li>{selectedEvent.AgeRestriction}</li>
              <li>演出时长：{formatDuration(selectedEvent.Duration)}（以现场为准）</li>
              <li>禁止携带食品、饮料、专业摄影摄像器材等入场。</li>
              <li>一人一票，凭票入场，对号入座。</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // 渲染购票页面
  const renderBookingPage = () => {
    if (!selectedEvent) return null;

    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">选择票档和数量</CardTitle>
            <CardDescription className="text-gray-300">
              {selectedEvent.Title} - {selectedEvent.Date} {selectedEvent.Time}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedEvent.TicketTypes.map((ticketType) => (
              <Card 
                key={ticketType.ID}
                className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer ${
                  selectedTicketType?.ID === ticketType.ID ? 'ring-2 ring-cyan-400' : ''
                }`}
                onClick={() => setSelectedTicketType(ticketType)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{ticketType.Name}</h4>
                    <p className="text-sm text-gray-300">{ticketType.Description}</p>
                    <p className="text-xs text-gray-400">
                      余票: <span className="truncate-number">{formatNumber(ticketType.Available)}</span> / <span className="truncate-number">{formatNumber(ticketType.Total)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-cyan-400 truncate-number">{formatAmount(ticketType.Price)}</p>
                    {ticketType.Available === 0 && <Badge className="bg-red-500/20 text-red-400 mt-1">已售罄</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}

            {selectedTicketType && (
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white">选择数量 (余票: <span className="truncate-number">{formatNumber(selectedTicketType.Available)}</span>)</label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input 
                      type="number"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedTicketType.Available)))}
                      className="w-16 text-center bg-white/10 border-white/20 text-white"
                      max={selectedTicketType.Available}
                      min={1}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setTicketQuantity(Math.min(selectedTicketType.Available, ticketQuantity + 1))}
                      disabled={ticketQuantity >= selectedTicketType.Available}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">总价:</span>
                  <span className="text-2xl font-bold text-green-400 truncate-number">
                    {formatAmount(selectedTicketType.Price * ticketQuantity)}
                  </span>
                </div>
                <Button 
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 py-3"
                  disabled={selectedTicketType.Available === 0 || ticketQuantity > selectedTicketType.Available}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  立即支付
                </Button>
              </div>
            )}
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
          <CardTitle className="text-white">我的票夹</CardTitle>
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
                        <h3 className="text-lg font-semibold text-white mb-1">{booking.EventTitle}</h3>
                        <p className="text-gray-400">{booking.VenueName}</p>
                      </div>
                      <Badge className={`${
                        booking.Status === '已支付' ? 'bg-green-500/20 text-green-400' :
                        booking.Status === '待观演' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {booking.Status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">演出时间</p>
                        <p className="text-white">{booking.ShowTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">票档</p>
                        <p className="text-white">{booking.TicketType}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">数量</p>
                        <p className="text-cyan-400 truncate-number">{booking.Quantity}张</p>
                      </div>
                      <div>
                        <p className="text-gray-400">总价</p>
                        <p className="text-green-400 font-bold truncate-number">{formatAmount(booking.TotalPrice)}</p>
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
                        {booking.Status === '待观演' && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            转赠
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
              <p className="text-gray-300 mb-6">快去发现精彩演出吧</p>
              <Button 
                onClick={() => setCurrentStep(0)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Music className="w-4 h-4 mr-2" />
                发现演出
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
        {/* 大麦网风格的Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                量子票务中心
              </h1>
              <p className="text-gray-300 text-lg">安全预订全球演唱会、体育赛事、戏剧展览门票</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
              >
                <option value="全国">全国</option>
                <option value="北京">北京</option>
                <option value="上海">上海</option>
                <option value="广州">广州</option>
                <option value="深圳">深圳</option>
              </select>
            </div>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="搜索演出、艺人、场馆..."
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
                <option value="all">全部分类</option>
                <option value="concert">演唱会</option>
                <option value="festival">音乐节</option>
                <option value="theater">戏剧</option>
                <option value="sports">体育</option>
                <option value="exhibition">展览</option>
                <option value="parent_child">亲子</option>
                <option value="classical">音乐会</option>
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
              >
                <option value="hot">热门推荐</option>
                <option value="rating">评分最高</option>
                <option value="newest">最新开票</option>
                <option value="want_to_see">想看榜</option>
              </select>
            </div>
          </div>
        </div>

        <Tabs 
          value={currentStep === 0 ? "events" : currentStep === 1 ? "event_detail" : currentStep === 2 ? "booking" : "orders"} 
          className="space-y-6"
          onValueChange={(value) => {
            if (value === "events") setCurrentStep(0);
            // else if (value === "event_detail") setCurrentStep(1); // Detail is part of flow, not direct tab
            // else if (value === "booking") setCurrentStep(2); // Booking is part of flow
            else if (value === "orders") setCurrentStep(3);
          }}
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/10 rounded-lg">
            <TabsTrigger value="events" onClick={() => setCurrentStep(0)}>发现演出</TabsTrigger>
            <TabsTrigger value="event_detail" disabled={currentStep < 1}>演出详情</TabsTrigger>
            <TabsTrigger value="booking" disabled={currentStep < 2}>确认订单</TabsTrigger>
            <TabsTrigger value="orders" onClick={() => setCurrentStep(3)}>我的票夹</TabsTrigger>
          </TabsList>

          {currentStep === 0 && <TabsContent value="events">{renderEventsPage()}</TabsContent>}
          {currentStep === 1 && <TabsContent value="event_detail">{renderEventDetailPage()}</TabsContent>}
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

export default TicketBookingApp;



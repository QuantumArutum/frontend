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
  Building,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Bed,
  CreditCard,
  Search,
  Filter,
  Wifi,
  Coffee,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Shield,
  Heart,
  Share,
  Camera,
  Bath,
  AirVent,
  Tv,
  CalendarDays,
  User,
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
  Video,
  Music,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Speaker,
  Radio,
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
  Cruzeiro as CruzeiroIcon,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ChevronsRight,
  ChevronsLeft,
  ChevronsUp,
  ChevronsDown,
  MoreHorizontal,
  MoreVertical,
  Menu,
  X,
  Home,
  Briefcase,
  ShoppingCart,
  Gift,
  Package,
  Truck,
  Plane,
  Train,
  Bus,
  Bike,
  Footprints,
  TreePine,
  Mountain,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Snowflake,
  Flame,
  Zap as Lightning,
  Rainbow,
  Umbrella,
  UmbrellaBeach,
  Tent,
  Compass as CompassIcon,
  Map,
  MapPin as MapPinIcon,
  Navigation as NavigationIcon,
  Route as RouteIcon,
  Milestone,
  Signpost,
  Crosshair,
  Target,
  Focus,
  Scan,
  ScanLine,
  QrCode as QrCodeIcon,
  Barcode,
  Hash as HashIcon,
  AtSign as AtSignIcon,
  Percent as PercentIcon,
  Dollar as DollarIcon,
  Euro as EuroIcon,
  Pound as PoundIcon,
  Yen as YenIcon,
  Ruble as RubleIcon,
  Rupee as RupeeIcon,
  Won as WonIcon,
  Franc as FrancIcon2,
  Lira as LiraIcon2,
  Peso as PesoIcon3,
  Real as RealIcon2,
  Rand as RandIcon,
  Shekel as ShekelIcon,
  Dinar as DinarIcon,
  Dirham as DirhamIcon,
  Riyal as RiyalIcon,
  Taka as TakaIcon,
  Kyat as KyatIcon,
  Kip as KipIcon,
  Dong as DongIcon,
  Tugrik as TugrikIcon,
  Som as SomIcon,
  Manat as ManatIcon,
  Lari as LariIcon,
  Dram as DramIcon,
  Lek as LekIcon,
  Denar as DenarIcon,
  Kuna as KunaIcon,
  Forint as ForintIcon,
  Zloty as ZlotyIcon,
  Koruna as KorunaIcon,
  Krona as KronaIcon,
  Krone as KroneIcon,
  Leu as LeuIcon,
  Lev as LevIcon,
  Lat as LatIcon,
  Litas as LitasIcon,
  Tolar as TolarIcon,
  Marka as MarkaIcon
} from 'lucide-react';

const HotelBookingApp = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchParams, setSearchParams] = useState({
    destination: '上海',
    checkIn: '2024-07-20',
    checkOut: '2024-07-22',
    guests: 2,
    rooms: 1
  });
  const [currentStep, setCurrentStep] = useState(0); // 0: search, 1: select, 2: booking, 3: orders
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000000000]); // 0-5000 QAU
  const [loading, setLoading] = useState(true);

  // 携程风格的酒店数据结构
  useEffect(() => {
    const mockHotels = [
      {
        ID: "hotel_001",
        Name: "上海外滩量子豪华酒店",
        EnglishName: "Shanghai Bund Quantum Luxury Hotel",
        Category: "luxury",
        StarRating: 5,
        Location: "上海市黄浦区",
        Address: "中山东一路500号",
        Coordinates: { lat: 31.2304, lng: 121.4737 },
        Description: "位于上海外滩核心地段的顶级豪华酒店，拥有绝佳的黄浦江和陆家嘴天际线景观。酒店融合经典海派风情与现代奢华设计，为宾客提供无与伦比的住宿体验。",
        Images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
        Amenities: ["免费WiFi", "健身房", "室内游泳池", "SPA水疗", "商务中心", "代客泊车", "中西餐厅", "行政酒廊", "礼宾服务", "24小时客房服务"],
        Rating: 4.8,
        ReviewCount: 2847,
        PriceRange: {
          Min: 120000000000, // 1,200 QAU
          Max: 500000000000 // 5,000 QAU
        },
        Distance: "距离外滩步行街50米",
        Landmark: "外滩",
        CheckInTime: "15:00",
        CheckOutTime: "12:00",
        Rooms: [
          {
            ID: "room_001",
            Type: "豪华江景房",
            Size: "45㎡",
            MaxGuests: 2,
            BedType: "特大床",
            Price: 120000000000, // 1,200 QAU
            OriginalPrice: 150000000000, // 原价1,500 QAU
            Available: 15,
            Amenities: ["免费WiFi", "中央空调", "55寸智能电视", "迷你吧", "保险箱", "黄浦江景观", "大理石浴室", "雨淋花洒"],
            Description: "宽敞的豪华江景房，落地窗设计，可欣赏壮丽的黄浦江景色和对岸陆家嘴金融区全景。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "含双人早餐",
            Cancellation: "免费取消至入住前1天18:00",
            Tags: ["热门", "江景", "含早餐"]
          },
          {
            ID: "room_002", 
            Type: "行政套房",
            Size: "85㎡",
            MaxGuests: 4,
            BedType: "特大床+沙发床",
            Price: 280000000000, // 2,800 QAU
            OriginalPrice: 320000000000, // 原价3,200 QAU
            Available: 8,
            Amenities: ["免费WiFi", "中央空调", "65寸智能电视", "迷你吧", "保险箱", "黄浦江景观", "大理石浴室", "雨淋花洒", "独立客厅", "行政酒廊权益"],
            Description: "奢华的行政套房，独立客厅和卧室设计，享有行政酒廊特权，包含免费早餐和下午茶。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "含双人早餐+行政酒廊权益",
            Cancellation: "免费取消至入住前1天18:00",
            Tags: ["推荐", "套房", "行政酒廊"]
          },
          {
            ID: "room_003",
            Type: "总统套房",
            Size: "180㎡",
            MaxGuests: 6,
            BedType: "特大床+双床房",
            Price: 500000000000, // 5,000 QAU
            OriginalPrice: 600000000000, // 原价6,000 QAU
            Available: 2,
            Amenities: ["免费WiFi", "中央空调", "75寸智能电视", "迷你吧", "保险箱", "黄浦江景观", "大理石浴室", "雨淋花洒", "独立客厅", "行政酒廊权益", "私人阳台", "厨房", "餐厅"],
            Description: "顶级总统套房，拥有私人阳台和全套厨房设施，270度黄浦江景观，专属管家服务。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "含四人早餐+行政酒廊权益+管家服务",
            Cancellation: "免费取消至入住前3天18:00",
            Tags: ["奢华", "总统套房", "管家服务"]
          }
        ],
        Policies: {
          CheckIn: "15:00后",
          CheckOut: "12:00前",
          Cancellation: "根据房型不同，取消政策有所差异",
          PetPolicy: "不允许携带宠物",
          SmokingPolicy: "全面禁烟酒店",
          ChildPolicy: "12岁以下儿童与成人同床免费",
          ExtraBed: "可加床，费用另计"
        },
        Services: ["机场接送", "洗衣服务", "旅游咨询", "票务服务", "外币兑换", "医疗服务"],
        NearbyAttractions: ["外滩", "南京路步行街", "豫园", "新天地", "人民广场"],
        Transportation: "地铁2号线南京东路站步行5分钟",
        Tags: ["热门", "豪华", "江景", "地标建筑"],
        Promotions: ["早鸟优惠9折", "连住3晚送1晚", "会员专享升房"]
      },
      {
        ID: "hotel_002",
        Name: "东京新宿量子商务酒店",
        EnglishName: "Tokyo Shinjuku Quantum Business Hotel",
        Category: "business",
        StarRating: 4,
        Location: "东京都新宿区",
        Address: "新宿3-38-1",
        Coordinates: { lat: 35.6895, lng: 139.7006 },
        Description: "位于东京新宿商业区中心的现代商务酒店，交通便利，设施完善。酒店专为商务旅客设计，提供高效便捷的服务和舒适的住宿环境。",
        Images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
        Amenities: ["免费WiFi", "健身房", "商务中心", "会议室", "中西餐厅", "便利店", "自助洗衣", "行李寄存"],
        Rating: 4.5,
        ReviewCount: 1923,
        PriceRange: {
          Min: 45000000000, // 450 QAU
          Max: 150000000000 // 1,500 QAU
        },
        Distance: "距离新宿站步行3分钟",
        Landmark: "新宿",
        CheckInTime: "14:00",
        CheckOutTime: "11:00",
        Rooms: [
          {
            ID: "room_004",
            Type: "标准单人间",
            Size: "18㎡",
            MaxGuests: 1,
            BedType: "单人床",
            Price: 45000000000, // 450 QAU
            OriginalPrice: 55000000000, // 原价550 QAU
            Available: 20,
            Amenities: ["免费WiFi", "空调", "32寸电视", "办公桌", "保险箱", "冰箱", "电热水壶"],
            Description: "紧凑而功能齐全的单人间，专为商务旅客设计，配备高效办公设施。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "可选早餐套餐",
            Cancellation: "免费取消至入住前1天18:00",
            Tags: ["商务", "经济实惠"]
          },
          {
            ID: "room_005",
            Type: "标准双人间",
            Size: "25㎡",
            MaxGuests: 2,
            BedType: "双床",
            Price: 75000000000, // 750 QAU
            OriginalPrice: 90000000000, // 原价900 QAU
            Available: 12,
            Amenities: ["免费WiFi", "空调", "40寸电视", "办公桌", "保险箱", "冰箱", "电热水壶", "双床"],
            Description: "舒适的双人间，适合商务伙伴或朋友出行，配备两张单人床。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "可选早餐套餐",
            Cancellation: "免费取消至入住前1天18:00",
            Tags: ["双床", "商务"]
          },
          {
            ID: "room_006",
            Type: "行政套房",
            Size: "50㎡",
            MaxGuests: 3,
            BedType: "特大床+沙发床",
            Price: 150000000000, // 1,500 QAU
            OriginalPrice: 180000000000, // 原价1,800 QAU
            Available: 5,
            Amenities: ["免费WiFi", "空调", "55寸电视", "办公桌", "保险箱", "冰箱", "电热水壶", "客厅", "行政酒廊权益", "免费早餐"],
            Description: "高级行政套房，独立客厅区域，享有行政酒廊特权和免费早餐。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "含双人早餐+行政酒廊权益",
            Cancellation: "免费取消至入住前2天18:00",
            Tags: ["推荐", "套房", "含早餐"]
          }
        ],
        Policies: {
          CheckIn: "14:00后",
          CheckOut: "11:00前",
          Cancellation: "根据房型不同，取消政策有所差异",
          PetPolicy: "小型宠物允许（需额外费用¥2000/晚）",
          SmokingPolicy: "指定楼层允许吸烟",
          ChildPolicy: "6岁以下儿童与成人同床免费",
          ExtraBed: "可加床，费用¥3000/晚"
        },
        Services: ["机场巴士", "洗衣服务", "旅游咨询", "票务服务", "外币兑换"],
        NearbyAttractions: ["新宿御苑", "歌舞伎町", "东京都厅", "明治神宫", "涩谷"],
        Transportation: "JR新宿站东口步行3分钟，地铁新宿三丁目站步行1分钟",
        Tags: ["商务", "交通便利", "性价比高"],
        Promotions: ["商务客户9折", "连住优惠"]
      },
      {
        ID: "hotel_003",
        Name: "巴黎香榭丽舍量子精品酒店",
        EnglishName: "Paris Champs-Élysées Quantum Boutique Hotel",
        Category: "boutique",
        StarRating: 4,
        Location: "巴黎第8区",
        Address: "香榭丽舍大街88号",
        Coordinates: { lat: 48.8738, lng: 2.3020 },
        Description: "位于巴黎香榭丽舍大街的精品酒店，融合法式优雅与现代设计。酒店地理位置优越，步行可达凯旋门、卢浮宫等著名景点，是体验巴黎浪漫风情的理想选择。",
        Images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
        Amenities: ["免费WiFi", "SPA水疗", "法式餐厅", "酒吧", "礼宾服务", "洗衣服务", "行李寄存", "旅游咨询"],
        Rating: 4.7,
        ReviewCount: 1456,
        PriceRange: {
          Min: 80000000000, // 800 QAU
          Max: 300000000000 // 3,000 QAU
        },
        Distance: "距离凯旋门步行5分钟",
        Landmark: "香榭丽舍大街",
        CheckInTime: "15:00",
        CheckOutTime: "12:00",
        Rooms: [
          {
            ID: "room_007",
            Type: "经典法式房",
            Size: "28㎡",
            MaxGuests: 2,
            BedType: "法式双人床",
            Price: 80000000000, // 800 QAU
            OriginalPrice: 100000000000, // 原价1,000 QAU
            Available: 10,
            Amenities: ["免费WiFi", "空调", "43寸电视", "迷你吧", "保险箱", "法式装饰", "大理石浴室", "浴缸"],
            Description: "典雅的法式装饰房间，融合传统巴黎风情与现代舒适，让您感受纯正的法式浪漫。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "可选法式早餐",
            Cancellation: "免费取消至入住前2天18:00",
            Tags: ["法式风情", "浪漫"]
          },
          {
            ID: "room_008",
            Type: "高级阳台房",
            Size: "35㎡",
            MaxGuests: 2,
            BedType: "法式双人床",
            Price: 120000000000, // 1,200 QAU
            OriginalPrice: 140000000000, // 原价1,400 QAU
            Available: 8,
            Amenities: ["免费WiFi", "空调", "50寸电视", "迷你吧", "保险箱", "法式装饰", "大理石浴室", "浴缸", "私人阳台", "街景"],
            Description: "拥有私人阳台的高级房间，可欣赏香榭丽舍大街的繁华街景，感受巴黎的都市魅力。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "可选法式早餐",
            Cancellation: "免费取消至入住前2天18:00",
            Tags: ["推荐", "阳台", "街景"]
          },
          {
            ID: "room_009",
            Type: "奢华精品套房",
            Size: "75㎡",
            MaxGuests: 4,
            BedType: "法式双人床+沙发床",
            Price: 300000000000, // 3,000 QAU
            OriginalPrice: 350000000000, // 原价3,500 QAU
            Available: 3,
            Amenities: ["免费WiFi", "空调", "65寸电视", "迷你吧", "保险箱", "法式装饰", "大理石浴室", "浴缸", "私人阳台", "街景", "独立客厅", "厨房角落"],
            Description: "奢华的精品套房，完美融合传统法式风格与现代奢华，独立客厅和卧室设计，尽享巴黎精致生活。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "含法式早餐+香槟欢迎礼",
            Cancellation: "免费取消至入住前3天18:00",
            Tags: ["奢华", "套房", "含早餐"]
          }
        ],
        Policies: {
          CheckIn: "15:00后",
          CheckOut: "12:00前",
          Cancellation: "根据房型不同，取消政策有所差异",
          PetPolicy: "允许携带宠物（需额外费用€50/晚）",
          SmokingPolicy: "全面禁烟酒店",
          ChildPolicy: "12岁以下儿童与成人同床免费",
          ExtraBed: "可加床，费用€80/晚"
        },
        Services: ["机场接送", "洗衣服务", "旅游咨询", "票务服务", "外币兑换", "礼宾服务"],
        NearbyAttractions: ["凯旋门", "卢浮宫", "埃菲尔铁塔", "塞纳河", "蒙马特高地"],
        Transportation: "地铁1号线Charles de Gaulle-Étoile站步行3分钟",
        Tags: ["精品", "法式风情", "地标位置"],
        Promotions: ["浪漫套餐", "蜜月优惠", "艺术文化之旅"]
      },
      {
        ID: "hotel_004",
        Name: "纽约时代广场量子都市酒店",
        EnglishName: "New York Times Square Quantum Urban Hotel",
        Category: "urban",
        StarRating: 4,
        Location: "纽约曼哈顿",
        Address: "时代广场西42街200号",
        Coordinates: { lat: 40.7589, lng: -73.9851 },
        Description: "位于纽约时代广场核心地带的现代都市酒店，周围环绕着百老汇剧院、购物中心和餐厅。酒店设计现代时尚，为宾客提供纽约都市生活的完美体验。",
        Images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
        Amenities: ["免费WiFi", "健身房", "商务中心", "美式餐厅", "咖啡厅", "礼宾服务", "行李寄存", "24小时前台"],
        Rating: 4.6,
        ReviewCount: 3241,
        PriceRange: {
          Min: 100000000000, // 1,000 QAU
          Max: 250000000000 // 2,500 QAU
        },
        Distance: "位于时代广场中心",
        Landmark: "时代广场",
        CheckInTime: "16:00",
        CheckOutTime: "11:00",
        Rooms: [
          {
            ID: "room_010",
            Type: "都市标准房",
            Size: "30㎡",
            MaxGuests: 2,
            BedType: "美式大床",
            Price: 100000000000, // 1,000 QAU
            OriginalPrice: 120000000000, // 原价1,200 QAU
            Available: 25,
            Amenities: ["免费WiFi", "空调", "42寸电视", "迷你冰箱", "保险箱", "现代装饰", "淋浴间"],
            Description: "现代设计的都市标准房，窗外可见繁华的纽约街景，感受不夜城的活力。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "可选美式早餐",
            Cancellation: "免费取消至入住前1天18:00",
            Tags: ["都市风格", "街景"]
          },
          {
            ID: "room_011",
            Type: "时代广场景观房",
            Size: "35㎡",
            MaxGuests: 2,
            BedType: "美式大床",
            Price: 180000000000, // 1,800 QAU
            OriginalPrice: 200000000000, // 原价2,000 QAU
            Available: 15,
            Amenities: ["免费WiFi", "空调", "50寸电视", "迷你冰箱", "保险箱", "现代装饰", "淋浴间", "时代广场景观"],
            Description: "享有时代广场直接景观的房间，可欣赏霓虹灯闪烁的经典纽约夜景。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "可选美式早餐",
            Cancellation: "免费取消至入住前1天18:00",
            Tags: ["热门", "时代广场景观"]
          },
          {
            ID: "room_012",
            Type: "都市套房",
            Size: "60㎡",
            MaxGuests: 4,
            BedType: "美式大床+沙发床",
            Price: 250000000000, // 2,500 QAU
            OriginalPrice: 280000000000, // 原价2,800 QAU
            Available: 6,
            Amenities: ["免费WiFi", "空调", "65寸电视", "迷你冰箱", "保险箱", "现代装饰", "淋浴间", "时代广场景观", "独立客厅", "小厨房"],
            Description: "宽敞的都市套房，独立客厅和卧室，配备小厨房，完美的纽约都市生活体验。",
            Images: ["/api/placeholder/300/200"],
            Breakfast: "含美式早餐",
            Cancellation: "免费取消至入住前2天18:00",
            Tags: ["推荐", "套房", "含早餐"]
          }
        ],
        Policies: {
          CheckIn: "16:00后",
          CheckOut: "11:00前",
          Cancellation: "根据房型不同，取消政策有所差异",
          PetPolicy: "允许携带宠物（需额外费用$75/晚）",
          SmokingPolicy: "全面禁烟酒店",
          ChildPolicy: "18岁以下儿童与成人同床免费",
          ExtraBed: "可加床，费用$50/晚"
        },
        Services: ["机场接送", "洗衣服务", "旅游咨询", "票务服务", "外币兑换"],
        NearbyAttractions: ["百老汇剧院区", "中央公园", "帝国大厦", "自由女神像", "布鲁克林大桥"],
        Transportation: "地铁N/Q/R/W/S/1/2/3/7线Times Sq-42 St站步行1分钟",
        Tags: ["都市", "地标位置", "交通便利"],
        Promotions: ["百老汇套餐", "购物优惠", "都市探索之旅"]
      }
    ];

    // 模拟用户订单
    const mockBookings = [
      {
        ID: "booking_001",
        OrderNumber: "QH20240720001",
        HotelName: "上海外滩量子豪华酒店",
        RoomType: "豪华江景房",
        CheckIn: "2024-07-20",
        CheckOut: "2024-07-22",
        Nights: 2,
        Guests: 2,
        Rooms: 1,
        TotalPrice: 240000000000, // 2,400 QAU
        Status: "已确认",
        BookingTime: "2024-06-18 14:30",
        ConfirmationNumber: "QH240720001",
        GuestName: "张三",
        ContactPhone: "138****8888",
        ContactEmail: "zhang***@email.com"
      },
      {
        ID: "booking_002",
        OrderNumber: "QH20240821002",
        HotelName: "东京新宿量子商务酒店",
        RoomType: "标准双人间",
        CheckIn: "2024-08-21",
        CheckOut: "2024-08-23",
        Nights: 2,
        Guests: 2,
        Rooms: 1,
        TotalPrice: 150000000000, // 1,500 QAU
        Status: "待入住",
        BookingTime: "2024-07-23 16:45",
        ConfirmationNumber: "QH240821002",
        GuestName: "李四",
        ContactPhone: "139****9999",
        ContactEmail: "li***@email.com"
      }
    ];

    setHotels(mockHotels);
    setBookings(mockBookings);
    setLoading(false);
  }, []);

  // 携程风格的功能函数
  const formatAmount = (amount) => {
    return formatCurrency(amount, 'QAU');
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

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDiscount = (original, current) => {
    return Math.round((1 - current / original) * 100);
  };

  // 获取酒店类型图标
  const getHotelCategoryIcon = (category) => {
    const iconMap = {
      'luxury': Building,
      'business': Building,
      'boutique': Building,
      'resort': Building,
      'urban': Building
    };
    return iconMap[category] || Building;
  };

  // 获取设施图标
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      '免费WiFi': Wifi,
      '健身房': Dumbbell,
      '室内游泳池': Waves,
      'SPA水疗': Heart,
      '中西餐厅': Utensils,
      '代客泊车': Car,
      '商务中心': Building,
      '空调': AirVent,
      '电视': Tv,
      '浴缸': Bath,
      '咖啡厅': Coffee
    };
    const IconComponent = iconMap[amenity];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Shield className="w-4 h-4" />;
  };

  // 携程风格的酒店筛选和排序
  const filteredAndSortedHotels = hotels
    .filter(hotel => {
      if (filterBy === 'all') return true;
      if (filterBy === 'luxury') return hotel.Category === 'luxury';
      if (filterBy === 'business') return hotel.Category === 'business';
      if (filterBy === 'boutique') return hotel.Category === 'boutique';
      if (filterBy === 'urban') return hotel.Category === 'urban';
      return true;
    })
    .filter(hotel => {
      return hotel.PriceRange.Min >= priceRange[0] && hotel.PriceRange.Max <= priceRange[1];
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.PriceRange.Min - b.PriceRange.Min;
        case 'rating':
          return b.Rating - a.Rating;
        case 'distance':
          return 0; // 简化处理
        case 'popularity':
          return b.ReviewCount - a.ReviewCount;
        default:
          return 0;
      }
    });

  // 搜索酒店
  const handleSearch = () => {
    console.log('搜索酒店:', searchParams);
    setCurrentStep(1);
  };

  // 预订酒店
  const handleBooking = async () => {
    if (!selectedHotel || !selectedRoom) {
      alert('请选择酒店和房型');
      return;
    }

    try {
      const nights = calculateNights(searchParams.checkIn, searchParams.checkOut);
      const totalPrice = selectedRoom.Price * nights * searchParams.rooms;
      
      const newBooking = {
        ID: `booking_${Date.now()}`,
        OrderNumber: `QH${Date.now()}`,
        HotelName: selectedHotel.Name,
        RoomType: selectedRoom.Type,
        CheckIn: searchParams.checkIn,
        CheckOut: searchParams.checkOut,
        Nights: nights,
        Guests: searchParams.guests,
        Rooms: searchParams.rooms,
        TotalPrice: totalPrice,
        Status: "已确认",
        BookingTime: new Date().toLocaleString(),
        ConfirmationNumber: `QH${Date.now().toString().slice(-9)}`,
        GuestName: "客人姓名",
        ContactPhone: "手机号码",
        ContactEmail: "邮箱地址"
      };

      setBookings(prev => [newBooking, ...prev]);
      alert(`预订成功！\n酒店: ${selectedHotel.Name}\n房型: ${selectedRoom.Type}\n入住: ${searchParams.checkIn}\n退房: ${searchParams.checkOut}\n房间数: ${searchParams.rooms}\n总价: ${formatAmount(totalPrice)}`);
      
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
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">🏨 精选酒店</h2>
              <p className="text-gray-300">全球优质酒店，量子安全保障，品质住宿体验</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-pink-400">{hotels.length}</p>
              <p className="text-gray-300">家精选酒店</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索表单 */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building className="w-6 h-6 mr-2" />
            酒店搜索
          </CardTitle>
          <CardDescription className="text-gray-300">
            搜索全球精品酒店，享受量子安全保障
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 目的地 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">目的地</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="城市或酒店名"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* 入住日期 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">入住日期</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* 退房日期 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">退房日期</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* 客人数量 */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">客人数量</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select 
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} 人</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 搜索按钮 */}
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索酒店
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 热门酒店推荐 */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">热门酒店推荐</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "上海外滩豪华酒店", location: "上海外滩", price: "¥1,200起", tag: "热门" },
              { name: "东京新宿商务酒店", location: "东京新宿", price: "¥450起", tag: "特价" },
              { name: "巴黎精品酒店", location: "巴黎香榭丽舍", price: "¥800起", tag: "推荐" }
            ].map((hotel, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{hotel.name}</span>
                    <Badge className="bg-red-500/20 text-red-400">{hotel.tag}</Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{hotel.location}</p>
                  <p className="text-pink-400 font-bold">{hotel.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 渲染酒店选择页面
  const renderHotelSelectPage = () => {
    const nights = calculateNights(searchParams.checkIn, searchParams.checkOut);

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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  修改搜索
                </Button>
                <div className="text-white">
                  <h2 className="text-xl font-bold">
                    {searchParams.destination} 酒店
                  </h2>
                  <p className="text-gray-300">
                    {formatFullDate(searchParams.checkIn)} - {formatFullDate(searchParams.checkOut)} • {nights}晚 • {searchParams.guests}位客人
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-pink-400">{filteredAndSortedHotels.length}</p>
                <p className="text-gray-300">家酒店</p>
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
                  <option value="rating">评分最高</option>
                  <option value="distance">距离最近</option>
                  <option value="popularity">人气最高</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">类型:</span>
                <select 
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded text-sm"
                >
                  <option value="all">全部酒店</option>
                  <option value="luxury">豪华酒店</option>
                  <option value="business">商务酒店</option>
                  <option value="boutique">精品酒店</option>
                  <option value="urban">都市酒店</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 酒店列表 */}
        <div className="space-y-6">
          {filteredAndSortedHotels.map((hotel) => {
            const CategoryIcon = getHotelCategoryIcon(hotel.Category);
            return (
              <Card 
                key={hotel.ID} 
                className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer ${
                  selectedHotel?.ID === hotel.ID ? 'ring-2 ring-pink-400' : ''
                }`}
                onClick={() => {
                  setSelectedHotel(hotel);
                  setCurrentStep(2);
                }}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* 酒店图片 */}
                    <div className="lg:col-span-1">
                      <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                        <CategoryIcon className="w-16 h-16 text-white/80" />
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Camera className="w-3 h-3 mr-1" />
                          {hotel.Images.length}张图片
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-3 h-3 mr-1" />
                          收藏
                        </Button>
                      </div>
                    </div>

                    {/* 酒店信息 */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-bold text-xl">{hotel.Name}</h3>
                          <div className="flex items-center">
                            {[...Array(hotel.StarRating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            {hotel.Tags.includes("热门") && <Badge className="bg-red-500/20 text-red-400">热门</Badge>}
                            {hotel.Tags.includes("推荐") && <Badge className="bg-green-500/20 text-green-400">推荐</Badge>}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{hotel.EnglishName}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{hotel.Address}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Navigation className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{hotel.Distance}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge className="bg-yellow-500/20 text-yellow-400 truncate-number">
                          ⭐ {hotel.Rating}
                        </Badge>
                        <span className="text-gray-400 text-sm truncate-number">
                          {formatNumber(hotel.ReviewCount)} 条评价
                        </span>
                        <Badge variant="outline">
                          {hotel.Category === 'luxury' ? '豪华酒店' :
                           hotel.Category === 'business' ? '商务酒店' :
                           hotel.Category === 'boutique' ? '精品酒店' :
                           hotel.Category === 'urban' ? '都市酒店' : '度假酒店'}
                        </Badge>
                      </div>

                      <p className="text-gray-300 text-sm line-clamp-3">{hotel.Description}</p>

                      <div>
                        <h4 className="text-white font-semibold mb-2">酒店设施</h4>
                        <div className="flex flex-wrap gap-2">
                          {hotel.Amenities.slice(0, 6).map((amenity, index) => (
                            <div key={index} className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded text-xs text-gray-300">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                          {hotel.Amenities.length > 6 && (
                            <span className="text-xs text-gray-400">+{hotel.Amenities.length - 6}项设施</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 价格和选择 */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">每晚最低价</p>
                        <p className="text-2xl font-bold text-green-400 truncate-number">{formatAmount(hotel.PriceRange.Min)}</p>
                        <p className="text-xs text-gray-400">含税费 • {nights}晚总价 <span className="truncate-number">{formatAmount(hotel.PriceRange.Min * nights)}</span></p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">房型: {hotel.Rooms.length}种可选</p>
                        <p className="text-sm text-gray-300">位置: {hotel.Landmark}</p>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHotel(hotel);
                          setCurrentStep(2);
                        }}
                      >
                        查看房型
                      </Button>
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
    if (!selectedHotel) return null;

    const nights = calculateNights(searchParams.checkIn, searchParams.checkOut);

    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">选择房型</CardTitle>
            <CardDescription className="text-gray-300">
              {selectedHotel.Name} - {formatFullDate(searchParams.checkIn)} 至 {formatFullDate(searchParams.checkOut)} • {nights}晚
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedHotel.Rooms.map((room) => {
              const totalPrice = room.Price * nights * searchParams.rooms;
              const originalTotalPrice = room.OriginalPrice * nights * searchParams.rooms;
              const discount = calculateDiscount(room.OriginalPrice, room.Price);

              return (
                <Card 
                  key={room.ID}
                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer ${
                    selectedRoom?.ID === room.ID ? 'ring-2 ring-pink-400' : ''
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* 房型图片 */}
                      <div className="lg:col-span-1">
                        <div className="w-full h-32 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                          <Bed className="w-12 h-12 text-white/80" />
                        </div>
                        <div className="text-xs text-gray-400">
                          <p>{room.Size} • {room.BedType}</p>
                          <p>最多入住 {room.MaxGuests} 人</p>
                        </div>
                      </div>

                      {/* 房型信息 */}
                      <div className="lg:col-span-2 space-y-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">{room.Type}</h4>
                          <p className="text-sm text-gray-300">{room.Description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {room.Tags.map((tag, index) => (
                            <Badge key={index} className="bg-pink-500/20 text-pink-400 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold text-white mb-2">房间设施</h5>
                          <div className="grid grid-cols-2 gap-1 text-xs text-gray-300">
                            {room.Amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm">
                          <p className="text-gray-300">{room.Breakfast}</p>
                          <p className="text-gray-400">{room.Cancellation}</p>
                        </div>
                      </div>

                      {/* 价格和预订 */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            {discount > 0 && (
                              <span className="text-xs text-gray-400 line-through truncate-number">
                                {formatAmount(room.OriginalPrice)}
                              </span>
                            )}
                            {discount > 0 && (
                              <Badge className="bg-red-500/20 text-red-400 text-xs truncate-number">
                                {discount}折
                              </Badge>
                            )}
                          </div>
                          <p className="text-xl font-bold text-green-400 truncate-number">{formatAmount(room.Price)}</p>
                          <p className="text-xs text-gray-400">每晚价格</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300 truncate-number">{formatAmount(room.Price)} × {nights}晚</span>
                              <span className="text-white truncate-number">{formatAmount(room.Price * nights)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">房间数 × {searchParams.rooms}</span>
                              <span className="text-white truncate-number">{formatAmount(totalPrice)}</span>
                            </div>
                            <div className="border-t border-white/10 pt-1 mt-2">
                              <div className="flex justify-between font-bold">
                                <span className="text-white">总价</span>
                                <span className="text-green-400 truncate-number">{formatAmount(totalPrice)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">余房: <span className="truncate-number">{formatNumber(room.Available)}</span>间</p>
                        </div>

                        <Button 
                          className="w-full bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-600 hover:to-pink-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(room);
                            handleBooking();
                          }}
                          disabled={room.Available === 0}
                        >
                          {room.Available === 0 ? '已售罄' : '立即预订'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
            查看您的酒店预订记录和确认信息
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
                          {booking.HotelName}
                        </h3>
                        <p className="text-gray-400">{booking.RoomType}</p>
                      </div>
                      <Badge className={`${
                        booking.Status === '已确认' ? 'bg-green-500/20 text-green-400' :
                        booking.Status === '待入住' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {booking.Status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">入住日期</p>
                        <p className="text-white">{booking.CheckIn}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">退房日期</p>
                        <p className="text-white">{booking.CheckOut}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">住宿</p>
                        <p className="text-white">{booking.Nights}晚 • {booking.Rooms}间</p>
                      </div>
                      <div>
                        <p className="text-gray-400">客人</p>
                        <p className="text-cyan-400">{booking.Guests}人</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">订单号</p>
                        <p className="text-white">{booking.OrderNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">确认号</p>
                        <p className="text-white">{booking.ConfirmationNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">总价</p>
                        <p className="text-green-400 font-bold truncate-number">{formatAmount(booking.TotalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">预订时间</p>
                        <p className="text-white">{booking.BookingTime}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <div className="text-sm text-gray-400">
                        <p>入住人: {booking.GuestName}</p>
                        <p>联系方式: {booking.ContactPhone} • {booking.ContactEmail}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4 mr-2" />
                          确认函
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          下载
                        </Button>
                        {booking.Status === '待入住' && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            修改
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
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">还没有预订记录</h3>
              <p className="text-gray-300 mb-6">快去搜索心仪的酒店吧</p>
              <Button 
                onClick={() => setCurrentStep(0)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索酒店
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                量子酒店预订
              </h1>
              <p className="text-gray-300 text-lg">安全预订全球精品酒店，享受量子加密保障</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-500/20 text-purple-400">
                <Shield className="w-4 h-4 mr-1" />
                量子安全
              </Badge>
              <Badge className="bg-green-500/20 text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                实时确认
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
            <TabsTrigger value="search" onClick={() => setCurrentStep(0)}>搜索酒店</TabsTrigger>
            <TabsTrigger value="select" disabled={currentStep < 1}>选择酒店</TabsTrigger>
            <TabsTrigger value="booking" disabled={currentStep < 2}>选择房型</TabsTrigger>
            <TabsTrigger value="orders" onClick={() => setCurrentStep(3)}>我的订单</TabsTrigger>
          </TabsList>

          {currentStep === 0 && <TabsContent value="search">{renderSearchPage()}</TabsContent>}
          {currentStep === 1 && <TabsContent value="select">{renderHotelSelectPage()}</TabsContent>}
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

export default HotelBookingApp;


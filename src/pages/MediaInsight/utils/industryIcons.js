import {
  Folder,
  CircleDot,
  CircleDollarSign,
  Landmark,
  Hospital,
  Hammer,
  BriefcaseBusiness,
  Car,
  Ship,
  Plane,
  Bus,
  GraduationCap,
  Baby,
  MonitorSmartphone,
  Earth,
  Shirt,
  SoapDispenserDroplet,
  ShoppingBasket,
  SquareStar,
  MicVocal,
  Gamepad2,
  Volleyball,
  Utensils,
} from "lucide-react";

const INDUSTRY_ICON_RULES = [
  { keys: ["전체"], Icon: Folder },
  { keys: ["금융", "보험", "은행", "카드", "증권"], Icon: CircleDollarSign },
  { keys: ["자동차", "차량", "모빌리티"], Icon: Car },
  { keys: ["정유", "수송"], Icon: Ship },
  { keys: ["건설", "부동산"], Icon: Hammer },
  { keys: ["식품", "음료", "외식", "푸드", "주류"], Icon: Utensils },
  { keys: ["의료", "건강", "제약", "헬스"], Icon: Hospital },
  { keys: ["항공", "숙박"], Icon: Plane },
  { keys: ["여행", "교통"], Icon: Bus },
  { keys: ["결혼", "출산", "육아"], Icon: Baby },
  { keys: ["가전", "IT", "통신", "모바일", "전자"], Icon: MonitorSmartphone },
  { keys: ["미용", "화장품"], Icon: SoapDispenserDroplet },
  { keys: ["패션", "의류"], Icon: Shirt },
  { keys: ["교육", "학습", "학교"], Icon: GraduationCap },
  { keys: ["스포츠"], Icon: Volleyball },
  { keys: ["게임"], Icon: Gamepad2 },
  { keys: ["엔터", "문화", "콘텐츠"], Icon: SquareStar },
  { keys: ["공연"], Icon: MicVocal },
  { keys: ["기업", "B2B", "비즈니스"], Icon: BriefcaseBusiness },
  { keys: ["공공"], Icon: Landmark },
  { keys: ["ICT"], Icon: Earth },
  { keys: ["유통", "쇼핑", "커머스", "마트"], Icon: ShoppingBasket },
];

export function getIndustryIcon(industry) {
  const normalized = String(industry ?? "").toLowerCase();
  const matched = INDUSTRY_ICON_RULES.find(({ keys }) =>
    keys.some((key) => normalized.includes(key.toLowerCase())),
  );
  return matched?.Icon ?? CircleDot;
}

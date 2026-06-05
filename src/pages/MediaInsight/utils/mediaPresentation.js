import { Megaphone } from "lucide-react";
import {
  faGoogle,
  faMeta,
  faFacebookF,
  faInstagram,
  faTiktok,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export function getMediaPresentation(media) {
  const name = String(media ?? "").toLowerCase();

  if (name.includes("google") || name.includes("구글"))
    return { brandIcon: faGoogle, accent: "#4285F4", soft: "#F5F9FE" };
  if (name.includes("youtube") || name.includes("유튜브"))
    return { brandIcon: faYoutube, accent: "#FF3000", soft: "#FFF4F2" };
  if (name.includes("메타") || name.includes("meta"))
    return { brandIcon: faMeta, accent: "#0081FB", soft: "#F2F8FF" };
  if (name.includes("facebook") || name.includes("페이스북"))
    return { brandIcon: faFacebookF, accent: "#0081FB", soft: "#F2F8FF" };
  if (name.includes("instagram") || name.includes("인스타"))
    return { brandIcon: faInstagram, accent: "#FD1C80", soft: "#FFF3F8" };
  if (name.includes("tiktok") || name.includes("틱톡"))
    return { brandIcon: faTiktok, accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("twitter") || name.includes("트위터") || name.includes("엑스"))
    return { brandIcon: faXTwitter, accent: "#000000", soft: "#F2F2F2" };

  if (name.includes("naver") || name.includes("네이버"))
    return { logoSrc: "/static/logo-media/naver.svg", accent: "#03C75A", soft: "#F2FCF6" };
  if (name.includes("kakao") || name.includes("카카오"))
    return { logoSrc: "/static/logo-media/kakao.svg", accent: "#FFCD00", soft: "#FEFAE6" };
  if (name.includes("당근"))
    return { logoSrc: "/static/logo-media/daangn.svg", accent: "#FF6F0F", soft: "#FFF8F3" };
  if (name.includes("toss") || name.includes("토스"))
    return { logoSrc: "/static/logo-media/toss.svg", accent: "#0050FF", soft: "#F2F6FF" };

  if (name.includes("크리테오") || name.includes("criteo"))
    return { letterIcon: "C", accent: "#FF5102", soft: "#FFF6F2" };
  if (name.includes("버즈빌") || name.includes("buzzvil"))
    return { letterIcon: "b", accent: "#F44336", soft: "#FEF5F5" };
  if (name.includes("블라인드") || name.includes("blind"))
    return { letterIcon: "B", accent: "#DB3239", soft: "#FDF4F5" };
  if (name.includes("smr"))
    return { letterIcon: "S", accent: "#151A23", soft: "#F3F3F4" };
  if (name.includes("모비온"))
    return { letterIcon: "M", accent: "#85B64D", soft: "#F9FBF6" };
  if (name.includes("크로스타겟"))
    return { letterIcon: "C", accent: "#0C1F54", soft: "#F3F4F6" };
  if (name.includes("티빙") || name.includes("tving"))
    return { letterIcon: "T", accent: "#FF153C", soft: "#FFF3F5" };
  if (name.includes("에디슨오퍼월"))
    return { letterIcon: "A", accent: "#5E33B0", soft: "#F7F5FB" };
  if (name.includes("넷플릭스") || name.includes("netflix"))
    return { letterIcon: "N", accent: "#E40813", soft: "#FDF2F3" };
  if (name.includes("에브리타임"))
    return { letterIcon: "E", accent: "#F91F15", soft: "#FEF4F3" };
  if (name.includes("ok 캐쉬백"))
    return { letterIcon: "O", accent: "#FE0955", soft: "#FFF2F6" };
  if (name.includes("리멤버"))
    return { letterIcon: "R", accent: "#000000", soft: "#F2F2F2" };

  return { Icon: Megaphone, accent: "#64748b", soft: "#f1f5f9" };
}

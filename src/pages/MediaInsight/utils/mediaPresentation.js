import { Megaphone } from "lucide-react";
import {
  faGoogle,
  faMeta,
  faFacebookF,
  faInstagram,
  faTiktok,
  faYoutube,
  faXTwitter,
  faPinterest,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";

const L = (file) => `/static/logo-media/${file}`;

export function getMediaPresentation(media) {
  const name = String(media ?? "").toLowerCase();

  // ── Global platforms ──────────────────────────────────────────
  if (name.includes("google") || name.includes("구글"))
    return { logoSrc: L("google.png"), accent: "#4285F4", soft: "#F5F9FE" };
  if (name.includes("youtube") || name.includes("유튜브"))
    return { brandIcon: faYoutube, accent: "#FF3000", soft: "#FFF4F2" };
  if (name.includes("메타") || name.includes("meta"))
    return { brandIcon: faMeta, accent: "#0081FB", soft: "#F2F8FF" };
  if (name.includes("facebook") || name.includes("페이스북"))
    return { brandIcon: faFacebookF, accent: "#0081FB", soft: "#F2F8FF" };
  if (name.includes("instagram") || name.includes("인스타"))
    return { logoSrc: L("instagram.png"), accent: "#FD1C80", soft: "#FFF3F8" };
  if (name.includes("tiktok") || name.includes("틱톡"))
    return { brandIcon: faTiktok, accent: "#000000", soft: "#F2F2F2" };
  if (
    name.includes("twitter") ||
    name.includes("트위터") ||
    name.includes("x(트위터)")
  )
    return { brandIcon: faXTwitter, accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("pinterest") || name.includes("핀터레스트"))
    return { brandIcon: faPinterest, accent: "#E41F28", soft: "#FDF4F4" };
  if (name.includes("twitch"))
    return { brandIcon: faTwitch, accent: "#8C44F7", soft: "#F9F5FE" };
  if (name.includes("linkedin") || name.includes("링크드인"))
    return { logoSrc: L("linkedin.svg"), accent: "#007EBB", soft: "#F2F8FB" };
  if (name.includes("apple") || name.includes("애플"))
    return { logoSrc: L("apple.svg"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("netflix") || name.includes("넷플릭스"))
    return { logoSrc: L("netflix.png"), accent: "#E40813", soft: "#FDF2F3" };

  // ── Naver ecosystem (specific first) ─────────────────────────
  if (name.includes("치지직") || name.includes("chzzk"))
    return { logoSrc: L("chzzk.png"), accent: "#000000", soft: "#F2FFFA" };
  if (name.includes("스노우") || name.includes("snow"))
    return { logoSrc: L("snow.png"), accent: "#00CDF5", soft: "#F2FCFE" };
  if (
    name.includes("네이버페이") ||
    name.includes("네이버 페이") ||
    name.includes("npay")
  )
    return { logoSrc: L("npay.png"), accent: "#03C75A", soft: "#F2FCF6" };
  if (name.includes("네이버 웹툰") || name.includes("네이버웹툰"))
    return {
      logoSrc: L("naverwebtoon.png"),
      accent: "#03C75A",
      soft: "#F2FCF6",
    };
  if (name.includes("naver") || name.includes("네이버"))
    return { logoSrc: L("naver.svg"), accent: "#03C75A", soft: "#F2FCF6" };

  // ── Kakao ecosystem ────────────────────────────────────────────
  if (name.includes("kakao") || name.includes("카카오"))
    return { logoSrc: L("kakao.svg"), accent: "#FFCD00", soft: "#F8F9FC" };

  // ── Major Korean platforms ─────────────────────────────────────
  if (name.includes("당근"))
    return { logoSrc: L("daangn.svg"), accent: "#FF6F0F", soft: "#FFF8F3" };
  if (name.includes("toss") || name.includes("토스"))
    return { logoSrc: L("toss.svg"), accent: "#0050FF", soft: "#F2F6FF" };
  if (name.includes("다음"))
    return { logoSrc: L("daum.png"), accent: "#4182F8", soft: "#EEF7FF" };
  if (name.includes("네이트"))
    return { logoSrc: L("nate.png"), accent: "#FC2B2E", soft: "#FFF4F4" };
  if (
    name.includes("배달의 민족") ||
    name.includes("배달의민족") ||
    name.includes("baemin")
  )
    return { logoSrc: L("baemin.png"), accent: "#000000", soft: "#F3FEFD" };
  if (name.includes("쿠팡") || name.includes("coupang"))
    return { logoSrc: L("coupang.png"), accent: "#DD2E1D", soft: "#FDF4F3" };
  if (name.includes("ssg"))
    return { logoSrc: L("ssg.png"), accent: "#FF306C", soft: "#F7F4FF" };
  if (name.includes("티맵") || name.includes("tmap"))
    return { logoSrc: L("tmap.png"), accent: "#0164FF", soft: "#F5FDFB" };
  if (name.includes("페이코"))
    return { logoSrc: L("payco.png"), accent: "#FA2829", soft: "#FEF4F4" };
  if (name.includes("티머니"))
    return { logoSrc: L("tmoney.png"), accent: "#952687", soft: "#F9F4F9" };

  // ── Video / Entertainment ──────────────────────────────────────
  if (name.includes("티빙") || name.includes("tving"))
    return { logoSrc: L("tving.png"), accent: "#FF153C", soft: "#FFF3F5" };
  if (name.includes("soop"))
    return { logoSrc: L("soop.png"), accent: "#008AF6", soft: "#F2F9FE" };
  if (name.includes("jtbc"))
    return { logoSrc: L("jtbc.png"), accent: "#F22D94", soft: "#FEFDF5" };
  if (name.includes("kbs"))
    return { logoSrc: L("kbs.png"), accent: "#2F97DA", soft: "#F4FAFD" };
  if (name.includes("cbs"))
    return { logoSrc: L("cbs.png"), accent: "#004DA1", soft: "#F2F6FA" };
  if (name.includes("cts"))
    return { logoSrc: L("cts.png"), accent: "#0D3692", soft: "#FFFBF3" };
  if (name.includes("mnet"))
    return { logoSrc: L("mnet.png"), accent: "#FF0571", soft: "#FFF2F8" };
  if (name.includes("spotv"))
    return { logoSrc: L("spotv.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("smr"))
    return { logoSrc: L("smr.png"), accent: "#151A23", soft: "#F3F3F4" };

  // ── Ad networks / DSP ─────────────────────────────────────────
  if (name.includes("나스미디어"))
    return { logoSrc: L("nas.png"), accent: "#ED1C24", soft: "#F2F2F2" };
  if (name.includes("모비온"))
    return { logoSrc: L("mobon.png"), accent: "#85B64D", soft: "#F9FBF6" };
  if (name.includes("크로스타겟"))
    return {
      logoSrc: L("crosstarget.png"),
      accent: "#0C1F54",
      soft: "#F3F4F6",
    };
  if (name.includes("버즈빌") || name.includes("buzzvil"))
    return { logoSrc: L("buzzvil.png"), accent: "#F44336", soft: "#FEF5F5" };
  if (name.includes("타불라") || name.includes("taboola"))
    return { logoSrc: L("taboola.png"), accent: "#064164", soft: "#F2F5F7" };
  if (name.includes("테즈") || name.includes("teads"))
    return { logoSrc: L("teads.png"), accent: "#FA70A1", soft: "#F2FAFE" };
  if (name.includes("트레이딩웍스"))
    return {
      logoSrc: L("tradingworks.png"),
      accent: "#1F92F9",
      soft: "#F4F9FE",
    };
  if (name.includes("몰로코"))
    return { logoSrc: L("moloco.png"), accent: "#040078", soft: "#F2F2F8" };
  if (name.includes("리머지"))
    return { logoSrc: L("remerge.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("tnk"))
    return { logoSrc: L("tnk.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("rtb"))
    return { logoSrc: L("rtb.png"), accent: "#EE4036", soft: "#FEF5F5" };
  if (name.includes("covi"))
    return { logoSrc: L("covi.png"), accent: "#E30413", soft: "#FDF2F3" };
  if (name.includes("asum"))
    return { logoSrc: L("asum.png"), accent: "#E94647", soft: "#FEF5F6" };
  if (name.includes("nbt"))
    return { logoSrc: L("nbt.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("카울리") || name.includes("cauly"))
    return { logoSrc: L("cauly.png"), accent: "#165EFE", soft: "#F3F7FF" };
  if (name.includes("타겟팅게이츠"))
    return {
      logoSrc: L("targetinggates.png"),
      accent: "#000000",
      soft: "#F2F2F2",
    };
  if (name.includes("타겟픽"))
    return { logoSrc: L("targetpick.png"), accent: "#000000", soft: "#FBF2F3" };
  if (name.includes("시그널플레이"))
    return { logoSrc: L("signalplay.png"), accent: "#000000", soft: "#FEF7F7" };
  if (name.includes("캐시슬라이드"))
    return { logoSrc: L("cashslide.png"), accent: "#000000", soft: "#FFFDF2" };
  if (name.includes("캐시워크") || name.includes("cashwalk"))
    return { logoSrc: L("cashwalk.png"), accent: "#5E5050", soft: "#FFFCF2" };
  if (name.includes("캐시프렌즈"))
    return {
      logoSrc: L("cashfriends.png"),
      accent: "#222325",
      soft: "#FFFEF2",
    };
  if (name.includes("크리테오") || name.includes("criteo"))
    return { letterIcon: "C", accent: "#FF5102", soft: "#FFF6F2" };
  if (
    name.includes("에이스 트레이더") ||
    name.includes("ace trader") ||
    name.includes("acetrader")
  )
    return { logoSrc: L("acetrader.png"), accent: "#F5292A", soft: "#FEF4F4" };
  if (name.includes("트레이드 데스크") || name.includes("the trade desk"))
    return { logoSrc: L("tradedesk.png"), accent: "#0099FA", soft: "#F2FAFE" };
  if (name.includes("인터웍스"))
    return { logoSrc: L("interworks.png"), accent: "#83BD57", soft: "#F9FBF6" };
  if (name.includes("미디어웹"))
    return { logoSrc: L("mediaweb.png"), accent: "#019ADE", soft: "#FBFDF5" };
  if (name.includes("shared it") || name.includes("쉐어드잇"))
    return { logoSrc: L("sharedit.png"), accent: "#007CC8", soft: "#F2F8FC" };
  if (name.includes("apti"))
    return { logoSrc: L("apti.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("디지털 캠프") || name.includes("디지털캠프"))
    return {
      logoSrc: L("digitalcamp.png"),
      accent: "#26AA38",
      soft: "#F2FAFE",
    };

  // ── Finance / Card ─────────────────────────────────────────────
  if (name.includes("신한카드"))
    return { logoSrc: L("sinhan.png"), accent: "#0046FF", soft: "#F2F5FF" };
  if (name.includes("국민카드") || name.includes("kb"))
    return { logoSrc: L("kb.png"), accent: "#FCAE17", soft: "#FFFBF3" };
  if (name.includes("ok 캐쉬백") || name.includes("okcashbag"))
    return { logoSrc: L("okcashbag.png"), accent: "#FE0955", soft: "#FFF2F6" };
  if (name.includes("cj one") || name.includes("cjone"))
    return { logoSrc: L("cjone.png"), accent: "#F151D7", soft: "#F8FCFE" };
  if (name.includes("sk"))
    return { logoSrc: L("sk.png"), accent: "#E1002A", soft: "#FEF8F2" };

  // ── Community / Info ────────────────────────────────────────────
  if (name.includes("블라인드") || name.includes("blind"))
    return { logoSrc: L("blind.svg"), accent: "#DB3239", soft: "#FDF4F5" };
  if (name.includes("에브리타임"))
    return { logoSrc: L("everytime.png"), accent: "#F91F15", soft: "#FFFFFF" };
  if (name.includes("디시인사이드"))
    return { logoSrc: L("dcinside.png"), accent: "#3A4690", soft: "#F5F5F9" };
  if (name.includes("인벤"))
    return { logoSrc: L("inven.png"), accent: "#6DB82B", soft: "#F7FBF4" };
  if (name.includes("보배드림"))
    return { logoSrc: L("bobae.png"), accent: "#0070BD", soft: "#F2F8FB" };
  if (name.includes("리멤버"))
    return { logoSrc: L("remember.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("잡코리아"))
    return { logoSrc: L("jobkorea.png"), accent: "#111AFF", soft: "#FBFFF2" };
  if (name.includes("잡플래닛"))
    return { logoSrc: L("jobplanet.png"), accent: "#00C462", soft: "#F2FCF7" };
  if (name.includes("자소설닷컴"))
    return { logoSrc: L("jasoseol.png"), accent: "#FF6813", soft: "#FFF7F3" };
  if (name.includes("링커리어"))
    return { logoSrc: L("linkareer.png"), accent: "#019FFF", soft: "#F2FAFF" };
  if (name.includes("스펙업"))
    return { logoSrc: L("specup.png"), accent: "#2B3A99", soft: "#F4F5FA" };
  if (name.includes("오르비"))
    return { logoSrc: L("orbi.png"), accent: "#33478F", soft: "#F5F6F9" };
  if (name.includes("콴다"))
    return { logoSrc: L("qanda.png"), accent: "#FF5800", soft: "#F2F2F2" };
  if (name.includes("중앙일보"))
    return {
      logoSrc: L("thejoongang.png"),
      accent: "#F89C0E",
      soft: "#FEFAF3",
    };
  if (name.includes("더리치"))
    return { logoSrc: L("therich.png"), accent: "#1B1F2D", soft: "#F3F4F4" };
  if (name.includes("글로우픽"))
    return { logoSrc: L("glowpick.png"), accent: "#EC1D31", soft: "#FEF3F4" };
  if (name.includes("노트폴리오"))
    return { logoSrc: L("notefolio.png"), accent: "#1ECAD3", soft: "#F3FCFD" };
  if (name.includes("etf check") || name.includes("etfcheck"))
    return { logoSrc: L("etfcheck.png"), accent: "#45BE95", soft: "#F5FBF9" };

  // ── Education ──────────────────────────────────────────────────
  if (name.includes("클래스팅"))
    return { logoSrc: L("classting.png"), accent: "#01C897", soft: "#F2FCFA" };
  if (name.includes("아이엠스쿨"))
    return { logoSrc: L("iamschool.png"), accent: "#2FC971", soft: "#F4FCF8" };
  if (name.includes("키즈노트"))
    return { logoSrc: L("kidsnote.png"), accent: "#FDDA00", soft: "#F5FAFE" };
  if (name.includes("하이클래스"))
    return { logoSrc: L("hiclass.png"), accent: "#AFE022", soft: "#FBFDF4" };
  if (name.includes("오늘학교"))
    return {
      logoSrc: L("todayschool.png"),
      accent: "#1976DE",
      soft: "#F3F8FD",
    };
  if (name.includes("캠퍼스픽"))
    return { logoSrc: L("campuspick.png"), accent: "#1DCDFF", soft: "#F3FCFF" };
  if (name.includes("열품타"))
    return { logoSrc: L("yeolpumta.png"), accent: "#FFA03C", soft: "#F6F6F6" };
  if (name.includes("하이브레인"))
    return { logoSrc: L("hbn.png"), accent: "#F1665B", soft: "#F5FAFE" };

  // ── Parenting / Life ───────────────────────────────────────────
  if (name.includes("맘스다이어리"))
    return { logoSrc: L("momsdiary.png"), accent: "#E94E62", soft: "#FEF6F7" };
  if (name.includes("맘스홀릭") || name.includes("momsholic"))
    return { logoSrc: L("momsholic.png"), accent: "#72B648", soft: "#F8FBF6" };
  if (name.includes("베이비타임"))
    return { logoSrc: L("babytime.png"), accent: "#3A55A4", soft: "#FEF7F8" };
  if (name.includes("마미톡"))
    return { logoSrc: L("mmtalk.png"), accent: "#9ADDD8", soft: "#FAFDFD" };
  if (name.includes("핑크다이어리"))
    return { logoSrc: L("pinkdiary.png"), accent: "#FF335A", soft: "#FFF5F6" };

  // ── Shopping / Travel / Etc ────────────────────────────────────
  if (name.includes("스카이스캐너"))
    return { logoSrc: L("skyscanner.png"), accent: "#0770E3", soft: "#F2F8FD" };
  if (name.includes("트리플"))
    return { logoSrc: L("triple.png"), accent: "#0BD0AF", soft: "#F3FCFB" };
  if (name.includes("롯데"))
    return { logoSrc: L("lotte.png"), accent: "#ED1C24", soft: "#FEF3F4" };
  if (name.includes("엔카") || name.includes("encar"))
    return { logoSrc: L("encar.png"), accent: "#DB0632", soft: "#FDF2F4" };
  if (name.includes("케이카"))
    return { logoSrc: L("kcar.png"), accent: "#D7252E", soft: "#F1F1F1" };
  if (name.includes("골프존"))
    return { logoSrc: L("golfzon.png"), accent: "#023488", soft: "#F2F5F9" };
  if (name.includes("런데이"))
    return { logoSrc: L("runday.png"), accent: "#4F5EFF", soft: "#F6F7FF" };
  if (name.includes("그린피"))
    return { logoSrc: L("greenp.png"), accent: "#49BC57", soft: "#F6FBF6" };
  if (name.includes("다방"))
    return { logoSrc: L("dabang.png"), accent: "#326CF9", soft: "#F4F7FE" };
  if (name.includes("비트윈"))
    return { logoSrc: L("between.png"), accent: "#1ACFC6", soft: "#F3FCFC" };
  if (name.includes("한컴"))
    return { logoSrc: L("hancom.png"), accent: "#000000", soft: "#FEF6F4" };
  if (name.includes("알툴즈"))
    return { logoSrc: L("altools.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("안랩"))
    return { logoSrc: L("ahnlab.png"), accent: "#1F4787", soft: "#F4F6F9" };
  if (name.includes("겟챠"))
    return { logoSrc: L("getcha.png"), accent: "#EF3332", soft: "#FEF5F4" };
  if (name.includes("카드 고릴라") || name.includes("카드고릴라"))
    return {
      logoSrc: L("cardgorilla.png"),
      accent: "#FFAD01",
      soft: "#FFFBF2",
    };
  if (name.includes("열나요"))
    return { logoSrc: L("fevercoah.png"), accent: "#EC6153", soft: "#FEF7F6" };
  if (name.includes("열달후에"))
    return { logoSrc: L("after10m.png"), accent: "#42338A", soft: "#FEF7F2" };
  if (name.includes("talk it") || name.includes("talkit"))
    return { logoSrc: L("talkit.png"), accent: "#9B4DCA", soft: "#FAF6FC" };
  if (name.includes("맨플러스"))
    return { logoSrc: L("manplus.png"), accent: "#000000", soft: "#F2F2F2" };
  if (name.includes("애드패커"))
    return { logoSrc: L("adpacker.png"), accent: "#CF171F", soft: "#FCF3F4" };
  if (name.includes("에디슨오퍼월") || name.includes("adison"))
    return { logoSrc: L("adison.png"), accent: "#5E33B0", soft: "#F7F5FB" };
  if (name.includes("jtbc"))
    return { logoSrc: L("jtbc.png"), accent: "#F22D94", soft: "#FEFDF5" };

  return { Icon: Megaphone, accent: "#64748b", soft: "#f1f5f9" };
}

import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const MIX_PATHS = ['/mix-search', '/my-folders', '/my-bookmarks'];
const MMM_PATHS = ['/mmm/create', '/mmm/my-mmm'];

export default function SidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const inMixGroup = MIX_PATHS.some((p) => location.pathname.startsWith(p));
  const inMmmGroup = MMM_PATHS.some((p) => location.pathname.startsWith(p));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <img src="/static/logo-main/logo.svg" alt="Mixpedia" className="sidebar-logo" />
          <span className="logo-text">MIXPEDIA</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/media-insight" className="sidebar-link">
          Media Insight
        </NavLink>

        {/* Media Mix group */}
        <div className={`sidebar-group-label${inMixGroup ? " sidebar-group-label--active" : ""}`}>
          Media Mix
        </div>
        <div className="sidebar-subnav">
          <NavLink to="/mix-search" className="sidebar-sublink">
            Media Mix 조회
          </NavLink>
          <NavLink to="/my-folders" className="sidebar-sublink">
            내 폴더
          </NavLink>
        </div>

        {/* MMM group */}
        <div className={`sidebar-group-label${inMmmGroup ? " sidebar-group-label--active" : ""}`}>
          Marketing Mix Modeling
        </div>
        <div className="sidebar-subnav">
          <NavLink to="/mmm/create" className="sidebar-sublink">
            모델 생성
          </NavLink>
          <NavLink to="/mmm/my-mmm" className="sidebar-sublink">
            모델 확인
          </NavLink>
        </div>

        <a
          href="https://thedap.dmcmedia.co.kr/login"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link sidebar-link--logo"
        >
          <img src="/static/logo-main/thedap_logo_bw.png" alt="theDAP" className="sidebar-thedap-logo" />
        </a>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </aside>
  );
}

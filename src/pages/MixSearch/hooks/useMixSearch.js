import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import { notify } from "../../../utils/notify";

const initialFilters = {
  search_text: "",
  media: [],
  industry: [],
  target_gender: "P",
  target_age_min: 7,
  target_age_max: 79,
};

export function useMixSearch() {
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mediaOptions, setMediaOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);

  useEffect(() => {
    axios
      .post(`${endpoint}/get_medias/`, {})
      .then((res) =>
        setMediaOptions(
          (res.data?.media || []).map((m) => ({ label: m, value: m })),
        ),
      )
      .catch((err) => console.error("미디어 옵션 로드 실패:", err));

    axios
      .post(`${endpoint}/get_industry/`, {})
      .then((res) =>
        setIndustryOptions(
          (res.data?.industry || []).map((i) => ({ label: i, value: i })),
        ),
      )
      .catch((err) => console.error("산업군 옵션 로드 실패:", err));

    axios
      .post(`${endpoint}/search_macro/`, {})
      .then((res) => setResults(res.data || []))
      .catch((err) => console.error("초기 조회 실패:", err));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const payload = {
        search_filter: {
          search_text: filters.search_text || "",
          media: filters.media,
          industry: filters.industry,
          target_gender: filters.target_gender,
          target_age_min: filters.target_age_min,
          target_age_max: filters.target_age_max,
        },
      };
      const res = await axios.post(`${endpoint}/search_macro/`, payload);
      const data = res.data || [];
      setResults(data);
      notify.success(`${data.length.toLocaleString()}건 조회되었습니다.`);
    } catch (err) {
      console.error("검색 실패:", err);
      notify.error("검색 중 오류가 발생했습니다. 서버 연결을 확인해 주세요.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setResults([]);
  };

  return {
    filters,
    setFilters,
    results,
    loading,
    mediaOptions,
    industryOptions,
    handleSearch,
    handleReset,
  };
}

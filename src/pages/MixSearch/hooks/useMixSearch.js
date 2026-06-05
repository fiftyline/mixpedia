import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
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

const fetchMediaOptions = () =>
  axios.post(`${endpoint}/get_medias/`, {}).then((res) =>
    (res.data?.media || []).map((m) => ({ label: m, value: m }))
  );

const fetchIndustryOptions = () =>
  axios.post(`${endpoint}/get_industry/`, {}).then((res) =>
    (res.data?.industry || []).map((i) => ({ label: i, value: i }))
  );

const fetchMacro = (filters) => {
  const hasFilter =
    filters.search_text ||
    filters.media.length ||
    filters.industry.length;
  const payload = hasFilter
    ? {
        search_filter: {
          search_text: filters.search_text || "",
          media: filters.media,
          industry: filters.industry,
          target_gender: filters.target_gender,
          target_age_min: filters.target_age_min,
          target_age_max: filters.target_age_max,
        },
      }
    : {};
  return axios.post(`${endpoint}/search_macro/`, payload).then((res) => res.data || []);
};

export function useMixSearch() {
  const [filters, setFilters] = useState(initialFilters);
  const [committedFilters, setCommittedFilters] = useState(initialFilters);
  const isInitialMount = useRef(true);

  const { data: mediaOptions = [] } = useQuery({
    queryKey: ["media-options"],
    queryFn: fetchMediaOptions,
    staleTime: Infinity,
  });

  const { data: industryOptions = [] } = useQuery({
    queryKey: ["industry-options"],
    queryFn: fetchIndustryOptions,
    staleTime: Infinity,
  });

  const {
    data: results = [],
    isFetching: loading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["mix-search", committedFilters],
    queryFn: () => fetchMacro(committedFilters),
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isSuccess) {
      notify.success(`${results.length.toLocaleString()}건 조회되었습니다.`);
    }
  }, [isSuccess, results.length]);

  useEffect(() => {
    if (isError) {
      notify.error("검색 중 오류가 발생했습니다. 서버 연결을 확인해 주세요.");
    }
  }, [isError]);

  const handleSearch = () => {
    setCommittedFilters({ ...filters });
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setCommittedFilters(initialFilters);
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

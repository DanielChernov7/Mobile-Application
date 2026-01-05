import { useState, useEffect, useCallback } from 'react';
import { Cryptocurrency, Currency, SortOrder } from '../types';
import { fetchCryptoList } from '../services/api';

interface UseCryptoDataParams {
  currency: Currency;
  category: string;
  sortOrder: SortOrder;
  searchQuery: string;
}

interface UseCryptoDataResult {
  data: Cryptocurrency[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useCryptoData({
  currency,
  category,
  sortOrder,
  searchQuery,
}: UseCryptoDataParams): UseCryptoDataResult {
  const [data, setData] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(
    async (pageNum: number, isRefresh: boolean = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else if (pageNum === 1) {
          setLoading(true);
        }
        setError(null);

        const result = await fetchCryptoList({
          currency,
          category,
          sortOrder,
          page: pageNum,
          perPage: 25,
          searchQuery,
          useCache: !isRefresh,
        });

        if (pageNum === 1) {
          setData(result);
        } else {
          setData(prev => [...prev, ...result]);
        }

        setHasMore(result.length === 25);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currency, category, sortOrder, searchQuery]
  );

  // Initial fetch and when params change
  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchData(1, true);
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (!loading && !refreshing && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchData(nextPage);
    }
  }, [loading, refreshing, hasMore, page, fetchData]);

  return {
    data,
    loading,
    error,
    refreshing,
    refresh,
    loadMore,
    hasMore,
  };
}

export default useCryptoData;

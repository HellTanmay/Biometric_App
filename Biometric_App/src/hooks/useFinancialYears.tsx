// src/hooks/useFinancialYears.ts
import { useState, useEffect } from 'react';
import { getFinancialYears, FinancialYear } from '../api/financials';

export function useFinancialYears() {
    const [data, setData] = useState<FinancialYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getFinancialYears()
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error, refetch: () => getFinancialYears().then(setData) };
}

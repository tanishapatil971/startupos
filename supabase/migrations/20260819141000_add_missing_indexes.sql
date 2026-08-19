CREATE INDEX IF NOT EXISTS idx_reports_user_id_created_at
ON public.reports(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_companies_user_id
ON public.companies(user_id);

CREATE INDEX IF NOT EXISTS idx_company_memory_company_id_created_at
ON public.company_memory(company_id, created_at DESC);

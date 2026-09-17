/**
 * Normalizes a raw NoFluffJobs posting into a clean structured benchmark object.
 */
export function formatJobPosting(p) {
    if (!p) return null;

    const requirements = Array.isArray(p.tiles?.values)
        ? p.tiles.values
            .filter((t) => t.type === 'requirement' && t.value)
            .map((t) => t.value)
        : [];

    const cities = Array.isArray(p.location?.places)
        ? p.location.places.map((place) => place.city).filter(Boolean)
        : [];

    const isFullyRemote = Boolean(p.fullyRemote || p.location?.fullyRemote);

    const salary = p.salary || {};
    const seniority = Array.isArray(p.seniority) ? p.seniority.join(', ') : (p.seniority || 'Not specified');

    const jobUrl = p.url?.startsWith('http')
        ? p.url
        : `https://nofluffjobs.com/job/${p.url}`;

    return {
        title: p.title || 'Untitled Position',
        company: p.name || 'Confidential Employer',
        category: p.category || 'other',
        technology: p.technology || '',
        requirements,
        seniority,
        salaryMin: salary.from ?? null,
        salaryMax: salary.to ?? null,
        salaryCurrency: salary.currency ?? null,
        salaryType: salary.type ? (salary.type.toLowerCase() === 'b2b' ? 'B2B' : 'Permanent') : null,
        salaryPeriod: salary.period ?? 'Month',
        isFullyRemote,
        cities,
        url: jobUrl,
        postedAt: p.posted ? new Date(p.posted).toISOString().split('T')[0] : null,
        scrapedAt: new Date().toISOString(),
    };
}

/**
 * Checks if a formatted job posting satisfies the given input filters.
 */
export function matchesFilter(job, filters = {}) {
    if (!job) return false;

    // 1. Keyword search (case-insensitive substring match)
    if (filters.keyword && filters.keyword.trim().length > 0) {
        const q = filters.keyword.trim().toLowerCase();
        const inTitle = job.title?.toLowerCase().includes(q);
        const inTech = job.technology?.toLowerCase().includes(q);
        const inCompany = job.company?.toLowerCase().includes(q);
        const inReqs = Array.isArray(job.requirements) && job.requirements.some((r) => r.toLowerCase().includes(q));
        if (!inTitle && !inTech && !inCompany && !inReqs) {
            return false;
        }
    }

    // 2. Category filter
    if (filters.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase();
        if (!job.category || !job.category.toLowerCase().includes(cat)) {
            return false;
        }
    }

    // 3. Seniority filter
    if (Array.isArray(filters.seniority) && filters.seniority.length > 0) {
        const allowedLevels = filters.seniority.map((s) => s.toLowerCase());
        const jobLevels = (job.seniority || '').toLowerCase();
        const hasMatch = allowedLevels.some((lvl) => jobLevels.includes(lvl));
        if (!hasMatch) return false;
    }

    // 4. Location filter
    if (filters.location && filters.location !== 'all') {
        const targetLoc = filters.location.toLowerCase();
        if (targetLoc === 'remote') {
            if (!job.isFullyRemote) return false;
        } else {
            const hasCity = job.cities?.some((c) => c.toLowerCase().includes(targetLoc));
            if (!hasCity && !job.isFullyRemote) return false;
        }
    }

    // 5. Currency filter
    if (filters.currency && filters.currency !== 'all') {
        if (job.salaryCurrency !== filters.currency) {
            return false;
        }
    }

    // 6. Minimum Salary filter
    if (filters.minSalary && filters.minSalary > 0) {
        const salaryVal = job.salaryMin || job.salaryMax;
        if (!salaryVal || salaryVal < filters.minSalary) {
            return false;
        }
    }

    // 7. Employment Type filter
    if (filters.employmentType && filters.employmentType !== 'all') {
        const targetType = filters.employmentType.toLowerCase();
        const jobType = (job.salaryType || '').toLowerCase();
        if (!jobType.includes(targetType)) {
            return false;
        }
    }

    return true;
}

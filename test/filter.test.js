import { describe, expect, it } from 'vitest';
import { formatJobPosting, matchesFilter } from '../src/filter.js';

describe('formatJobPosting & matchesFilter', () => {
    const sampleRaw = {
        id: 'senior-python-engineer-warszawa',
        name: 'TechScale Poland',
        title: 'Senior Python / AI Engineer',
        category: 'backend',
        technology: 'Python',
        seniority: ['Senior'],
        url: 'senior-python-engineer-warszawa-123',
        salary: {
            from: 22000,
            to: 28000,
            type: 'b2b',
            currency: 'PLN',
            period: 'Month',
        },
        location: {
            places: [
                { city: 'Warszawa', street: 'Prosta 1' },
            ],
            fullyRemote: true,
        },
        fullyRemote: true,
        posted: 1787323239954,
        tiles: {
            values: [
                { value: 'backend', type: 'category' },
                { value: 'Python', type: 'requirement' },
                { value: 'FastAPI', type: 'requirement' },
                { value: 'Docker', type: 'requirement' },
            ],
        },
    };

    it('correctly normalizes raw NoFluffJobs posting', () => {
        const formatted = formatJobPosting(sampleRaw);
        expect(formatted).toBeDefined();
        expect(formatted.title).toBe('Senior Python / AI Engineer');
        expect(formatted.company).toBe('TechScale Poland');
        expect(formatted.category).toBe('backend');
        expect(formatted.technology).toBe('Python');
        expect(formatted.seniority).toBe('Senior');
        expect(formatted.salaryMin).toBe(22000);
        expect(formatted.salaryMax).toBe(28000);
        expect(formatted.salaryCurrency).toBe('PLN');
        expect(formatted.salaryType).toBe('B2B');
        expect(formatted.isFullyRemote).toBe(true);
        expect(formatted.cities).toContain('Warszawa');
        expect(formatted.requirements).toEqual(['Python', 'FastAPI', 'Docker']);
        expect(formatted.url).toContain('https://nofluffjobs.com/job/senior-python-engineer-warszawa-123');
        expect(formatted.postedAt).toBeDefined();
        expect(formatted.scrapedAt).toBeDefined();
    });

    it('matches keyword, category, and salary filters', () => {
        const job = formatJobPosting(sampleRaw);

        // Matching filters
        expect(matchesFilter(job, { keyword: 'FastAPI' })).toBe(true);
        expect(matchesFilter(job, { keyword: 'python' })).toBe(true);
        expect(matchesFilter(job, { category: 'backend' })).toBe(true);
        expect(matchesFilter(job, { seniority: ['Senior'] })).toBe(true);
        expect(matchesFilter(job, { minSalary: 20000 })).toBe(true);
        expect(matchesFilter(job, { currency: 'PLN' })).toBe(true);
        expect(matchesFilter(job, { employmentType: 'b2b' })).toBe(true);
        expect(matchesFilter(job, { location: 'remote' })).toBe(true);

        // Non-matching filters
        expect(matchesFilter(job, { keyword: 'Ruby' })).toBe(false);
        expect(matchesFilter(job, { category: 'frontend' })).toBe(false);
        expect(matchesFilter(job, { seniority: ['Junior'] })).toBe(false);
        expect(matchesFilter(job, { minSalary: 30000 })).toBe(false);
        expect(matchesFilter(job, { currency: 'EUR' })).toBe(false);
        expect(matchesFilter(job, { employmentType: 'permanent' })).toBe(false);
    });

    it('handles missing or malformed records gracefully', () => {
        expect(formatJobPosting(null)).toBeNull();
        expect(matchesFilter(null, {})).toBe(false);

        const minimal = formatJobPosting({ title: 'Junior Dev' });
        expect(minimal.title).toBe('Junior Dev');
        expect(minimal.salaryMin).toBeNull();
        expect(matchesFilter(minimal, { minSalary: 5000 })).toBe(false);
    });
});

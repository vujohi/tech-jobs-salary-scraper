import { Actor, log } from 'apify';
import { formatJobPosting, matchesFilter } from './filter.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const {
    keyword = 'Python',
    category = 'all',
    seniority = ['Junior', 'Mid', 'Senior'],
    location = 'all',
    minSalary = 0,
    currency = 'all',
    employmentType = 'all',
    maxResults = 100,
} = input;

log.info('Starting Tech Jobs & Salary Benchmark Scraper (NoFluffJobs)...', {
    keyword,
    category,
    seniority,
    location,
    minSalary,
    currency,
    employmentType,
    maxResults,
});

const API_ENDPOINT = 'https://nofluffjobs.com/api/posting';

log.info('Fetching live tech job listings from NoFluffJobs API...');

let allPostings = [];
try {
    const response = await fetch(API_ENDPOINT, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    allPostings = Array.isArray(json.postings) ? json.postings : [];
    log.info(`Successfully fetched ${allPostings.length} total live tech jobs from platform.`);
} catch (err) {
    log.error(`Failed to fetch job postings from NoFluffJobs: ${err.message}`);
    await Actor.exit({ exitCode: 1 });
}

// Filter and normalize postings
const filterCriteria = {
    keyword,
    category,
    seniority,
    location,
    minSalary,
    currency,
    employmentType,
};

let matchedCount = 0;
const batch = [];
const BATCH_SIZE = 50;

for (const raw of allPostings) {
    if (matchedCount >= maxResults) break;

    const job = formatJobPosting(raw);
    if (!job) continue;

    if (matchesFilter(job, filterCriteria)) {
        batch.push(job);
        matchedCount++;

        if (batch.length >= BATCH_SIZE) {
            await Actor.pushData([...batch]);
            log.info(`Pushed ${batch.length} jobs to dataset (Total: ${matchedCount}/${maxResults})`);
            batch.length = 0;
        }
    }
}

// Flush remaining items
if (batch.length > 0) {
    await Actor.pushData(batch);
    log.info(`Pushed final ${batch.length} jobs to dataset.`);
}

log.info(`✅ Scraping complete! Filtered ${matchedCount} matching tech positions out of ${allPostings.length} total.`);

await Actor.exit();

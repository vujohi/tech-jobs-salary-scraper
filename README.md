# Tech Jobs & Salary Benchmark Scraper (NoFluffJobs)

> 💼 **Extract real-time European & Polish tech job listings, verified salary brackets (PLN, EUR, USD), required tech stacks, and remote positions from NoFluffJobs.**

---

## 🚀 Why Use This Actor?

Finding transparent salary data in tech is notoriously difficult. **NoFluffJobs** is Central & Eastern Europe's leading IT job portal, mandating salary ranges for **100% of postings**.

This Actor provides direct, high-speed access to **18,000+ active tech vacancies** across Poland and Europe without bloated browser overhead:
- ⚡ **Ultra-Fast & Reliable**: Extracts hundreds of verified job postings in seconds via native API.
- 💰 **Transparent Salary Intelligence**: Captures exact minimum & maximum compensation, currencies (`PLN`, `EUR`, `USD`, `CHF`), contract type (`B2B` vs `Permanent`), and pay periods (`Month`, `Hour`).
- 🛠️ **Tech Stacks & Requirements**: Extracts required technologies, frameworks, and skill tags for each role.
- 🌍 **Remote & Location Filters**: Filter by `Remote`, hybrid, or specific European cities (`Warszawa`, `Kraków`, `Wrocław`, `Poznań`, `Gdańsk`, `Berlin`, etc.).
- 🎯 **Advanced Screening**: Filter by minimum salary threshold, seniority level (`Junior`, `Mid`, `Senior`, `Expert`), category, and technology keywords.

---

## 🎯 Use Cases

- **Recruitment & HR Tech**: Sync real-time job openings into custom ATS platforms and talent portals.
- **Salary Benchmarking**: Build interactive market salary calculators and quarterly compensation reports.
- **Job Aggregators & Alerts**: Power Telegram / Discord tech job bots or niche job board newsletters.
- **Competitor Hiring Intelligence**: Monitor tech stacks and hiring volume across top tech companies.

---

## 📥 Input Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `keyword` | String | `"Python"` | Filter by tech keyword, skill, or title (e.g. `Python`, `React`, `DevOps`, `AI`, `FastAPI`). |
| `category` | String | `"all"` | Category: `backend`, `frontend`, `fullstack`, `devops`, `mobile`, `data`, `ai`, `qa`, `security`. |
| `seniority` | Array | `["Junior", "Mid", "Senior"]` | Seniority levels: `Trainee`, `Junior`, `Mid`, `Senior`, `Expert`. |
| `location` | String | `"all"` | City or remote: `all`, `remote`, `warszawa`, `krakow`, `wroclaw`, `gdansk`, `poznan`, `katowice`. |
| `minSalary` | Integer | `0` | Minimum monthly salary threshold (e.g. `15000`). |
| `currency` | String | `"all"` | Currency: `all`, `PLN`, `EUR`, `USD`, `GBP`, `CHF`. |
| `employmentType` | String | `"all"` | Contract type: `all`, `b2b`, `permanent`. |
| `maxResults` | Integer | `100` | Maximum number of matched postings to export (up to `2000`). |

### Example Input JSON:
```json
{
  "keyword": "FastAPI",
  "category": "backend",
  "seniority": ["Mid", "Senior"],
  "location": "remote",
  "minSalary": 18000,
  "currency": "PLN",
  "employmentType": "b2b",
  "maxResults": 50
}
```

---

## 📤 Output Dataset Format

Each record contains rich, standardized data:

```json
{
  "title": "Senior Python / AI Engineer",
  "company": "TechScale Solutions",
  "category": "backend",
  "technology": "Python",
  "requirements": [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Docker"
  ],
  "seniority": "Senior",
  "salaryMin": 22000,
  "salaryMax": 28000,
  "salaryCurrency": "PLN",
  "salaryType": "B2B",
  "salaryPeriod": "Month",
  "isFullyRemote": true,
  "cities": ["Warszawa", "Remote"],
  "url": "https://nofluffjobs.com/job/senior-python-engineer-warszawa",
  "postedAt": "2026-08-20",
  "scrapedAt": "2026-09-17T15:23:30.454Z"
}
```

---

## 🐍 Python Integration

```python
from apify_client import ApifyClient

client = ApifyClient("YOUR_APIFY_TOKEN")

# Run the Actor
run = client.actor("vujofix/tech-jobs-salary-scraper").call(run_input={
    "keyword": "DevOps",
    "location": "remote",
    "minSalary": 20000,
    "currency": "PLN",
    "maxResults": 100
})

# Fetch clean salary benchmark dataset
for job in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f"{job['title']} @ {job['company']}: {job['salaryMin']} - {job['salaryMax']} {job['salaryCurrency']} ({job['salaryType']})")
```

---

## 💰 Pricing

- **Pay-Per-Event**: **\$3.00 / 1,000 job postings**
- Incredibly cost-effective: Fetch 200 targeted job listings with verified salaries for just **\$0.60**.

---

## 🛡️ License

Apache-2.0

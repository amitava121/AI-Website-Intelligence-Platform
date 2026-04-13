# Lumina AI — Website Overview & Product Documentation

## 1) What this website is

Lumina AI is a **website intelligence experience** designed to help teams compare their website against a competitor and quickly identify where they can improve.
The product presents a guided flow from discovery to analysis results, with emphasis on clarity, visual diagnostics, and actionable optimization insights.

In simple terms: users enter two website URLs, run an analysis, and receive a structured comparison report across SEO, performance, and UX quality signals.

---

## 2) Primary goal

The core objective of the website is to answer:

> “How does my website perform versus a competitor, and what should I fix first?”

The interface is designed to reduce complexity by:

- Guiding users step-by-step through a single analysis journey.
- Showing side-by-side metric comparisons.
- Highlighting optimization opportunities and risk areas.
- Making progress/status visible while analysis runs.

---

## 3) Intended audience

This website is suitable for:

- Founders and product teams evaluating website quality.
- Marketing and SEO teams tracking visibility and speed.
- UX teams interested in friction and experience quality.
- Agencies and consultants preparing competitive audits.

---

## 4) End-to-end user journey

The product flow is linear and easy to follow:

1. **Landing / Introduction**
   User sees value proposition and can start analysis.

2. **Comparison Input**
   User enters:
   - Their website URL
   - Competitor website URL

3. **Analysis in Progress**
   User sees a live progress screen with staged status indicators.

4. **Results Dashboard**
   User receives comparative metrics, trend visuals, roadmap items, and detailed table breakdown.

5. **Follow-up Action**
   User can start a new analysis from the results area.

---

## 5) Page-by-page documentation

### A) Home View

Purpose:

- Introduce Lumina AI positioning and benefits.
- Encourage users to begin analysis.

What users can do:

- Click **Start Analysis** to begin.
- Explore high-level value pillars:
  - SEO Architecture
  - Core Vitals
  - UX Intelligence
- Review “Three Steps to Intelligence” process explanation.

Expected outcome:

- User understands the value quickly and moves to URL comparison.

---

### B) Comparison View

Purpose:

- Collect the two URLs needed for benchmarking.

Inputs:

- **Your Website URL**
- **Competitor Website URL**

Primary action:

- **Analyze Architecture**

Supporting context shown on this page:

- Deep indexing capability
- Latency delta comparison focus
- Encrypted audit positioning

Expected outcome:

- User submits comparison request and proceeds to processing state.

---

### C) Loading / Processing View

Purpose:

- Communicate that analysis is running and not frozen.

What is displayed:

- Percentage completion bar.
- Stage cards with status transitions:
  - Scraping Data
  - Running Analysis
  - Generating Insights
- Active/waiting/done progression.

Expected outcome:

- User remains informed and confident while waiting.

---

### D) Results View

Purpose:

- Present actionable comparison intelligence.

Major sections:

- **Top summary metrics (side-by-side):**
  - SEO Authority
  - Performance
  - UX Friction
- **Growth trajectory section:**
  Comparative trend visual over time.
- **Optimization roadmap (your site):**
  Priority items to improve.
- **Critical gaps (competitor):**
  Weak points identified in competitor profile.
- **Deep metric breakdown table:**
  Metric name, current score, target, and deviation.

Available actions:

- Download report controls (UI-level action).
- Start **New Analysis** from sidebar.

Expected outcome:

- User understands competitive position and knows next optimization steps.

---

## 6) Core product capabilities

The website communicates these core capabilities:

- **Comparative intelligence** across two domains.
- **Performance and SEO diagnostics** in one experience.
- **UX signal visibility** through high-level friction scoring.
- **Prioritized insights** instead of raw data only.
- **Structured reporting view** for decision-making.

---

## 7) Navigation and interaction model

### Top navigation

- Brand/home return action.
- Login trigger (toggles into logged-in state).
- Context actions in results (download icon behavior on scroll).

### Footer navigation

- Standard trust links (Privacy, Terms, API, Status).

### Results sidebar

- Dashboard context tabs (Dashboard, Analytics, Nodes, Security).
- Quick action for starting another analysis.

---

## 8) States and transitions

The interface currently uses four primary UI states:

- `home`
- `comparison`
- `loading`
- `results`

Transition path:

- Home → Comparison → Loading → Results

Additional session state:

- Logged-out / logged-in visual state controlled by a login action.

---

## 9) Data presentation model (what users see)

The results experience combines three information layers:

1. **At-a-glance score comparison** for immediate understanding.
2. **Visual trend context** to show relative momentum.
3. **Granular metric table and issue cards** for concrete follow-up action.

This layered model helps both executive readers (quick summary) and operators (detailed tasks).

---

## 10) Expected user outcomes

After using the website, users should be able to:

- Identify whether they lead or lag versus a competitor.
- Spot the most urgent optimization opportunities.
- Understand technical quality signals in clear business terms.
- Repeat analysis for iterative improvement cycles.

---

## 11) Content and messaging style

The product voice emphasizes:

- Precision
- Confidence
- Intelligence-led guidance
- Premium, modern visual communication

This style is reflected across hero messaging, process labels, and insight summaries.

---

## 12) Current scope notes

This implementation is currently focused on **front-end experience and product storytelling** of the analysis journey.
The visible reports and metrics are presented as part of the interface flow and demonstration of the intended user experience.

---

## 13) Quick run instructions

If you want to preview the website locally:

1. Install dependencies.
2. Start the development server.
3. Open the local URL in your browser.

Use the UI flow in this order for best demo coverage:

- Home → Start Analysis → Enter URLs → Analyze → View Results.

---

## 14) Summary

Lumina AI provides a focused website-intelligence journey that turns a simple two-URL input into a clear, visual, and actionable competitive analysis experience.

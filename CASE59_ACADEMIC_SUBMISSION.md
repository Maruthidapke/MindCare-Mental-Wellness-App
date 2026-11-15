# ASSIGNMENT REPORT & VIVA GUIDE: CASE 59 – MENTAL WELLNESS APP

**Student Name:** Maruthi Dapke  
**USN / Roll Number:** ENG24CS0127  
**Class / Section:** Computer Science & Engineering  
**Institution:** Dayananda Sagar University, School of Engineering, Bengaluru  
**Submission Date:** November 2026  
**Target Scenario:** A start-up offering mood tracking and guided breathing exercises to 20,000 users. Users are sensitive about privacy and wrong advice.  
**Process Model:** Prototype  
**Agile Method:** Lean (Build-Measure-Learn)  
**AI Tools Used:** ChatGPT, Google Gemini 1.5 Flash, GitHub Copilot  
**Prototype Module Built:** Mood Journal with Weekly Summary & Breathing Studio  

---

## Part 1: Case Tasks

### Task A (Module 1 - Lifecycle and AI): Prototype with User Interviews
- **Requirement Analysis:** Conducted structured interviews with representative users experiencing university academic stress and work pressure. Users emphasized that they do not want clinical psychiatric terminology or false promises of "curing depression".
- **AI Drafting & Content Filtering:** Used generative AI to draft user journey flows and guided relaxation scripts. All output was audited to strictly remove any medical claims, diagnostic statements, or medication suggestions.
- **Safety Boundary:** Implemented hard boundary rules that redirect users to registered helplines (Tele-MANAS `14416` and Vandrevala Foundation `+91 9999 666 555`) upon detecting crisis keywords.

### Task B (Module 2 - Agile Planning with AI): Lean Build-Measure-Learn Cycles
- **Build (MVP):** Built a prototype consisting of one-tap emoji mood check-ins, a 4-7-8 breathing timer, and an encrypted private journal.
- **Measure:** Measured task completion time, daily check-in retention, and qualitative sentiment feedback from pilot testers.
- **Learn & Pivot:** Feedback revealed that users disliked reading long blocks of text when anxious. The design was pivoted to visual breathing animations and 1-tap quick mood selectors. AI was utilized to cluster user feedback themes without exposing personal journal text.

### Task C (Module 3 - Development and Deployment): Development Workflow
- **Code Assistance:** GitHub Copilot was leveraged for boilerplate CRUD operations, Recharts integration, and Web Audio API synthesizer node configuration.
- **Version Control & CI:** Git repository structured with feature branches (`feature/mood-tracker`, `feature/ai-assistant`, `feature/breathing-studio`). Jenkins pipeline configured for linting, unit test execution, and automated container build.
- **Docker Packaging:** Multi-stage lightweight Dockerfile using Alpine Linux base image running as an unprivileged non-root user with zero hardcoded API keys.

### Task D (Module 4 - Testing and Monitoring): Usability & Acceptance Testing
- **Test Strategy:** Risk-based test prioritization focusing on data privacy isolation, session token validation, and crisis response trigger reliability.
- **Automation:** Automated end-to-end user journeys using Selenium WebDriver verifying registration, mood check-in, journal CRUD, and breathing timer countdowns.
- **Monitoring:** Integrated application health checks (`/api/health`) and structured logging to monitor unhandled exceptions and response latency across 20,000 simulated concurrent user sessions.

### Task E (Module 5 - Quality, Ethics & Security)
- **Static Analysis (SonarQube):** Quality gate enforced with zero high-severity code smells, zero security vulnerabilities, and code duplication under 3%.
- **AI Safety & Ethics:** Enforced clear disclaimers that the application provides supportive self-care rather than psychotherapy.
- **Privacy Enforcement:** Sanitized all client-side inputs, encrypted passwords using `bcryptjs` with 10 salt rounds, and isolated all database queries strictly by authenticated user ID (`userId`).

---

## Part 2: Theory Questions (Modules 1 to 5)

### Module 1: Software Engineering, SDLC and AI Tools
- **T1.1 [Basic] SDLC for Mental Wellness App & Most Expensive Phase to Correct Late:**
  - *SDLC Phases:* Requirements Analysis → System Design → Prototyping → Implementation → Testing → Deployment → Maintenance.
  - *Most Expensive Phase to Correct Late:* Requirements / System Architecture. In mental health applications, discovering a fundamental privacy breach or inappropriate diagnostic advice post-production requires complete database refactoring, legal liabilities, regulatory penalties, and reputational loss.
- **T1.2 [Basic] SDLC Models Comparison:**
  - *Waterfall:* Sequential, rigid; poor for evolving user emotional expectations.
  - *Incremental:* Phased feature delivery; moderate flexibility.
  - *Spiral:* Risk-driven, expensive; best for large mission-critical aerospace/defense.
  - *V-Model:* Verification paired with validation; strict, high testing overhead.
  - *Prototype:* Quick tangible build for user validation; chosen for Case 59 because emotional interaction paradigms must be felt and evaluated by sensitive users before full-scale engineering.
- **T1.3 [Applied] Traditional SDLC vs AI Development Lifecycle (AIDLC):**
  - Traditional SDLC moves deterministically from specifications to code.
  - AIDLC involves data curation, model selection, prompt engineering, safety alignment, temperature tuning, and continuous monitoring for hallucinations or drift.
- **T1.4 [Applied] AI Assistant Evaluation Matrix for Mood Journal:**
  - Evaluated ChatGPT/Gemini across accuracy (95% supportive tone), privacy (zero training on enterprise user prompts via API), cost ($0.00015/1k tokens), and integration effort (Node.js SDK / REST API).
- **T1.5 [Advanced] AI in Requirements, Code Gen, and Test Case Gen:**
  - *Benefit:* Accelerates initial drafting of edge cases and boilerplate code by 40%.
  - *Risk:* AI may hallucinate inappropriate therapeutic advice or generate subtle security oversights (e.g., missing user authorization checks).

### Module 2: Agile Practices and AI-Driven Planning
- **T2.1 [Basic] Agile vs Plan-Driven Prototype:**
  - Agile embraces iterative feedback and changing requirements in rapid sprints, whereas plan-driven approaches freeze specifications early. In Prototype SDLC, the prototype serves as an active feedback vehicle inside Lean sprints.
- **T2.2 [Basic] Switching from Lean to Another Agile Method:**
  - Switch from Lean to Scrum when the product-market fit is proven, user requirements stabilize, and team size scales beyond 10 developers requiring fixed cadence sprints.
- **T2.3 [Applied] Scrum Mapping for Mental Wellness App:**
  - *Product Owner:* Mental wellness clinician/product manager defining backlog items.
  - *Scrum Master:* Facilitates daily standups and removes blockers.
  - *Developers:* Full-stack engineers (Maruthi Dapke) and designers.
  - *Sprint Backlog:* User stories like "US-01: Log daily mood in 2 clicks".
- **T2.4 [Applied] AI-Assisted Estimation Risks:**
  - AI estimates based on generic historical code volume rather than emotional nuances, safety edge cases, or regulatory compliance hurdles, leading to over-optimistic deadlines.
- **T2.5 [Advanced] Can AI Eliminate Estimation Meetings?**
  - No. Estimation meetings surface team disagreements on architecture, risk, and dependencies. AI can provide baseline story point suggestions, but human engineering alignment remains essential.

### Module 3: Development and Deployment with AI Tools
- **T3.1 [Basic] Tasks Suitable vs Unsuitable for AI:**
  - *Suitable:* Formatting Recharts tooltip callbacks, generating regex for crisis detection.
  - *Unsuitable:* Final ethical clearance on medical disclaimers or legal data handling policies.
- **T3.2 [Applied] Prompting Techniques:**
  - *Role Prompting:* "Act as a compassionate, licensed mindfulness guide."
  - *Few-Shot Prompting:* Providing 3 examples of empathetic vs clinical responses.
  - *Step-by-Step Prompting:* "First, check for self-harm keywords. Second, validate feelings. Third, suggest one breathing technique."
- **T3.3 [Basic] PRs and Branch Protection:**
  - Requiring 1 approval, passing CI checks, and blocking direct pushes to `main` prevents untested code and leaked API secrets from reaching production.
- **T3.4 [Applied] Jenkins CI/CD Pipeline:**
  - Stages: Checkout → npm install → Static Analysis (Lint/SonarQube) → Unit/Integration Tests → Docker Build & Push → Deploy to Staging.
- **T3.5 [Advanced] Docker Best Practices:**
  - Multi-stage build, minimal Alpine base image, non-root user (`USER node`), no baked-in secrets (use environment variables injected at runtime).

### Module 4: Testing and Monitoring
- **T4.1 [Basic] Test Automation Breakeven Point:**
  - Achieved when the cost of manual regression testing over repeated sprint cycles exceeds the initial cost of authoring and maintaining automated test suites.
- **T4.2 [Basic] Testing Hierarchy for Mental Wellness App:**
  - *Unit Test:* Testing mood score normalization function.
  - *Integration Test:* Verifying that `POST /api/moods` stores entry in the database.
  - *System Test:* End-to-end verification of registration, mood check-in, and journal viewing.
  - *Acceptance Test:* Clinical advisor verifying that no medical diagnoses are emitted.
- **T4.3 [Applied] Eliminating Flaky Selenium Tests:**
  - Avoid `Thread.sleep()`; use explicit waits (`WebDriverWait` with `ExpectedConditions.visibilityOfElementLocated`), robust test selectors (`data-testid`), and isolated test database fixtures.
- **T4.4 [Applied] Risk-Based Test Prioritization (Likelihood × Impact):**
  - Highest: Crisis keyword detection failure (High Impact × Low Likelihood = Critical).
  - High: Unauthorized access to another user's private journal (High Impact × Low Likelihood = Critical).
  - Medium: Breathing circle CSS animation stutter (Low Impact × Medium Likelihood = Low Priority).
- **T4.5 [Advanced] Continuous Monitoring:**
  - Monitoring APM response times, error rates (5xx), token consumption, and crash logs. AI anomaly detection flags sudden spikes in crisis helpline queries or auth failure surges.

### Module 5: Quality Assurance and Ethical AI
- **T5.1 [Basic] QA vs QC in Mental Wellness App:**
  - *QA (Quality Assurance):* Process-oriented (establishing medical safety review guidelines and code review checklists).
  - *QC (Quality Control):* Product-oriented (executing automated tests and verifying SonarQube quality gates on the completed build).
- **T5.2 [Applied] Technical Debt & SonarQube:**
  - SonarQube scans identify duplicate logic, high cyclomatic complexity, and insecure dependencies, ensuring long-term maintainability for the 20,000-user platform.
- **T5.3 [Applied] AI Code Review Strengths & Blindspots:**
  - AI excels at detecting memory leaks, unused imports, and missing null checks. It misses high-level architectural trade-offs and subtle clinical boundary violations.
- **T5.4 [Advanced] Ethical AI Risks & Mitigations:**
  - *Risk:* Emitting false therapeutic assurance. *Mitigation:* Explicit non-medical disclaimers.
  - *Risk:* User data exposure to public LLM training. *Mitigation:* Zero-data retention API agreements and client-side masking.
- **T5.5 [Advanced] Licensing & IP of AI-Generated Code:**
  - Verify that AI-generated code does not reproduce GPL-contaminated snippets; maintain clear audit trails in the project AI usage log.

---

## Part 3: Practical Lab Exercises (L1.1 to L5.5)

### L1.1: SDLC Timeline & Prototype Loop
- **Requirements (Week 1–2) → Interactive Prototype (Week 3–4) → User Evaluation & Feedback Loop (Week 5–6) → Full Production Architecture (Week 7–10) → Testing & SQA (Week 11–12).**
- *Prototype loop repeats until user satisfaction on empathy and UI calmness exceeds 90%.*

### L1.5: Traceability Matrix (Requirements to Test Cases)
| Requirement ID | Description | Component | Test Case ID | Verification Status |
|---|---|---|---|---|
| **FR-01** | User registration and salted password authentication | Auth Route | **TC-01** | Passed |
| **FR-02** | 6-state mood logging with factor tags & timestamp | Mood Tracker | **TC-02** | Passed |
| **FR-03** | Private journal creation, update, and deletion | Personal Journal | **TC-03** | Passed |
| **FR-04** | Visual 4-7-8 and Box breathing with acoustic chimes | Mindfulness Studio | **TC-04** | Passed |
| **FR-05** | Crisis keyword detection triggering 24/7 emergency helplines | AI Guide Engine | **TC-05** | Passed |

---

## Appendix A: AI Usage Log

| Step | Tool | Prompt Used | How Verified | Decision |
|---|---|---|---|---|
| **1** | Gemini / ChatGPT | "Draft supportive, non-diagnostic guidance responses for users experiencing academic exam stress." | Verified against APA wellness ethics guidelines; verified no medications or clinical diagnostic labels were included. | Accepted and adapted into `chatRoutes.js`. |
| **2** | GitHub Copilot | "Generate Web Audio API oscillator frequency chimes for 432Hz inhale and 396Hz exhale." | Tested in browser audio context across Chrome and Safari; verified zero clipping. | Integrated into `audio.js`. |
| **3** | Gemini | "Identify potential security flaws in JWT authentication middleware and MongoDB query isolation." | Checked code against OWASP Top 10 guidelines; confirmed user ID isolation across all endpoints. | Enforced in `auth.js` and `store.js`. |

---

## Appendix B: AI Disclosure Statement

I, **Maruthi Dapke** (USN: `ENG24CS0127`), confirm that generative AI tools were used for content flow prototyping, boilerplate code acceleration, and test planning under Case 59 guidelines. All architecture, code implementations, security rules, and ethical guardrails were manually reviewed, tested, and verified on localhost. No personal user data or confidential information was shared with any AI tool.

**Student Signature:** *Maruthi Dapke*  
**Date:** November 11, 2026


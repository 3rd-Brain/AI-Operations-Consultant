# Framework Summaries for Agent System Prompt

Compressed reference for the AI Ops Consultant agent. Each framework is summarized for classification, diagnosis, and recommendation — not for teaching. Source material lives in the chapter files alongside this document.

---

## 5 Levels of Digital Operations

Maturity model for digital operations. Classify by three axes: Software, Workflow Documentation, Data Management. Each level implies a People->Process->Tools alignment state. Level 3 is the critical threshold — the flywheel starts here.

### Level 1: Information Silos

Independent operations. Processes aren't defined — they exist in people's heads. Tools are often non-existent or chosen ad hoc without considering the whole company. Manual workarounds fill every gap.

- Software: May not exist; where it does, analog/paper/disconnected digital tools that cannot be integrated
- Documentation: Lives in employees' heads; maybe some checklists written down
- Data: Scattered databases, no standards, no management processes
- P->P->T: Misaligned — process undefined, tools absent or chosen before people or process
- Signals: no documented training plan, team resists new technology, no designated process owners, no technical talent access, core processes undocumented, no central doc storage, no step-by-step instructions, data entered manually everywhere, no validation or automation, no single source of truth

### Level 2: Connectable Cloud

Cloud-based tools have been chosen and are capable of integration, but aren't connected yet. Basic documentation starts to emerge. A starting point for most companies and a quick stop on the way to Level 3.

- Software: Cloud-based, integration-capable via API, not yet connected
- Documentation: Basic docs emerging; some high-level processes mapped
- Data: CRM, ERP, accounting chosen — data not cleaned
- P->P->T: Uneven — training on individual tools without connecting workflows together
- Signals: multiple apps that don't communicate, "remote first" but juggling disconnected tools, some process docs exist but aren't followed consistently, departments share data manually, software licenses managed but access uneven

### Level 3: Unified Data Layer

The tipping point. Core workflows are unified, systems talk to each other, and the team operates from a single source of truth. This is where the flywheel starts — Consistency unlocks Clarity unlocks Capacity. Everything before Level 3 is foundation-building. Everything after it is acceleration. Companies can and do use AI tools before Level 3, but the returns compound once this foundation is in place.

- Software: Integrated cloud-based tools with single points of truth for data
- Documentation: Systems map documentation for workflows and data; clear organizational structure
- Data: Customer and key ops data cleaned and consistent; single sources of truth chosen and enforced
- P->P->T: Aligned — first full People->Process->Tools cycle complete. Team understands roles, follows documented processes, uses integrated tools that support those processes
- Ownership: Designated owners for digital processes exist; someone is accountable for data quality
- Adoption: Team members are actually operating inside the integrated systems, not running parallel spreadsheet/email workflows alongside them. The majority of L2->L3 transition time is education and adoption, not technical integration.
- Flywheel readiness signals: the stronger these are, the closer to true Level 3
  - Data flows between core systems without manual export/import
  - Data is consistently formatted across systems
  - There is a single source of truth for key data (per business domain)
  - Core processes are documented with step-by-step instructions
  - Documentation is stored centrally and kept current
  - Documentation is verifiably followed — not just written
  - New team members can follow processes without extensive tribal knowledge transfer
  - Key software tools are connected and share data
  - Reports on key operational data can be generated and trusted
- Signals: "we all look at the same system," reduced copy/paste between tools, onboarding is process-driven not shadow-a-person, integrations handle handoffs between departments, no parallel spreadsheet workflows running alongside the official system

### Level 4: Automated Workflows

Machines doing human work — progressively. Level 3 unified your data and connected your systems. Level 4 automates entire workflows end-to-end on top of that foundation, not just individual tasks or multi-step sequences. The big shift is in documentation: SOPs go from detailed enough for humans to detailed enough for machines, with decision trees and edge case handling. Automation is iterative — humans handle edge cases early on, fewer with each version. Companies typically reach Level 4 one department or workflow at a time, not company-wide.

- Software: Automated tools handle entire workflows, operated and overseen by humans
- Documentation: Detailed process maps with decision trees for machine execution — the documentation leap is the gate, not the tooling
- Data: Customer and operational data cleaned regularly; 100% vital data clarity
- P->P->T: Advanced — requires process documentation detailed enough for machines, including decision trees and escalation paths for edge cases
- Measurement: Key automated workflows have defined KPIs — cycle time, exception rate, automation coverage — actively tracked
- Signals: trigger causes the outcome without a human touching the middle steps, 20-30% of routine work handled by rules-based or AI-driven automation, most remote-capable work moved to global team or automated, staff focused on strategic/creative work instead of process execution, real-time dashboards and BI reporting active, capacity gains of 10-20x on specific automated workflows, edge case escalation paths are designed not improvised

### Level 5: AI Automation

The shift from efficient operations to intelligent operations. Level 4 automated workflows with humans overseeing execution — Level 5 adds AI judgment, making systems that handle variation, learn from outcomes, and adapt to changing conditions. Humans shift from workflow execution to exception review and strategic direction. Often takes the form of internal tools built for workflow-specific needs. Requires a second People->Process->Tools cycle with specialized AI talent. Clean, high-quality data sets are prerequisite and can take months to build. May require fine-tuning or advanced AI implementation.

- Software: AI-integrated tools using business-specific models; as automated as safely possible
- Documentation: Comprehensive, including edge cases and exceptions — written for AI training, not just human execution
- Data: Data management is fully automated for all possible processes
- P->P->T: Mastery — second cycle complete with specialized talent (AI/automation specialists). Comprehensive processes including edge cases. Advanced AI tools operating with human-on-the-loop oversight
- Human role: Exception review, strategic direction, and governance — not workflow execution. Built-in escalation paths and audit trails so AI decisions are explainable and overridable
- Signals: AI handles variation and edge cases not just predefined rules, systems improve over time based on outcomes, scale exponentially without proportional hiring, majority of remote-capable processes automated, humans focus on judgment creativity and relationships, workflow-specific AI tools built for company needs, improved cashflow and profit margins

---

## Three Cs: Consistency -> Clarity -> Capacity

The results framework. The 5 Levels describe where you are; the Three Cs describe what you get as you level up. They're a chain reaction — without Consistency, Clarity is impossible; without Clarity, you can't confidently grow Capacity.

**Consistency** — fewer errors, standardized data formats, uniform workflows. Everyone follows the same playbook. Results become tangible around Level 2 when you begin documenting processes and selecting tools. Level 3 is when Consistency gets amplified as organized data unlocks analytics and reporting.
- Signals: single source of truth eliminates duplication, standardized naming conventions, new hires get the same onboarding experience regardless of which team member helps them, documentation is followed not just written
- Also unlocks: resilience (reduced key-person dependency), service reliability (clients experience consistent delivery)

**Clarity** — real-time visibility, accurate reporting, trust in data. Once data is consistently entered, you unlock dashboards that update automatically and anomaly detection. Level 3 is when Clarity occurs — unified data removes copy/paste and duplication between tools and teams.
- Signals: decisions made in minutes not "let's meet next week when the spreadsheet is done," everyone sees the same scorecard, conversations focus on solutions not debating whose numbers are right
- Also unlocks: decision speed, and the Executive C — **Confidence**. Leadership sees reliable data, makes bolder moves, spots opportunities earlier.

**Capacity** — freed from repetitive tasks, teams handle more work with the same headcount. Some benefits at Level 3 from data automation, but major gains come with workflow automation at Level 4. Can reach 10-20x on specific automated workflows.
- Signals: automation handles repetitive tasks, data-driven resource allocation, growth doesn't require proportional hiring, staff focused on strategic work not data entry
- Also unlocks: the Executive C — **Cashflow**. Fewer errors mean less overhead. Faster decisions boost revenue. Expanded capacity without proportional hiring improves margins.

---

## 5 Pillars of Digital Operations

The capabilities framework. The 5 Levels tell you where you are, the 3 Cs tell you what you get — the 5 Pillars tell you what to build. Organized as three foundational pillars and two advanced pillars. The foundational pillars map directly to People->Process->Tools. All three foundational pillars must function together for Level 3 — focusing on one or two leaves gaps. P->P->T applies within each pillar: define roles first, document processes second, then implement or configure technology.

**Pillar 1: Talent Strategy (People)**
Build a flexible, digitally-capable workforce equipped and motivated to execute workflows effectively.
- Sub-components: Team Structure, Skills Development, Training & Adoption
- Failure signals: no designated owner for digital systems (finger-pointing when problems arise), team uses 10% of tool capabilities or avoids them entirely, parallel processes running alongside official systems (spreadsheets next to the CRM)
- Assessment: Are roles clearly defined? Is there a skills development plan? Are people actually using the digital tools effectively?

**Pillar 2: Workflow Optimization (Process)**
Create standardized, efficient workflows that eliminate mundane tasks, reduce errors, and free up creative energy.
- Sub-components: Process Mapping, Automation Design, Efficiency Optimization
- Failure signals: tribal knowledge lost when key people leave, 15+ hours/week manually copying data between systems, simple approvals requiring multiple emails/meetings/signatures, workarounds becoming standard practice
- Assessment: Are core workflows documented clearly? Are repetitive low-judgment tasks automated? Do we regularly review and improve processes?
- Warning: actually see how work is done, don't just trust the narrator. Premature automation of unstable processes makes things worse.

**Pillar 3: Digital Architecture (Tools)**
Design an integrated, modular system that ensures data consistency and seamless handoffs between platforms.
- Sub-components: System Design, Data Infrastructure, Tool Integration
- Failure signals: no coherent blueprint for how systems connect, client data scattered across CRM/Dropbox/email/analytics with no complete picture, staff copying data between systems for hours
- Assessment: Do we have a clear blueprint for how systems connect? Is critical data stored and organized consistently? Are key applications connected to share data?

**Pillar 4: Knowledge Management**
Integrate documentation, processes, and work management so every team member can find what they need quickly. The operational prerequisite for effective AI — you can't train or prompt AI systems on tribal knowledge. Companies use KM at any level, but the flywheel between KM and AI compounds once foundational pillars are in place.
- Sub-components: Documentation, Business Intelligence, Process Standards
- Failure signals: documentation outdated as processes evolve, manual reporting taking days/weeks to compile, inconsistent approaches to file naming/task management/client communications across teams
- Assessment: Is documentation accessible and up-to-date? Can we easily see and analyze key performance data? Do we have consistent guidelines everyone follows?

**Pillar 5: AI Automation**
Go beyond basic automation to leverage intelligent systems that enhance prediction, personalization, or generative tasks. Companies deploy AI tools at every level — but the returns compound with a stronger foundation underneath.
- Sub-components: AI Tool Selection, System Deployment, Automation Enhancement
- Failure signals: AI tools that don't integrate becoming expensive shelf-ware, staff manually transferring data between AI and operational systems, rigid rule-based automation requiring constant manual adjustment
- Assessment: Have we identified the right AI tools for our needs? Are AI tools integrated into daily operations? Do we use AI to give automated workflows basic intelligence?
- Warning: AI hallucinations from poor training data, over-automation of decisions requiring human judgment, black-box implementations where outputs can't be explained

---

## People -> Process -> Tools & The Digital Operations Flywheel

**People -> Process -> Tools** is the implementation sequence. It applies at every level, within every pillar, and across both cycles of digital operations maturity. The order matters: define who does the work and build their skills (People), then document and standardize how the work flows (Process), then select and integrate the technology (Tools). Reversing this order — buying tools before defining process or preparing people — is the most common failure pattern in digital operations.

- First cycle (Levels 1-3): Generalist talent, documented workflows, integrated cloud tools. Gets you to a unified data layer.
- Second cycle (Levels 4-5): Specialized talent (AI/automation), machine-readable documentation with decision trees, advanced AI tools. Gets you to intelligent operations.
- P->P->T applies within each pillar, not just across them. Before configuring a new CRM (Tools), document what the sales workflow should be (Process), and make sure the team is trained and bought in (People).
- The most common failure: users jump to Tools first. They buy software before defining process or preparing people. The result is shelf-ware, workarounds, and parallel systems running alongside the official one.

**The Digital Operations Flywheel** is what happens when P->P->T completes its first cycle at Level 3. It's a self-reinforcing loop:

Consistency -> Clarity -> Capacity -> (reinvest in) Consistency -> ...

At Level 3, standardized workflows and integrated systems create Consistency. Consistency unlocks Clarity — real-time visibility and trusted data. Clarity enables Capacity — freed from repetitive work, teams handle more with the same headcount. That freed capacity gets reinvested into further standardization and optimization, spinning the flywheel faster.

At Levels 4 and 5, automation and AI supercharge each phase of the loop. The flywheel doesn't start at Level 3 — companies build momentum earlier — but Level 3 is where it becomes self-reinforcing. The first mission for any user: get to Level 3. The flywheel follows from there.

---

## KOODAR: AI Capabilities Framework

The vocabulary for describing what AI tools and agents can do — and the structure for documenting them. KOODAR serves two purposes: (1) a capabilities checklist for assessing or designing any AI tool/agent, and (2) a prompt and documentation structure where each letter becomes a section of the role document or system prompt.

**The letters (each is a capability):**
- **K** (Know) — What does it have access to? The knowledge layer.
- **O** (Observe) — What can it see happening right now?
- **O** (Orient) — What does that mean, given history + context + objectives?
- **D** (Decide) — What calls can it make within defined boundaries?
- **A** (Act) — What can it do? What tools/actions are available?
- **R** (Review) — How does it evaluate outcomes and adjust?

**K is foundational.** Every other capability requires it. You can't observe without knowing what you're looking at. You can't decide without information to decide on. Monitoring without a knowledge layer is a dashboard, not AI labor.

**These are capabilities, not strict levels.** A given tool or agent implements the combination of capabilities it needs — not every system must climb K -> KA -> KDA -> KDAR -> KODAR -> KOODAR in sequence. Assess what capabilities the workflow requires, then build to that spec.

**Common capability combinations:**

**K — Knowledge access**
Information retrieval from a defined corpus. No action, no judgment.

**KA — Knowledge + Action**
AI-assisted retrieval driving a rule-based or human-defined action. The decision logic is predetermined — AI finds the right info.

**KDA — Knowledge + Decide + Act**
Single-task AI labor with embedded judgment. 1 input -> 1 process -> 1 output. The microservice pattern.

**KDAR — Knowledge + Decide + Act + Review**
A microservice with a closed feedback loop. Tracks outputs against criteria, adjusts over time.

**KODAR — Knowledge + Observe + Decide + Act + Review**
Adds observation capability — can monitor state and respond to signals. Does not mandate continuous watching; may observe on-demand or on-schedule.

**KOODAR — Full capabilities (The Coworker)**
Adds Orient — situational awareness interpreting observations against history, baselines, and strategic objectives. Can own a role end-to-end.

**As prompt/documentation structure:** When building any AI tool or agent, use the KOODAR letters as sections of the system prompt or role document. Each section answers its letter's question. Not every section is required — only document the capabilities the system needs/implements.

**Composition:** Full KOODAR agents are usually composed of multiple KDA/KDAR microservices wired together by an Orient-and-Decide layer. Start with the simplest capability combination that solves the problem.

---

## Common Pitfalls in Digital Operations

Five canonical failure patterns users hit when leveling up. Use these to diagnose stalled transformations and to filter recommendations — a roadmap that triggers one of these patterns is wrong.

**Big Bang Fallacy** — attempting to transform everything at once. Iterative sequential changes have a much higher success rate than simultaneous transformations across multiple departments. Limit to a few projects per quarter in a few departments. Complete one level before starting the next. Prioritize high-impact visible wins early.

**Unbalanced Growth** — advancing one pillar too far ahead of others. Digital operations are only as strong as the weakest pillar. Keep current-Level gaps across pillars to ≤2. If using advanced software, ensure the team's skills match its capabilities. Balance technical implementation with process documentation.

**Ignoring People** — focusing on technical implementation while neglecting the human element. Change management is the #1 factor in successful digital transformations. Involve future users early and often. Create "what's in it for me" messaging. Provide ample training, dedicated office hours, and recognition for adoption.

**Perfection Paralysis** — waiting for the perfect solution instead of making steady progress. Adopt an 80/20 mindset. Implement minimum viable processes before perfect ones. Plan for iteration rather than perfection on the first try.

**Neglecting Data Quality** — focusing on new tools and automation while ignoring data quality underneath. Poor data quality compounds through each level. Include data cleanup as a mandatory step in every system rollout. Establish data standards before major integrations. Implement validation to prevent future quality issues.

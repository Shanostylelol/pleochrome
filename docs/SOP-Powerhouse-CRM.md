# PleoChrome Powerhouse CRM — Standard Operating Procedure

## Getting Started

### What Is This?

Powerhouse is PleoChrome's internal CRM for managing real-world assets through their entire lifecycle — from sourcing to distribution. Every gemstone, property, mineral right, or other asset you work with flows through a structured pipeline of phases, stages, and tasks.

### Who Has Access?

Three team members:
- **Shane Pierson** (CEO) — shane@pleochrome.com
- **David Whiting** (CTO) — david@pleochrome.com
- **Chris Ramsey** (CRO) — chris@pleochrome.com

### How to Log In

1. Go to **pleochrome.com/login**
2. Click **Continue with Google**
3. Sign in with your @pleochrome.com Google Workspace account
4. You'll land on the Pipeline board

### Mobile Access

The app works on your phone's browser. Save it to your home screen for a native app-like experience:
- **iPhone**: Safari > Share > Add to Home Screen
- **Android**: Chrome > Menu > Add to Home Screen

---

## Core Concepts

### Assets

An asset is any real-world item PleoChrome is working to monetize. Each asset has:
- **Name** — what you call it (e.g., "Brazilian Paraiba Tourmaline Lot #2026-D")
- **Asset Type** — gemstone, real estate, precious metal, mineral rights, or other
- **Value Model** — how you plan to monetize it (tokenization, fractional securities, debt instrument, broker sale, or barter)
- **Status** — active or paused
- **Reference Code** — auto-generated (e.g., PC-2026-7526)

### The Six Phases

Every asset moves through six phases in order:

1. **Lead** — Initial sourcing and identification
2. **Intake** — KYC/KYB verification, holder screening, preliminary assessment
3. **Maturity** — Full appraisal, custody arrangement, insurance
4. **Security** — Legal structuring (SPV, securities filings, compliance)
5. **Value Creation** — Token/share creation, smart contracts, offering setup
6. **Distribution** — Marketing, investor onboarding, trading/settlement

### Stages, Tasks, and Subtasks

Within each phase:
- **Stages** are major milestones (e.g., "Holder Qualification & Screening")
- **Tasks** are specific work items within a stage (e.g., "Run OFAC/SDN screening")
- **Subtasks** break tasks into smaller checkable items

### Value Models

How you plan to monetize the asset:
- **Tokenization** — ERC-3643/7518 security tokens on blockchain
- **Fractional Securities** — Reg D 506(c) fractional LLC units
- **Debt Instrument** — Asset-backed lending (UCC Article 9)
- **Broker Sale** — Direct sale through a broker/dealer
- **Barter** — Asset-for-asset exchange

You can change the value model mid-lifecycle ("Change Approach" in the asset menu). Phases 1-3 work is preserved; phases 4-6 get swapped for the new model's workflow.

---

## Daily Workflow

### Creating a New Asset

1. Click **+ New Asset** from the Pipeline page (or the button in the sidebar)
2. Fill in the wizard:
   - **Step 1**: Name, asset type, holder entity
   - **Step 2**: Value model selection
   - **Step 3**: Type-specific details (e.g., carat weight for gemstones, property address for real estate)
   - **Step 4**: Review and create
3. The system automatically applies the appropriate workflow template (shared pipeline + value-model-specific stages)

### Working Through the Workflow

1. Open an asset from the Pipeline or Assets list
2. You land on the **Workflow** tab — this is where you do your work
3. The workflow shows your phases and stages. Tap a stage to see its tasks
4. For each task:
   - Tap to open the full detail view
   - Mark subtasks as complete
   - Add notes, attach files, leave comments
   - Change status (To Do > Active > Done)
5. When all tasks in a stage are done, mark the stage as complete
6. When all stages in a phase are done, advance to the next phase

### On Mobile

The mobile view uses a flat drill-down:
- **Stage list**: Tap a stage to open it
- **Task list**: Tap a task to open full details in a drawer
- **Edit names**: Tap the pencil icon to rename stages or tasks
- **Navigate back**: Use the back arrow at the top

### Advancing Phases

From the asset detail page:
- Desktop: Click **Advance to [Phase]** button
- Mobile: Open the "..." menu > Advance

The system will warn you if tasks are incomplete. You can override with a reason (logged for audit).

---

## Feature Guide

### Pipeline Board

The main dashboard. Shows all active assets organized by phase. Use it to:
- See the big picture of what's in progress
- Drag assets between phases (desktop)
- Filter by value model
- Search by asset name

### Overview Tab

Asset reference information:
- Holder entity, description
- Asset-type-specific fields (gemstone grades, property address, etc.)
- Custody & location details
- Legal/SPV information
- Asset owners with KYC status

### Documents Tab

Two sections:
- **Required Documents**: A checklist generated from your workflow template showing which document types are still needed
- **Uploaded Documents**: Files you've attached to the asset, grouped by stage. Upload by clicking "Drop files here" or the upload button

### Comments Tab

Asset-level conversation thread. Use @mentions to notify team members. Every comment is timestamped and attributed.

### Comms Tab

Unified view of all meetings and communication logs for this asset. Two actions:
- **New Meeting**: Schedule and log meetings with title, date, type, attendees, agenda
- **Log Communication**: Record calls, emails, texts with direction (inbound/outbound), summary, duration

### Activity Tab

Immutable audit trail. Every action on the asset is automatically logged — task completions, status changes, document uploads, comments. Filter by type. Export to CSV.

### Gates Tab

Phase advancement gates. These are stages marked as "Gate" that must be completed before advancing to the next phase. Shows completion status and allows override with reason.

### Financials Tab

Financial tracking:
- Claimed and appraised values
- Incoming/outgoing payments from tasks
- Projected revenue (target raise, management fee)
- Cost-to-complete (sum of incomplete task costs)

### Partners Tab

Partners assigned to this asset with their roles (appraiser, custodian, broker-dealer, etc.). Link partners from the master Partners list.

---

## Partners

### Partner Directory (/crm/partners)

Master list of all service providers. Each partner has:
- Contact info (name, email, phone, website)
- Partner type (appraiser, vault custodian, broker dealer, etc.)
- Due diligence status (not started, in progress, passed, failed)
- Engagement status (prospecting, evaluating, onboarding, active, paused, terminated)

### Partner Detail Page

- **Overview**: Description, engagement details, timeline
- **Onboarding**: Onboarding checklist items
- **Assignments**: Which assets this partner is assigned to
- **Documents**: Credentials (licenses, certifications with expiry tracking) and uploaded files
- **Comms**: Communication logs and meetings specific to this partner

---

## Templates

### How Templates Work

Workflow templates define the default stages, tasks, and subtasks for each value model. When you create an asset and select a value model, the system applies:
1. **Shared Pipeline** template (phases 1-3, universal for all value models)
2. **Value Model** template (phases 4-6, specific to your chosen monetization path)

### Customizing After Application

Once a template is applied, all stages, tasks, and subtasks are **independent copies**. You can freely:
- Rename any stage, task, or subtask
- Add new stages, tasks, or subtasks
- Delete irrelevant items
- Reorder items (desktop: drag-and-drop)
- Change task types and statuses

Changes to your asset's workflow do NOT affect the template or other assets.

### Creating Custom Templates

Go to **Templates** in the sidebar. You can:
- View existing templates
- Create new templates with custom stages/tasks
- Set templates as asset-type-specific (e.g., a Real Estate-specific shared pipeline)

---

## Tips

### Keyboard Shortcuts (Desktop)

- **Cmd+K** — Open search (search assets, tasks, partners, contacts)
- **Cmd+N** — Quick add asset (from Pipeline page)

### Search

The search bar (Cmd+K) searches across:
- Asset names and reference codes
- Task titles
- Partner names
- Contact names

### Notifications

The bell icon in the header shows unread notifications. You'll be notified when:
- You're assigned a task
- Someone @mentions you in a comment
- A phase is advanced

### Quick Actions

From any asset, the "..." menu gives you:
- Pause/Resume the asset
- Set a reminder
- Duplicate the asset
- Change the value model approach
- Save as template
- Export data (JSON/CSV)

---

## Contacts

The Contacts section (/crm/contacts) manages individuals associated with your assets and partners:
- Asset holders and their representatives
- Investor contacts
- Partner contact persons

Each contact has: name, email, phone, company, role, and KYC status.

---

## Settings

Access from the sidebar. Currently supports:
- Dark/light mode toggle
- Notification preferences
- Keyboard shortcuts reference

---

## Need Help?

If something isn't working or you have questions about the workflow, reach out to Shane or David. The Activity tab on any asset shows the full audit trail if you need to trace what happened.

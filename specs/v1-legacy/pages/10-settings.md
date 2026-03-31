# Page Spec: Settings

**Phase:** 7 — Governance Templates + Compliance + Settings
**URL:** `/crm/settings`
**Priority:** P1
**Dependencies:** Phase 0 (Foundation)
**Estimated Build Time:** 2-3 hours
**Spec Version:** 1.0

---

## PURPOSE

Application settings, user preferences, integrations, and security configuration. This is the user-facing configuration page for personal preferences (profile, notifications, appearance) and system-level settings (integrations, security). Settings are persisted per-user where applicable.

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `team_members` | User profile data | `id`, `full_name`, `email`, `role`, `phone`, `bio`, `avatar_url`, `notification_preferences` (JSONB), `appearance_preferences` (JSONB) |
| `notifications` | Used for notification preference types | `type` enum values |

### Supabase Auth

| Feature | Purpose |
|---------|---------|
| `supabase.auth.getUser()` | Current user email (read-only) |
| `supabase.auth.mfa` | MFA enrollment and management |
| `supabase.auth.getSession()` | Active session info |

---

## PAGE LAYOUT

### Navigation (Left Sidebar)

```
Width: 220px, fixed position on left
Component: vertical nav list within NeuCard flat

[NavItem] "Profile" — icon: user
[NavItem] "Notifications" — icon: bell
[NavItem] "Integrations" — icon: plug
[NavItem] "Security" — icon: shield
[NavItem] "Appearance" — icon: palette

Click: scrolls right panel to selected section
Active: --accent-teal left border, --text-primary
Inactive: --text-secondary
```

### Content Area (Right)

```
Width: flex-1, scrollable
Padding: 32px
Max-width: 720px
```

---

## SECTION: PROFILE

```
[SectionTitle] "Profile" — Cormorant Garamond, 24px, --text-primary
[SectionDescription] "Manage your personal information" — DM Sans 13px, --text-muted

[AvatarUpload] — 96px circle, NeuCard pressed
  Current avatar image or initials
  Click: opens file browser (image only)
  Upload: stores in Supabase Storage `profile-images` bucket
  Hover: overlay with camera icon

[FormFields]
  [Name] — NeuInput, required
    Label: "Full Name"
    Value: current full_name
  [Email] — NeuInput, read-only, disabled styling
    Label: "Email"
    Value: from Supabase Auth (cannot be changed here)
    Helper text: "Email is managed through authentication settings"
  [Role] — NeuInput, read-only, disabled styling
    Label: "Role"
    Value: current role (e.g., "CEO")
    Helper text: "Role is set by system administrator"
  [Phone] — NeuInput, optional
    Label: "Phone"
    Placeholder: "+1 (555) 123-4567"
  [Bio] — Textarea (NeuInput variant), optional
    Label: "Bio"
    Placeholder: "Brief description of your role and responsibilities"
    Max: 500 characters with counter

[Button: "Save Changes"] — NeuButton primary, --accent-teal
  Saves via settings.updateProfile tRPC mutation
  Toast: "Profile updated successfully"
```

---

## SECTION: NOTIFICATIONS

```
[SectionTitle] "Notifications" — Cormorant Garamond, 24px, --text-primary
[SectionDescription] "Configure which events trigger notifications" — DM Sans 13px, --text-muted

[NotificationPreferencesTable]
  NeuCard raised, full-width

  [Header Row]
    | Event | In-App | Email |
    Headers: DM Sans 13px, 600 weight, --text-primary

  [Preference Rows] — each with NeuToggle for in-app and email

  | Event | Default In-App | Default Email |
  |-------|---------------|---------------|
  | Task assigned to me | ON | ON |
  | Task overdue | ON | ON |
  | Document uploaded to my asset | ON | OFF |
  | Gate ready for review | ON | ON |
  | Gate passed | ON | ON |
  | Approval requested from me | ON | ON |
  | Step completed | ON | OFF |
  | Comment mentioning me | ON | OFF |
  | Insurance expiry warning | ON | ON |
  | KYC expiry warning | ON | ON |
  | Compliance alert (critical) | ON | ON |
  | New asset created | ON | OFF |
  | Meeting action item assigned | ON | OFF |
  | Partner DD refresh due | ON | OFF |

  Each row:
    [EventDescription] — DM Sans 14px, --text-primary
    [InAppToggle] — NeuToggle, --accent-teal when on
    [EmailToggle] — NeuToggle, --accent-teal when on

[Button: "Save Preferences"] — NeuButton primary
  Toast: "Notification preferences saved"
```

---

## SECTION: INTEGRATIONS

```
[SectionTitle] "Integrations" — Cormorant Garamond, 24px, --text-primary
[SectionDescription] "Connect external services" — DM Sans 13px, --text-muted

[Card: Google Drive] — NeuCard raised
  [Header] "Google Drive" — icon: cloud, DM Sans 16px, 600 weight
  [Status]
    - Connected: NeuBadge --accent-emerald "Connected"
      + Connected account email
      + Sync folder path
      + [Button: "Disconnect"] — NeuButton ghost, --accent-ruby
    - Not Connected: NeuBadge --text-muted "Not Connected"
      + [Button: "Connect Google Drive"] — NeuButton primary
      + Note: "Enables automatic document backup to Google Drive"

[Card: Supabase] — NeuCard raised
  [Header] "Supabase" — icon: database, DM Sans 16px, 600 weight
  [Status] NeuBadge --accent-emerald "Connected"
  [Details] — read-only display
    Project Reference: env value (masked)
    Region: from env
    Plan: from API or env
  [Note] "Database connection is managed via environment variables"

[Card: Future Integrations] — NeuCard raised, --bg-tertiary
  [Header] "Coming Soon" — DM Sans 16px, 600 weight, --text-muted
  [List]
    [Row] "Chainlink Proof of Reserve" — "Phase 2"
    [Row] "Tokenization Platform API" — "Phase 2"
    [Row] "DocuSign E-Signatures" — "Phase 2"
    [Row] "AI Document Analysis" — "Phase 3"
  Each row: NeuBadge --text-muted with phase label

[Card: API Keys] — NeuCard raised
  [Header] "API Keys" — icon: key, DM Sans 16px, 600 weight
  [Description] "For future external integrations" — DM Sans 13px, --text-muted
  [Note] "API key management will be available in a future release"
  [Placeholder state — no keys yet]
```

---

## SECTION: SECURITY

```
[SectionTitle] "Security" — Cormorant Garamond, 24px, --text-primary

[Card: Multi-Factor Authentication] — NeuCard raised
  [Header] "MFA" — icon: shield-check
  [Status]
    - Enabled: NeuBadge --accent-emerald "MFA Enabled"
      [Button: "Manage MFA"] — NeuButton ghost
    - Not Enabled: NeuBadge --accent-amber "MFA Not Enabled"
      [WarningText] "MFA is required for all team members"
      [Button: "Enable MFA"] — NeuButton primary, --accent-teal
        Flow: Supabase Auth MFA enrollment (TOTP)

[Card: Active Sessions] — NeuCard raised
  [Header] "Sessions" — icon: monitor
  [CurrentSession]
    "Current Session" — NeuBadge --accent-emerald
    Device: browser user-agent
    IP: masked partially
    Started: date + time
  [OtherSessions] — list (if multiple)
    Each: device, IP (masked), started date
    [Button: "Revoke"] — NeuButton ghost, --accent-ruby, per session
  [Button: "Sign Out All Other Sessions"] — NeuButton ghost, --accent-ruby

[Card: Login History] — NeuCard raised
  [Header] "Recent Logins" — icon: clock
  [Table] — last 30 days
    | Date | Device | IP | Status |
    Status: NeuBadge --accent-emerald "Success" or --accent-ruby "Failed"
  Max 20 rows with "View more" link
```

---

## SECTION: APPEARANCE

```
[SectionTitle] "Appearance" — Cormorant Garamond, 24px, --text-primary

[Card: Theme] — NeuCard raised
  [Header] "Theme" — icon: sun/moon
  [RadioGroup]
    [Option: "Dark Mode"] — default, with dark preview thumbnail (120x80px)
    [Option: "Light Mode"] — with light preview thumbnail
  Change applies immediately (no save button needed)
  Stored in: appearance_preferences.theme

[Card: Density] — NeuCard raised
  [Header] "Display Density" — icon: maximize/minimize
  [RadioGroup]
    [Option: "Compact"] — reduced padding, smaller fonts
    [Option: "Comfortable"] — default, standard spacing
    [Option: "Spacious"] — increased padding, more breathing room
  Change applies immediately
  Stored in: appearance_preferences.density

[Card: Pipeline Behavior] — NeuCard raised
  [Header] "Pipeline Board" — icon: layout
  [RadioGroup: "Card Click Behavior"]
    [Option: "Open slide-over panel"] — default
    [Option: "Navigate to full page"]
  Stored in: appearance_preferences.pipeline_click

[Card: Sidebar] — NeuCard raised
  [Header] "Sidebar" — icon: sidebar
  [NeuToggle] "Auto-collapse on narrow screens" — default ON
  [NeuToggle] "Remember sidebar state between sessions" — default ON
  Stored in: appearance_preferences.sidebar
```

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Section cards, integration cards |
| NeuButton | `src/components/ui/NeuButton` | Save, Connect, Disconnect, Enable MFA, Revoke |
| NeuInput | `src/components/ui/NeuInput` | Profile form fields |
| NeuToggle | `src/components/ui/NeuToggle` | Notification preferences, sidebar toggles |
| NeuBadge | `src/components/ui/NeuBadge` | Status badges (Connected, Enabled, etc.) |
| NeuAvatar | `src/components/ui/NeuAvatar` | Profile avatar display |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| SettingsNav | `src/components/crm/SettingsNav` | Left sidebar navigation |
| SettingsSection | `src/components/crm/SettingsSection` | Scroll-target section wrapper |
| NotificationPrefsTable | `src/components/crm/NotificationPrefsTable` | Toggle matrix for notification preferences |
| ThemePreview | `src/components/crm/ThemePreview` | Dark/light mode preview thumbnails |
| ProfileForm | `src/components/crm/ProfileForm` | Profile edit form with avatar upload |

---

## tRPC ROUTES

### Router: `src/server/routers/settings.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `settings.getProfile` | query | `{}` | `{ profile: TeamMember }` | Returns current user's team_members record. |
| `settings.updateProfile` | mutation | `{ fullName?, phone?, bio?, avatarUrl? }` | `{ profile: TeamMember }` | Updates team_members. Activity logged. |
| `settings.getNotificationPrefs` | query | `{}` | `{ preferences: NotificationPreference[] }` | Returns notification_preferences JSONB parsed into structured array. |
| `settings.updateNotificationPrefs` | mutation | `{ preferences: { eventType: string, inApp: boolean, email: boolean }[] }` | `{ preferences: NotificationPreference[] }` | Replaces notification_preferences JSONB. |
| `settings.getAppearancePrefs` | query | `{}` | `{ theme: string, density: string, pipelineClick: string, sidebar: SidebarPrefs }` | From appearance_preferences JSONB. |
| `settings.updateAppearancePrefs` | mutation | `{ theme?, density?, pipelineClick?, sidebar? }` | `{ preferences: AppearancePrefs }` | Updates appearance_preferences JSONB. |
| `settings.uploadAvatar` | mutation | `{ filePath }` | `{ avatarUrl: string }` | Updates avatar_url on team_members. |

### Zod Schemas

```typescript
const UpdateProfileInput = z.object({
  fullName: z.string().min(1).max(255).optional(),
  phone: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

const UpdateNotificationPrefsInput = z.object({
  preferences: z.array(z.object({
    eventType: z.string(),
    inApp: z.boolean(),
    email: z.boolean(),
  })),
});

const UpdateAppearancePrefsInput = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  density: z.enum(['compact', 'comfortable', 'spacious']).optional(),
  pipelineClick: z.enum(['slide-over', 'full-page']).optional(),
  sidebar: z.object({
    autoCollapse: z.boolean(),
    rememberState: z.boolean(),
  }).optional(),
});
```

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/settings` | Page renders with all sections |
| 2 | Settings nav scrolls to section | Click "Notifications" scrolls to notifications section |
| 3 | Profile: edit name | Name updates, toast shown |
| 4 | Profile: email is read-only | Cannot edit email field |
| 5 | Profile: role is read-only | Cannot edit role field |
| 6 | Profile: upload avatar | Image uploads to Storage, avatar updates |
| 7 | Notifications: toggle in-app | Preference saved |
| 8 | Notifications: toggle email | Preference saved |
| 9 | Notifications: save preferences | All toggles persisted correctly |
| 10 | Integrations: Supabase status shows | Project info displayed |
| 11 | Integrations: future items shown | Placeholder cards with phase labels |
| 12 | Security: MFA status displayed | Shows enabled/disabled correctly |
| 13 | Security: session info displayed | Current session details shown |
| 14 | Appearance: switch to light mode | Theme changes immediately |
| 15 | Appearance: switch density | Spacing adjusts immediately |
| 16 | Appearance: pipeline click behavior | Setting persists, affects pipeline board |
| 17 | Appearance: sidebar toggles | Settings persist across sessions |
| 18 | `npm run build` | Zero errors |
| 19 | Dark mode | All settings sections render correctly |
| 20 | Light mode | All settings sections render correctly |

---

## CLAUDE.md RULES APPLIED

- **Neumorphic design system:** NeuCard for all section containers, NeuToggle for preferences
- **Dark + light mode:** Theme toggle here controls the global theme via CSS custom properties
- **No secrets in client-side code:** API keys/Supabase config shown as masked or read-only
- **MFA must be enabled:** Settings page shows warning if MFA is not enabled
- **tRPC for mutations:** All settings updates through tRPC

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC, Supabase Auth |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| CRM Shell | Theme preference affects global theme; sidebar prefs affect sidebar behavior |
| Pipeline Board | pipeline_click preference determines card click behavior |
| Notifications (all phases) | Notification preferences filter which notifications are sent |
| All pages | density preference affects global spacing |

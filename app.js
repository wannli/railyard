// Display column config per event type (mirrors event-types.js config)
const DISPLAY_COLUMNS = {
  "speakers.inscription.created": {
    columns: ["delegation", "agenda_item", "position"],
    labels: ["Delegation", "Agenda Item", "Position"],
    resolve: (payload) => ({
      delegation: payload.delegation,
      agenda_item: payload.agenda_item,
      position: payload.position,
    })
  },
  "speakers.inscription.withdrawn": {
    columns: ["agenda_item", "reason", "original_position"],
    labels: ["Agenda Item", "Reason", "Position"],
    resolve: (payload) => ({
      agenda_item: payload.agenda_item,
      reason: payload.reason,
      original_position: payload.original_position,
    })
  },
  "document.submitted": {
    columns: ["symbol", "title", "committee"],
    labels: ["Symbol", "Title", "Committee"],
    resolve: (payload) => ({
      symbol: payload.document?.symbol,
      title: payload.document?.title,
      committee: payload.submission?.committee,
    })
  },
  "session.opened": {
    columns: ["meeting_number", "body", "meeting_type"],
    labels: ["Meeting", "Body", "Type"],
    resolve: (payload) => ({
      meeting_number: payload.meeting_number,
      body: payload.body,
      meeting_type: payload.meeting_type,
    })
  },
  "session.closed": {
    columns: ["meeting_number", "speakers_delivered", "decisions_adopted"],
    labels: ["Meeting", "Speakers", "Decisions"],
    resolve: (payload) => ({
      meeting_number: payload.meeting_number,
      speakers_delivered: payload.speakers_delivered,
      decisions_adopted: payload.decisions_adopted,
    })
  },
  "vote.cast": {
    columns: ["resolution_symbol", "vote", "voting_method"],
    labels: ["Resolution", "Vote", "Method"],
    resolve: (payload) => ({
      resolution_symbol: payload.resolution_symbol,
      vote: payload.vote,
      voting_method: payload.voting_method,
    })
  },
  "credential.verified": {
    columns: ["delegate_name", "mission", "credential_type"],
    labels: ["Delegate", "Mission", "Credential"],
    resolve: (payload) => ({
      delegate_name: payload.delegate_name,
      mission: payload.mission,
      credential_type: payload.credential_type,
    })
  },
  "notification.sent": {
    columns: ["channel", "subject", "delivery_status"],
    labels: ["Channel", "Subject", "Status"],
    resolve: (payload) => ({
      channel: payload.channel,
      subject: payload.subject,
      delivery_status: payload.delivery_status,
    })
  },
};

const PILL_MAP = {
  in_favour: "pill-green",
  against: "pill-red",
  abstention: "pill-amber",
  delivered: "pill-green",
  pending: "pill-amber",
  failed: "pill-red",
  full_powers: "pill-purple",
  letter_of_credence: "pill-blue",
  plenary: "pill-blue",
  formal: "pill-purple",
  recorded: "pill-blue",
  email: "pill-blue",
  sms: "pill-amber",
  delegation_request: "pill-blue",
  time_constraint: "pill-amber",
  general_debate: "pill-blue",
  right_of_reply: "pill-purple",
};

// Mock event data with varying payload complexity
const EVENTS = [
  {
    timestamp: "2026-02-11T18:42:07.331Z",
    actor_id: "delegate:AFG-001",
    actor_label: "H.E. Mr. Ahmad Zahir (Afghanistan)",
    event_type: "speakers.inscription.created",
    version: "1.2",
    trace_id: "tr-8f2a4b1c",
    retention: "1 month",
    payload: {
      meeting_id: "GA-80-PLN-047",
      agenda_item: "71(b)",
      agenda_title: "Strengthening of the coordination of humanitarian assistance",
      list_type: "general_debate",
      position: 14,
      delegation: "Afghanistan",
      requested_by: "First Secretary, Permanent Mission"
    }
  },
  {
    timestamp: "2026-02-11T18:41:22.008Z",
    actor_id: "delegate:BRA-001",
    actor_label: "Mr. Santos (Brazil)",
    event_type: "speakers.inscription.created",
    version: "1.2",
    trace_id: "tr-4a9b1c2e",
    retention: "1 month",
    payload: {
      meeting_id: "GA-80-PLN-047",
      agenda_item: "71(b)",
      agenda_title: "Strengthening of the coordination of humanitarian assistance",
      list_type: "general_debate",
      position: 15,
      delegation: "Brazil",
      requested_by: "Second Secretary, Permanent Mission"
    }
  },
  {
    timestamp: "2026-02-11T18:39:55.102Z",
    actor_id: "system:doc-processor",
    actor_label: "System (Document Processor)",
    event_type: "document.submitted",
    version: "2.0",
    trace_id: "tr-3e7c91d0",
    retention: "1 year",
    payload: {
      document: {
        symbol: "A/80/L.42",
        title: "Draft resolution: Situation of human rights in Myanmar",
        language: "en",
        format: "pdf",
        size_bytes: 284710
      },
      submission: {
        submitted_by: "delegate:EU-001",
        co_sponsors: ["delegate:NOR-001", "delegate:CAN-001", "delegate:AUS-001", "delegate:JPN-001"],
        committee: "Third Committee",
        agenda_item: "74(c)"
      },
      processing: {
        extraction_status: "completed",
        paragraphs_extracted: 18,
        operative_paragraphs: 12,
        preambular_paragraphs: 6
      }
    }
  },
  {
    timestamp: "2026-02-11T18:35:12.887Z",
    actor_id: "admin:lint-w",
    actor_label: "Wannes Lint (Admin)",
    event_type: "session.opened",
    version: "1.0",
    trace_id: "tr-a91f5e23",
    retention: "1 year",
    payload: {
      session: "GA-80",
      body: "General Assembly",
      meeting_number: "PLN-047",
      meeting_type: "plenary",
      presiding_officer: "President of the General Assembly",
      scheduled_start: "2026-02-11T15:00:00Z",
      actual_start: "2026-02-11T15:12:00Z",
      agenda_items: ["71(b)", "71(c)", "135"]
    }
  },
  {
    timestamp: "2026-02-11T18:30:44.219Z",
    actor_id: "delegate:BRA-003",
    actor_label: "Ms. Silva (Brazil)",
    event_type: "vote.cast",
    version: "1.1",
    trace_id: "tr-d44b2f87",
    retention: "1 year",
    payload: {
      resolution_symbol: "A/80/L.38",
      resolution_title: "International cooperation on climate action",
      vote: "in_favour",
      voting_method: "recorded",
      explanation_of_vote: true,
      eov_timing: "after"
    }
  },
  {
    timestamp: "2026-02-11T18:28:03.561Z",
    actor_id: "delegate:GBR-002",
    actor_label: "Mr. Thompson (United Kingdom)",
    event_type: "credential.verified",
    version: "1.0",
    trace_id: "tr-7bc83a15",
    retention: "1 month",
    payload: {
      delegate_name: "Mr. James Thompson",
      role: "Alternate Representative",
      mission: "Permanent Mission of the United Kingdom",
      credential_type: "full_powers",
      verified_by: "admin:roesch-s",
      verification_method: "manual"
    }
  },
  {
    timestamp: "2026-02-11T18:25:17.004Z",
    actor_id: "system:notification-service",
    actor_label: "System (Notifications)",
    event_type: "notification.sent",
    version: "1.3",
    trace_id: "tr-ee2d90c4",
    retention: "1 week",
    payload: {
      channel: "email",
      recipient: "delegate:AFG-001",
      recipient_email: "pm-afghanistan@un.org",
      template: "speaker_confirmation",
      subject: "Speaker inscription confirmed — Agenda item 71(b)",
      related_event: "speakers.inscription.created",
      delivery_status: "delivered"
    }
  },
  {
    timestamp: "2026-02-11T18:22:41.773Z",
    actor_id: "delegate:FRA-001",
    actor_label: "M. Dupont (France)",
    event_type: "speakers.inscription.withdrawn",
    version: "1.2",
    trace_id: "tr-1a5f7e39",
    retention: "1 month",
    payload: {
      meeting_id: "GA-80-PLN-047",
      agenda_item: "71(b)",
      reason: "delegation_request",
      original_position: 8,
      withdrawn_by: "delegate:FRA-001"
    }
  },
  {
    timestamp: "2026-02-11T18:18:09.110Z",
    actor_id: "admin:dua-p",
    actor_label: "Paolo Dua (Admin)",
    event_type: "session.closed",
    version: "1.0",
    trace_id: "tr-5c8d1b46",
    retention: "1 year",
    payload: {
      session: "GA-80",
      meeting_number: "PLN-046",
      actual_end: "2026-02-11T18:15:00Z",
      speakers_delivered: 22,
      speakers_remaining: 3,
      decisions_adopted: 2,
      next_meeting: "PLN-047"
    }
  }
];

// Type to color class mapping
function getTypeClass(eventType) {
  if (eventType.startsWith("speakers.")) return "type-speakers";
  if (eventType.startsWith("document.")) return "type-document";
  if (eventType.startsWith("credential.")) return "type-credential";
  if (eventType.startsWith("session.")) return "type-session";
  if (eventType.startsWith("vote.")) return "type-vote";
  if (eventType.startsWith("notification.")) return "type-notification";
  return "";
}

// Format timestamp for display
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    + "." + String(d.getMilliseconds()).padStart(3, "0");
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Build a one-line payload preview
function payloadPreview(payload) {
  const keys = Object.keys(payload);
  const parts = [];
  for (let i = 0; i < Math.min(keys.length, 3); i++) {
    const v = payload[keys[i]];
    if (typeof v === "object" && v !== null) {
      parts.push(`${keys[i]}: {…}`);
    } else {
      parts.push(`${keys[i]}: ${JSON.stringify(v)}`);
    }
  }
  if (keys.length > 3) parts.push(`+${keys.length - 3} more`);
  return parts.join("  ·  ");
}

// Format a cell value with pill styling for enums
function formatCellValue(val) {
  if (val === undefined || val === null) return `<span class="event-cell-empty">—</span>`;
  if (typeof val === "number") return `<span class="event-cell-number">${val}</span>`;
  if (typeof val === "boolean") return `<span class="event-cell-bool">${val}</span>`;
  if (PILL_MAP[val]) return `<span class="event-cell-pill ${PILL_MAP[val]}">${val}</span>`;
  return `<span class="event-cell-text">${val}</span>`;
}

// Current filter state
let currentTypeFilter = "";
let currentActorFilter = "";
let currentDateFilter = "";
let currentSearchFilter = "";

// Date range helper
function checkDateRange(timestamp, range) {
  const eventDate = new Date(timestamp);
  const now = new Date();
  const hoursMap = {
    "Last 24 hours": 24,
    "Last 7 days": 168,
    "Last 30 days": 720
  };
  const hours = hoursMap[range];
  if (!hours) return true;
  const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
  return eventDate >= cutoff;
}

// Render event list — switches between generic and typed column view
function renderEventList() {
  const list = document.getElementById("event-list");
  const filteredEvents = EVENTS.filter(e => {
    const matchesType = !currentTypeFilter || e.event_type === currentTypeFilter;
    const matchesActor = !currentActorFilter ||
      e.actor_label.toLowerCase().includes(currentActorFilter.toLowerCase());
    const matchesDate = !currentDateFilter || checkDateRange(e.timestamp, currentDateFilter);
    const matchesSearch = !currentSearchFilter || (
      e.event_type.toLowerCase().includes(currentSearchFilter.toLowerCase()) ||
      e.actor_label.toLowerCase().includes(currentSearchFilter.toLowerCase()) ||
      e.trace_id.toLowerCase().includes(currentSearchFilter.toLowerCase())
    );
    return matchesType && matchesActor && matchesDate && matchesSearch;
  });

  let html = "";
  const displayConfig = currentTypeFilter ? DISPLAY_COLUMNS[currentTypeFilter] : null;

  if (displayConfig) {
    // === TYPED VIEW: custom columns from display config ===
    const colCount = displayConfig.columns.length;

    // Typed view banner
    html += `<div class="typed-view-banner">
      <div class="typed-view-banner-inner">
        <span class="typed-view-badge ${getTypeClass(currentTypeFilter)}">
          <span class="event-type-dot"></span>
          ${currentTypeFilter}
        </span>
        <span class="typed-view-info">${filteredEvents.length} events · Showing configured display columns</span>
      </div>
    </div>`;

    // Header
    html += `<div class="event-row-typed event-row-header" style="grid-template-columns: 150px ${displayConfig.columns.map(() => '1fr').join(' ')} 180px 90px;">
      <div>Timestamp</div>
      ${displayConfig.labels.map(l => `<div>${l}</div>`).join("")}
      <div>Actor</div>
      <div>Trace</div>
    </div>`;

    // Rows
    filteredEvents.forEach((evt, idx) => {
      const resolved = displayConfig.resolve(evt.payload);
      const globalIdx = EVENTS.indexOf(evt);
      html += `<div class="event-row-typed" data-idx="${globalIdx}" style="grid-template-columns: 150px ${displayConfig.columns.map(() => '1fr').join(' ')} 180px 90px;">
        <div class="event-time">${formatTime(evt.timestamp)}</div>
        ${displayConfig.columns.map(col => `<div class="event-cell">${formatCellValue(resolved[col])}</div>`).join("")}
        <div class="event-actor">${evt.actor_label}</div>
        <div class="event-trace">${evt.trace_id}</div>
      </div>`;
    });
  } else {
    // === GENERIC VIEW: event type + payload preview ===
    html += `<div class="event-row event-row-header">
      <div>Timestamp</div>
      <div>Event</div>
      <div>Actor</div>
      <div>Trace</div>
    </div>`;

    filteredEvents.forEach((evt) => {
      const cls = getTypeClass(evt.event_type);
      const globalIdx = EVENTS.indexOf(evt);
      html += `
        <div class="event-row" data-idx="${globalIdx}">
          <div class="event-time">${formatTime(evt.timestamp)}</div>
          <div class="event-type-cell">
            <div class="event-type-badge ${cls}">
              <span class="event-type-dot"></span>
              ${evt.event_type}
            </div>
            <div class="event-payload-preview">${payloadPreview(evt.payload)}</div>
          </div>
          <div class="event-actor">${evt.actor_label}</div>
          <div class="event-trace">${evt.trace_id}</div>
        </div>`;
    });
  }

  list.innerHTML = html;

  // Attach click handlers
  list.querySelectorAll(".event-row:not(.event-row-header), .event-row-typed:not(.event-row-header)").forEach(row => {
    row.addEventListener("click", () => {
      const idx = parseInt(row.dataset.idx);
      if (!isNaN(idx)) openDetail(EVENTS[idx]);
    });
  });
}

// Render payload value with type-aware formatting
function renderPayloadValue(value) {
  if (value === null) return `<span class="payload-value-null">null</span>`;
  if (typeof value === "boolean") return `<span class="payload-value-boolean">${value}</span>`;
  if (typeof value === "number") return `<span class="payload-value-number">${value}</span>`;
  if (Array.isArray(value)) {
    if (value.length === 0) return `<span class="payload-value-null">[]</span>`;
    if (value.every(v => typeof v !== "object")) {
      return value.map(v => `<div class="payload-array-item">${v}</div>`).join("");
    }
    return value.map(v => {
      return `<div class="payload-nested">${renderPayloadTable(v)}</div>`;
    }).join("");
  }
  if (typeof value === "object") {
    return `<div class="payload-nested">${renderPayloadTable(value)}</div>`;
  }
  return `<span class="payload-value-string">"${value}"</span>`;
}

// Render a payload as a key-value table
function renderPayloadTable(obj) {
  let html = `<table class="payload-table">`;
  for (const [key, val] of Object.entries(obj)) {
    html += `<tr>
      <td class="payload-key">${key}</td>
      <td class="payload-value">${renderPayloadValue(val)}</td>
    </tr>`;
  }
  html += `</table>`;
  return html;
}

// Open detail panel
function openDetail(evt) {
  const panel = document.getElementById("detail-panel");
  const overlay = document.getElementById("detail-overlay");
  const content = document.getElementById("detail-content");
  const cls = getTypeClass(evt.event_type);

  const jsonId = "json-" + Math.random().toString(36).slice(2);

  content.innerHTML = `
    <div class="detail-header">
      <div class="detail-event-type ${cls}">
        <span class="event-type-dot"></span>
        ${evt.event_type}
        <span class="detail-version">v${evt.version}</span>
      </div>
      <div style="margin-top: 4px; color: var(--text-muted); font-size: 13px;">
        ${formatDate(evt.timestamp)} at ${formatTime(evt.timestamp)}
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Envelope</div>
      <div class="envelope-grid">
        <div class="envelope-field">
          <span class="envelope-key">Timestamp</span>
          <span class="envelope-value">${evt.timestamp}</span>
        </div>
        <div class="envelope-field">
          <span class="envelope-key">Actor</span>
          <span class="envelope-value">${evt.actor_id}</span>
        </div>
        <div class="envelope-field">
          <span class="envelope-key">Trace ID</span>
          <span class="envelope-value">${evt.trace_id}</span>
        </div>
        <div class="envelope-field">
          <span class="envelope-key">Retention</span>
          <span class="envelope-value"><span class="retention-badge">🕐 ${evt.retention}</span></span>
        </div>
        <div class="envelope-field full">
          <span class="envelope-key">Actor Label</span>
          <span class="envelope-value">${evt.actor_label}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Payload</div>
      ${renderPayloadTable(evt.payload)}
      <button class="json-toggle" onclick="document.getElementById('${jsonId}').classList.toggle('open'); this.querySelector('.toggle-arrow').textContent = document.getElementById('${jsonId}').classList.contains('open') ? '▾' : '▸'">
        <span class="toggle-arrow">▸</span> View raw JSON
      </button>
      <pre class="json-raw" id="${jsonId}">${JSON.stringify(evt.payload, null, 2)}</pre>
    </div>
  `;

  panel.classList.add("open");
  overlay.classList.add("open");
}

// Close detail panel
function closeDetail() {
  document.getElementById("detail-panel").classList.remove("open");
  document.getElementById("detail-overlay").classList.remove("open");
}

document.getElementById("detail-close").addEventListener("click", closeDetail);
document.getElementById("detail-overlay").addEventListener("click", closeDetail);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeDetail();
});

// Filter handlers
document.getElementById("filter-type").addEventListener("change", (e) => {
  currentTypeFilter = e.target.value;
  renderEventList();
});

document.getElementById("filter-actor").addEventListener("input", (e) => {
  currentActorFilter = e.target.value;
  renderEventList();
});

document.getElementById("filter-date").addEventListener("change", (e) => {
  currentDateFilter = e.target.value;
  renderEventList();
});

document.getElementById("filter-search").addEventListener("input", (e) => {
  currentSearchFilter = e.target.value;
  renderEventList();
});
document.querySelector(".filter-btn-clear").addEventListener("click", () => {
  document.getElementById("filter-type").value = "";
  document.getElementById("filter-actor").value = "";
  document.getElementById("filter-date").value = "";
  document.getElementById("filter-search").value = "";
  currentTypeFilter = "";
  currentActorFilter = "";
  currentDateFilter = "";
  currentSearchFilter = "";
  renderEventList();
});

// Init
renderEventList();

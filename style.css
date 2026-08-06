:root {
  --bg: #f4f0ea;
  --card: #ffffff;
  --text: #111111;
  --muted: #6f6a64;
  --line: #e6ddd3;
  --dark: #111111;
  --accent: #e85d45;
  --accent-soft: #ffe0d7;
  --gold-soft: #fff1c9;
  --green-soft: #dff3e4;
  --green: #24653a;
  --shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  --radius-xl: 30px;
  --radius-lg: 22px;
  --radius-md: 16px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(232, 93, 69, 0.25), transparent 35%),
    radial-gradient(circle at top right, rgba(255, 193, 122, 0.28), transparent 32%),
    var(--bg);
  color: var(--text);
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

img {
  display: block;
  max-width: 100%;
}

.hidden {
  display: none !important;
}

.app-shell {
  width: min(100%, 540px);
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  padding-bottom: 96px;
}

.screen {
  min-height: 100vh;
}

.gate-screen {
  display: grid;
  place-items: center;
  padding: 24px;
}

.gate-card {
  width: 100%;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
}

.brand-pill {
  display: inline-flex;
  margin-bottom: 22px;
  padding: 9px 14px;
  border-radius: 999px;
  background: var(--dark);
  color: #fff;
  font-weight: 900;
  letter-spacing: -0.04em;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 12px;
  font-size: clamp(2.2rem, 10vw, 3.4rem);
  line-height: 0.92;
  letter-spacing: -0.085em;
}

h2 {
  margin-bottom: 10px;
  font-size: 1.6rem;
  line-height: 1.05;
  letter-spacing: -0.055em;
}

h3 {
  margin-bottom: 6px;
  letter-spacing: -0.025em;
}

.muted {
  color: var(--muted);
  line-height: 1.5;
}

.eyebrow {
  margin-bottom: 7px;
  color: var(--accent);
  text-transform: uppercase;
  font-size: 0.74rem;
  letter-spacing: 0.13em;
  font-weight: 900;
}

.progress {
  height: 9px;
  margin: 24px 0;
  overflow: hidden;
  border-radius: 999px;
  background: #eee3da;
}

.progress-bar {
  width: 0%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--dark));
  transition: width 0.25s ease;
}

.form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 750;
}

.field-hint {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
}

input,
select,
textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  outline: none;
  background: #fff;
  color: var(--text);
}

textarea {
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(232, 93, 69, 0.15);
}

.btn {
  padding: 15px 18px;
  border: 0;
  border-radius: 18px;
  font-weight: 900;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background: var(--dark);
  color: #fff;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.16);
}

.btn-secondary {
  background: var(--accent-soft);
  color: var(--dark);
}

.error {
  min-height: 20px;
  margin: 0;
  color: #b42318;
  font-weight: 750;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 12px;
  background:
    linear-gradient(
      180deg,
      rgba(244, 240, 234, 0.98),
      rgba(244, 240, 234, 0.86)
    );
  backdrop-filter: blur(12px);
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  font-weight: 900;
}

.page {
  display: none;
  padding: 8px 18px 18px;
}

.page.active {
  display: block;
}

.hero {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: var(--radius-xl);
  background: var(--dark);
  color: #fff;
  box-shadow: var(--shadow);
}

.hero::after {
  content: "";
  position: absolute;
  right: -60px;
  bottom: -70px;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  background: rgba(232, 93, 69, 0.5);
}

.hero p {
  position: relative;
  z-index: 2;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.5;
}

.hero h2,
.hero .eyebrow {
  position: relative;
  z-index: 2;
}

.availability {
  position: relative;
  z-index: 2;
  display: inline-flex;
  margin-top: 8px;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.88rem;
  font-weight: 850;
}

.game-card {
  margin: 16px 0 14px;
  padding: 18px;
  border: 1px solid rgba(232, 93, 69, 0.18);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 214, 221, 0.8),
      transparent 34%
    ),
    linear-gradient(135deg, #fffdf8, #fff2e7);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.08);
}

.game-card-top {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 14px;
  align-items: start;
}

.game-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 21px;
  background: var(--dark);
  color: #fff;
  font-size: 1.7rem;
  box-shadow: 0 12px 22px rgba(0, 0, 0, 0.16);
}

.game-rules-mini {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 8px 0 12px;
}

.game-rules-mini span {
  display: inline-flex;
  padding: 7px 10px;
  border-radius: 999px;
  background: var(--gold-soft);
  color: #775200;
  font-size: 0.76rem;
  font-weight: 900;
}

.game-home-status {
  margin-bottom: 13px;
  color: var(--muted);
  line-height: 1.45;
  font-weight: 750;
}

.game-card .btn {
  width: 100%;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 14px 0 20px;
}

.stat {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--card);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.stat strong {
  display: block;
  font-size: 1.45rem;
  letter-spacing: -0.05em;
}

.stat span {
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 700;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 12px;
  margin: 22px 0 12px;
}

.section-title h2,
.section-title h3 {
  margin: 0;
}

.history-title,
.vouchers-title {
  margin-top: 30px;
}

.link-btn {
  padding: 5px;
  border: 0;
  background: transparent;
  color: var(--accent);
  font-weight: 900;
}

.services {
  display: grid;
  gap: 13px;
}

.service-card {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--card);
  text-align: left;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.07);
}

.service-row {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;
  align-items: start;
}

.service-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: var(--accent-soft);
  font-size: 1.55rem;
}

.service-card p {
  margin-bottom: 11px;
  color: var(--muted);
  line-height: 1.4;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  background: #f5eee7;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 850;
}

.info-card {
  margin-top: 18px;
  padding: 16px;
  border: 1px dashed #d6c9bd;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.62);
}

.info-card p {
  margin-bottom: 0;
  color: var(--muted);
  line-height: 1.45;
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: 14px;
  z-index: 50;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  width: min(calc(100% - 24px), 516px);
  padding: 8px;
  border: 1px solid rgba(230, 221, 211, 0.95);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(18px);
  transform: translateX(-50%);
}

.nav-btn {
  display: grid;
  gap: 2px;
  padding: 9px 6px;
  border: 0;
  border-radius: 18px;
  background: transparent;
  color: var(--muted);
  font-weight: 900;
}

.nav-btn span {
  font-size: 0.72rem;
}

.nav-btn.active {
  background: var(--dark);
  color: #fff;
}

.calendar-card {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--card);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.07);
}

.calendar-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.calendar-head h3 {
  margin: 0;
  text-transform: capitalize;
}

.weekdays,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.weekdays span {
  padding-bottom: 5px;
  color: var(--muted);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 900;
}

.day {
  position: relative;
  min-height: 46px;
  border: 1px solid transparent;
  border-radius: 15px;
  background: #faf6f1;
  color: var(--text);
  font-weight: 850;
}

.day.is-empty {
  visibility: hidden;
}

.day.is-today {
  border-color: var(--accent);
}

.day.is-selected {
  background: var(--dark);
  color: #fff;
}

.day.has-booking::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 7px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--accent);
  transform: translateX(-50%);
}

.day.is-selected.has-booking::after {
  background: #fff;
}

.list {
  display: grid;
  gap: 11px;
}

.booking-card {
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--card);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.booking-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.booking-title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 1.02rem;
  font-weight: 950;
}

.status {
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 999px;
  background: #fff0c2;
  color: #8a5b00;
  white-space: nowrap;
  font-size: 0.72rem;
  font-weight: 900;
}

.booking-card p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.4;
}

.empty {
  padding: 18px;
  border: 1px dashed #d6c9bd;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.58);
  color: var(--muted);
  text-align: center;
  font-weight: 750;
}

.memories-hero {
  padding: 24px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, #111111, #2e2925);
  color: #fff;
  box-shadow: var(--shadow);
}

.memories-hero p:last-child {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.72);
}

.memories-timeline {
  position: relative;
  display: grid;
  gap: 18px;
  margin-top: 20px;
  padding-left: 17px;
}

.memories-timeline::before {
  content: "";
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 5px;
  width: 2px;
  background: #dfd1c5;
}

.memory-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--card);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.timeline-dot {
  position: absolute;
  top: 23px;
  left: -18px;
  z-index: 3;
  width: 13px;
  height: 13px;
  border: 3px solid var(--bg);
  border-radius: 50%;
  background: var(--accent);
}

.memory-date {
  position: absolute;
  top: 13px;
  left: 13px;
  z-index: 2;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.82);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 900;
  backdrop-filter: blur(8px);
}

.memory-cover {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.memory-placeholder {
  display: grid;
  place-items: center;
  min-height: 185px;
  background:
    radial-gradient(
      circle at top right,
      rgba(232, 93, 69, 0.22),
      transparent 34%
    ),
    linear-gradient(135deg, #fffdf8, #fff2e7);
  font-size: 3.4rem;
}

.memory-body {
  padding: 17px;
}

.memory-body p {
  color: var(--muted);
  line-height: 1.5;
}

.memory-open-btn {
  width: 100%;
}

.voucher-list {
  display: grid;
  gap: 13px;
}

.voucher-card {
  position: relative;
  overflow: hidden;
  padding: 19px;
  border: 2px solid var(--dark);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(
      circle at top right,
      rgba(232, 93, 69, 0.24),
      transparent 34%
    ),
    #fff;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.09);
}

.voucher-card::after {
  content: "";
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 95px;
  height: 95px;
  border: 18px solid rgba(232, 93, 69, 0.1);
  border-radius: 50%;
}

.voucher-mark {
  display: inline-flex;
  margin-bottom: 16px;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--dark);
  color: #fff;
  font-weight: 900;
}

.voucher-card p {
  color: var(--muted);
  line-height: 1.45;
}

.voucher-code {
  display: inline-flex;
  margin: 4px 0 14px;
  padding: 8px 10px;
  border: 1px dashed #b8a99c;
  border-radius: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 900;
}

.voucher-buttons,
.prize-actions {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: end center;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.46);
}

.modal-panel {
  position: relative;
  width: min(100%, 540px);
  max-height: 92vh;
  overflow: auto;
  padding: 22px;
  border-radius: 30px 30px 0 0;
  background: #fff;
  box-shadow: 0 -20px 50px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.18s ease;
}

@keyframes slideUp {
  from {
    opacity: 0.7;
    transform: translateY(35px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 5;
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  font-size: 1.4rem;
  font-weight: 900;
}

.modal-icon {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  margin-bottom: 12px;
  border-radius: 22px;
  background: var(--accent-soft);
  font-size: 2rem;
}

.clean-list {
  display: grid;
  gap: 8px;
  margin: 12px 0 18px;
  padding: 0;
  list-style: none;
}

.clean-list li {
  padding: 10px 12px;
  border-radius: 14px;
  background: #f8f2ec;
  color: var(--muted);
  font-weight: 720;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}

.note {
  margin: 0;
  color: var(--muted);
  line-height: 1.4;
  font-weight: 750;
}

.game-panel {
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 214, 221, 0.55),
      transparent 32%
    ),
    #fff;
}

.round-information {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 18px 0 10px;
  padding: 11px 13px;
  border-radius: 16px;
  background: #f8f2ec;
}

.round-information strong {
  font-size: 0.94rem;
}

.round-information span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 800;
}

.scoreboard {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.score-box {
  padding: 14px 8px;
  border-radius: 20px;
  background: #fff;
  text-align: center;
  box-shadow: 0 8px 19px rgba(0, 0, 0, 0.06);
}

.score-box span {
  display: block;
  min-height: 32px;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 800;
}

.score-box strong {
  display: block;
  margin-top: 4px;
  font-size: 2.2rem;
  letter-spacing: -0.08em;
}

.score-divider {
  color: var(--muted);
  font-weight: 900;
}

.choice-arena {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 15px;
  border-radius: 24px;
  background: var(--dark);
  color: #fff;
}

.choice-fighter {
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
}

.fighter-name {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.choice-visual {
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  border: 2px solid rgba(255, 255, 255, 0.16);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 2.65rem;
}

.choice-visual.thinking {
  animation: machineThinking 0.28s linear infinite alternate;
}

@keyframes machineThinking {
  from {
    transform: rotate(-7deg) scale(0.96);
  }

  to {
    transform: rotate(7deg) scale(1.04);
  }
}

.choice-fighter strong {
  min-height: 20px;
  font-size: 0.82rem;
}

.versus {
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 950;
}

.round-result {
  display: grid;
  place-items: center;
  min-height: 62px;
  margin: 13px 0 0;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
  text-align: center;
  line-height: 1.4;
  font-weight: 800;
}

.game-choices {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-top: 14px;
}

.choice-btn {
  display: grid;
  gap: 5px;
  padding: 13px 7px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: #fff;
  font-weight: 900;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.choice-btn span {
  font-size: 1.8rem;
}

.choice-btn:hover {
  border-color: var(--accent);
}

.game-final {
  margin-top: 18px;
  text-align: center;
}

.game-final-icon {
  margin-bottom: 8px;
  font-size: 3.2rem;
}

.prize-reveal {
  margin-top: 17px;
  padding: 18px;
  border: 1px solid rgba(232, 93, 69, 0.22);
  border-radius: 22px;
  background: linear-gradient(135deg, #fff5d6, #ffe4dc);
}

.prize-reveal p {
  line-height: 1.45;
}

.daily-note {
  margin: 16px 0 0;
  color: var(--muted);
  text-align: center;
  font-size: 0.82rem;
  font-weight: 750;
}

.memory-panel {
  padding-bottom: 26px;
}

.gallery-viewer {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 260px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 24px;
  background: #111;
}

.gallery-viewer img {
  width: 100%;
  max-height: 65vh;
  object-fit: contain;
}

.gallery-arrow {
  position: absolute;
  top: 50%;
  z-index: 3;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
  color: #111;
  font-size: 1.7rem;
  font-weight: 900;
  transform: translateY(-50%);
}

#gallery-prev {
  left: 12px;
}

#gallery-next {
  right: 12px;
}

.gallery-counter {
  margin: 10px 0 0;
  color: var(--muted);
  text-align: center;
  font-weight: 850;
}

.letter-page {
  padding-bottom: 110px;
}

.back-link {
  margin-bottom: 14px;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--dark);
  font-weight: 900;
}

.letter-card {
  position: relative;
  overflow: hidden;
  padding: 26px;
  border: 1px solid rgba(232, 93, 69, 0.16);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 232, 239, 0.98),
      transparent 36%
    ),
    linear-gradient(180deg, #fffdf8, #ffffff);
  box-shadow: var(--shadow);
}

.letter-card::before {
  content: "";
  position: absolute;
  top: -45px;
  right: -45px;
  width: 130px;
  height: 130px;
  border-radius: 999px;
  background: rgba(232, 93, 69, 0.08);
}

.letter-stamp {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  margin-bottom: 14px;
  border-radius: 22px;
  background: var(--dark);
  color: #fff;
  font-size: 2rem;
}

.letter-card h2,
.letter-card .eyebrow,
.letter-content {
  position: relative;
  z-index: 2;
}

.letter-content {
  margin-top: 18px;
  color: #2d2926;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.04rem;
  line-height: 1.78;
}

.letter-content p {
  margin-bottom: 18px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 92px;
  z-index: 120;
  width: min(calc(100% - 30px), 500px);
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--dark);
  color: #fff;
  text-align: center;
  font-weight: 850;
  box-shadow: var(--shadow);
  transform: translateX(-50%);
}

.danger {
  color: #b42318;
}

@media (min-width: 640px) {
  .modal {
    place-items: center;
  }

  .modal-panel {
    max-height: 88vh;
    border-radius: var(--radius-xl);
  }
}

@media (max-width: 420px) {
  .voucher-buttons,
  .prize-actions {
    grid-template-columns: 1fr;
  }

  .game-choices {
    gap: 6px;
  }

  .choice-btn {
    font-size: 0.82rem;
  }

  .choice-visual {
    width: 66px;
    height: 66px;
    font-size: 2.2rem;
  }

  .round-information {
    align-items: start;
    flex-direction: column;
  }
}

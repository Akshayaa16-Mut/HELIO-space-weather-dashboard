import { useEffect, useMemo, useState } from "react";
import {
  getSolarFlares,
  getCMEs,
  getGeomagneticStorms,
  getSolarWindSpeed,
} from "./api";

import "./App.css";

/* ============================================================
   ICONS
============================================================ */

function SunIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 3v5M16 24v5M3 16h5M24 16h5M6.8 6.8l3.5 3.5M21.7 21.7l3.5 3.5M25.2 6.8l-3.5 3.5M10.3 21.7l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CMEIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="16"
        cy="16"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StormIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M6 17c0-5 4-9 9-9h4c4 0 7 3 7 7s-3 7-7 7h-8c-3 0-5-2-5-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M10 23c2 2 4 3 7 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M4 11h16c3 0 5-2 5-4s-2-4-4-4c-2 0-4 1-4 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M4 17h21c2 0 4 1 4 4s-2 4-4 4c-2 0-3-1-4-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M4 23h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SatelliteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17 17 7M5 19l4-4M15 9l4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <rect
        x="8"
        y="8"
        width="8"
        height="8"
        rx="1.5"
        transform="rotate(45 8 8)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function GPSIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CommunicationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M4 9v6M20 9v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3 7 9-7 9-7-9 7-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <circle
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
      />
    </svg>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function safeDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatDate(value) {
  const date = safeDate(value);

  if (!date) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function formatTime(value) {
  const date = safeDate(value);

  if (!date) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cmeDate(event) {
  return (
    event?.startTime ||
    event?.cmeAnalyses?.[0]?.time21_5 ||
    event?.cmeAnalyses?.[0]?.time27 ||
    null
  );
}

function stormDate(event) {
  return (
    event?.startTime ||
    event?.allKpIndex?.[0]?.observedTime ||
    null
  );
}

/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  type,
  label,
  value,
  unit,
  description,
  status,
  icon,
}) {
  return (
    <article className={`metric-card ${type}`}>
      <div className="metric-card-top">
        <div className="metric-label">
          {label}
        </div>

        <div
          className={`metric-status ${
            status === "LIVE"
              ? "success"
              : status === "UNAVAILABLE"
              ? "error"
              : "loading"
          }`}
        >
          {status}
        </div>
      </div>

      <div className="metric-main">
        <div className="metric-value">
          {value}
        </div>

        {unit && (
          <div className="metric-unit">
            {unit}
          </div>
        )}
      </div>

      <div className="metric-description">
        {description}
      </div>

      <div className="metric-icon">
        {icon}
      </div>
    </article>
  );
}

/* ============================================================
   IMPACT ITEM
============================================================ */

function ImpactItem({
  icon,
  title,
  description,
  status,
  statusClass = "",
}) {
  return (
    <div className="impact-item">
      <div className="impact-icon">
        {icon}
      </div>

      <div className="impact-content">
        <div className="impact-title">
          {title}
        </div>

        <div className="impact-description">
          {description}
        </div>
      </div>

      <div
        className={`impact-status ${statusClass}`}
      >
        <span className="status-dot" />
        {status}
      </div>
    </div>
  );
}

/* ============================================================
   EVENT ITEM
============================================================ */

function EventItem({
  type,
  title,
  description,
  date,
  time,
  className = "",
}) {
  return (
    <div className="event-item">
      <div
        className={`event-indicator ${className}`}
      >
        {type === "flare" && <SunIcon />}
        {type === "cme" && <CMEIcon />}
        {type === "storm" && <StormIcon />}
      </div>

      <div className="event-content">
        <div className="event-type">
          {type === "flare" && "SOLAR FLARE"}
          {type === "cme" && "CORONAL MASS EJECTION"}
          {type === "storm" && "GEOMAGNETIC STORM"}
        </div>

        <div className="event-title">
          {title}
        </div>

        <div className="event-meta">
          {description}
        </div>
      </div>

      <div className="event-date">
        <span>{date}</span>
        <small>{time}</small>
      </div>
    </div>
  );
}

/* ============================================================
   APP
============================================================ */

export default function App() {
  const [flares, setFlares] = useState([]);
  const [cmes, setCMEs] = useState([]);
  const [storms, setStorms] = useState([]);
  const [solarWind, setSolarWind] = useState(null);

  const [sourceStatus, setSourceStatus] =
    useState({
      flares: "loading",
      cmes: "loading",
      storms: "loading",
      solarWind: "loading",
    });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ==========================================================
     DATA LOADING
  ========================================================== */

  async function loadData(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const results =
      await Promise.allSettled([
        getSolarFlares(),
        getCMEs(),
        getGeomagneticStorms(),
        getSolarWindSpeed(),
      ]);

    const nextStatus = {
      flares: "offline",
      cmes: "offline",
      storms: "offline",
      solarWind: "offline",
    };

    /* Solar flares */

    if (
      results[0].status ===
      "fulfilled"
    ) {
      setFlares(
        Array.isArray(results[0].value)
          ? results[0].value
          : []
      );

      nextStatus.flares = "online";
    } else {
      console.error(
        "Solar Flare API:",
        results[0].reason
      );

      setFlares([]);
    }

    /* CME */

    if (
      results[1].status ===
      "fulfilled"
    ) {
      setCMEs(
        Array.isArray(results[1].value)
          ? results[1].value
          : []
      );

      nextStatus.cmes = "online";
    } else {
      console.error(
        "CME API:",
        results[1].reason
      );

      setCMEs([]);
    }

    /* Geomagnetic storms */

    if (
      results[2].status ===
      "fulfilled"
    ) {
      setStorms(
        Array.isArray(results[2].value)
          ? results[2].value
          : []
      );

      nextStatus.storms = "online";
    } else {
      console.error(
        "Storm API:",
        results[2].reason
      );

      setStorms([]);
    }

    /* Solar wind */

    if (
      results[3].status ===
      "fulfilled"
    ) {
      setSolarWind(
        results[3].value || null
      );

      nextStatus.solarWind = "online";
    } else {
      console.error(
        "Solar Wind API:",
        results[3].reason
      );

      setSolarWind(null);
    }

    setSourceStatus(nextStatus);

    const failed =
      results.filter(
        (item) =>
          item.status === "rejected"
      ).length;

    if (failed === 4) {
      setError(
        "All data sources are unavailable."
      );
    } else if (failed > 0) {
      setError(
        `${failed} data source${
          failed > 1 ? "s" : ""
        } unavailable.`
      );
    }

    setLoading(false);
    setRefreshing(false);
  }

  /* ==========================================================
     INITIAL LOAD + AUTO REFRESH
  ========================================================== */

  useEffect(() => {
    loadData();

    const interval =
      setInterval(() => {
        loadData(true);
      }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* ==========================================================
     GLOBAL STATUS
  ========================================================== */

  const onlineCount =
    Object.values(
      sourceStatus
    ).filter(
      (value) =>
        value === "online"
    ).length;

  const overallStatus =
    loading
      ? "loading"
      : onlineCount === 4
      ? "online"
      : onlineCount > 0
      ? "partial"
      : "offline";

  const overallStatusText =
    overallStatus === "online"
      ? "LIVE"
      : overallStatus === "partial"
      ? "PARTIAL"
      : overallStatus === "offline"
      ? "OFFLINE"
      : "LOADING";

  /* ==========================================================
     SOLAR WIND
  ========================================================== */

  const windSpeed =
    solarWind?.proton_speed ?? null;

  /* ==========================================================
     HELIO ACTIVITY INDEX
  ========================================================== */

  const activityIndex =
    useMemo(() => {
      const flareScore =
        Math.min(
          flares.length * 3,
          35
        );

      const cmeScore =
        Math.min(
          cmes.length * 4,
          30
        );

      const stormScore =
        Math.min(
          storms.length * 5,
          35
        );

      return Math.round(
        flareScore +
          cmeScore +
          stormScore
      );
    }, [
      flares,
      cmes,
      storms,
    ]);

  const activityLabel =
    activityIndex < 25
      ? "LOW"
      : activityIndex < 55
      ? "MODERATE"
      : activityIndex < 80
      ? "ELEVATED"
      : "HIGH";

  /* ==========================================================
     CHART DATA
  ========================================================== */

  const chartData =
    useMemo(() => {
      const days = [];

      for (
        let i = 6;
        i >= 0;
        i--
      ) {
        const date = new Date();

        date.setHours(
          0,
          0,
          0,
          0
        );

        date.setDate(
          date.getDate() - i
        );

        days.push({
          date,
          label:
            date.toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
              }
            ),
          flares: 0,
          cmes: 0,
          storms: 0,
        });
      }

      function addEvent(
        eventDate,
        key
      ) {
        const date =
          safeDate(eventDate);

        if (!date) return;

        const target =
          days.find(
            (day) =>
              day.date.getFullYear() ===
                date.getFullYear() &&
              day.date.getMonth() ===
                date.getMonth() &&
              day.date.getDate() ===
                date.getDate()
          );

        if (target) {
          target[key] += 1;
        }
      }

      flares.forEach((event) => {
        addEvent(
          event?.beginTime,
          "flares"
        );
      });

      cmes.forEach((event) => {
        addEvent(
          cmeDate(event),
          "cmes"
        );
      });

      storms.forEach((event) => {
        addEvent(
          stormDate(event),
          "storms"
        );
      });

      return days;
    }, [
      flares,
      cmes,
      storms,
    ]);

  const chartMax =
    Math.max(
      1,
      ...chartData.flatMap(
        (day) => [
          day.flares,
          day.cmes,
          day.storms,
        ]
      )
    );

  /* ==========================================================
     LATEST EVENTS
  ========================================================== */

  const latestEvents =
    useMemo(() => {
      const events = [];

      flares.forEach(
        (event) => {
          const date =
            event?.beginTime;

          events.push({
            type: "flare",
            title: event?.classType
              ? `${event.classType} solar flare`
              : "Solar flare observation",
            description:
              event?.sourceLocation ||
              "Solar flare detected",
            date: formatDate(date),
            time: formatTime(date),
            timestamp:
              safeDate(date)?.getTime() ||
              0,
            className:
              event?.classType?.startsWith(
                "X"
              )
                ? "danger"
                : event?.classType?.startsWith(
                    "M"
                  )
                ? "warning"
                : "normal",
          });
        }
      );

      cmes.forEach(
        (event) => {
          const date =
            cmeDate(event);

          events.push({
            type: "cme",
            title:
              "Coronal mass ejection",
            description:
              event?.sourceLocation ||
              "CME observation",
            date: formatDate(date),
            time: formatTime(date),
            timestamp:
              safeDate(date)?.getTime() ||
              0,
            className: "blue",
          });
        }
      );

      storms.forEach(
        (event) => {
          const date =
            stormDate(event);

          events.push({
            type: "storm",
            title:
              "Geomagnetic storm activity",
            description:
              "Recent geomagnetic activity",
            date: formatDate(date),
            time: formatTime(date),
            timestamp:
              safeDate(date)?.getTime() ||
              0,
            className: "purple",
          });
        }
      );

      return events
        .sort(
          (a, b) =>
            b.timestamp -
            a.timestamp
        )
        .slice(0, 6);
    }, [
      flares,
      cmes,
      storms,
    ]);

  /* ==========================================================
     IMPACT STATUS
  ========================================================== */

  const satelliteStatus =
    activityIndex >= 60
      ? "Watch"
      : "Monitoring";

  const gpsStatus =
    storms.length >= 3
      ? "Elevated"
      : storms.length > 0
      ? "Watch"
      : "Monitoring";

  const communicationStatus =
    cmes.length >= 5
      ? "Watch"
      : "Monitoring";

  const missionStatus =
    activityIndex >= 70
      ? "Watch"
      : "Monitoring";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="app-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            ◒
          </div>

          <div>
            <div className="brand-name">
              HELIO
            </div>

            <div className="brand-subtitle">
              SPACE WEATHER
            </div>
          </div>

        </div>

        <nav className="sidebar-nav">

          <a
            href="#dashboard"
            className="nav-item active"
          >
            <span className="nav-icon">
              ⌂
            </span>
            Dashboard
          </a>

          <a
            href="#metrics"
            className="nav-item"
          >
            <span className="nav-icon">
              ☼
            </span>
            Solar Activity
          </a>

          <a
            href="#events"
            className="nav-item"
          >
            <span className="nav-icon">
              ≋
            </span>
            Event Stream
          </a>

          <a
            href="#metrics"
            className="nav-item"
          >
            <span className="nav-icon">
              ∿
            </span>
            Solar Wind
          </a>

          <a
            href="#earth"
            className="nav-item"
          >
            <span className="nav-icon">
              ◉
            </span>
            Geomagnetic
          </a>

          <a
            href="#activity"
            className="nav-item"
          >
            <span className="nav-icon">
              ⌁
            </span>
            Analytics
          </a>

          <a
            href="#sources"
            className="nav-item"
          >
            <span className="nav-icon">
              ⚙
            </span>
            Settings
          </a>

        </nav>

        <div className="sidebar-bottom">

          <div className="data-source-box">

            <div className="source-label">
              DATA SOURCES
            </div>

            <div className="source-name">
              NASA DONKI
            </div>

            <div className="source-name">
              NOAA SWPC
            </div>

            <div
              className={`connection-status ${overallStatus}`}
              style={{
                marginTop: "14px",
              }}
            >
              <span className="status-dot" />
              {overallStatusText}
            </div>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div className="topbar-left">

            <span className="breadcrumb">
              REAL-TIME OBSERVATORY
            </span>

          </div>

          <div className="topbar-right">

            <div
              className={`live-indicator ${overallStatus}`}
            >
              <span className="status-dot" />
              {overallStatusText}
            </div>

            <button
              className="refresh-button"
              onClick={() =>
                loadData(true)
              }
              disabled={refreshing}
            >
              <span
                className={
                  refreshing
                    ? "refresh-icon spinning"
                    : "refresh-icon"
                }
              >
                ↻
              </span>

              Refresh
            </button>

          </div>

        </header>

        {/* WARNING */}

        {error && (
          <div className="api-warning">

            <div className="api-warning-icon">
              !
            </div>

            <div>
              <strong>
                Partial data availability
              </strong>

              <span>
                {error}
              </span>
            </div>

          </div>
        )}

        {/* ===================================================
            HERO
        =================================================== */}

        <section
          id="dashboard"
          className="hero-section"
        >

          <div className="hero-copy">

            <div className="eyebrow">
              01 — SOLAR ENVIRONMENT
            </div>

            <h1>
              Space Weather
              <br />
              <span>
                in Motion
              </span>
            </h1>

            <p>
              Monitor solar activity, track
              space-weather conditions, and
              understand their impact on Earth
              in real time.
            </p>

            <div className="hero-meta">

              <div className="meta-item">

                <span className="meta-label">
                  DATA SOURCES
                </span>

                <span className="meta-value">
                  NASA + NOAA
                </span>

              </div>

              <div className="meta-item">

                <span className="meta-label">
                  UPDATE
                </span>

                <span className="meta-value">
                  Every 5 minutes
                </span>

              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="orbit orbit-one" />

            <div className="orbit orbit-two" />

            <div className="sun-glow" />

            <div className="sun">

              <div className="sun-surface" />

              <div className="sun-flare flare-one" />

              <div className="sun-flare flare-two" />

              <div className="sun-flare flare-three" />

            </div>

            <div className="floating-card wind-card">

              <div className="floating-card-label">
                SOLAR WIND
              </div>

              <div>
                <span className="floating-card-value">
                  {windSpeed ?? "—"}
                </span>

                <span className="floating-card-unit">
                  km/s
                </span>
              </div>

              <div className="floating-card-line" />

              <div className="floating-card-status">
                {sourceStatus.solarWind ===
                "online"
                  ? "LIVE FROM NOAA"
                  : "DATA UNAVAILABLE"}
              </div>

            </div>

            <div className="floating-card storm-card">

              <div className="floating-card-label">
                GEOMAGNETIC STORM
              </div>

              <div className="floating-card-value">
                {storms.length > 0
                  ? `${storms.length} EVENT${
                      storms.length > 1
                        ? "S"
                        : ""
                    }`
                  : "MONITORING"}
              </div>

              <div className="floating-card-line" />

              <div className="floating-card-status">
                NASA DONKI
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            INDEX
        =================================================== */}

        <section className="index-section">

          <div className="index-card">

            <div className="index-info">

              <div className="eyebrow">
                HELIO ACTIVITY
              </div>

              <h2>
                Space Weather Index
              </h2>

              <p>
                Custom composite indicator
                based on recent solar flares,
                CME events, and geomagnetic
                storm observations.
              </p>

              <div className="index-legend">

                <span>
                  0–24 LOW
                </span>

                <span>
                  25–54 MODERATE
                </span>

                <span>
                  55–79 ELEVATED
                </span>

                <span>
                  80+ HIGH
                </span>

              </div>

            </div>

            <div className="index-meter">

              <div className="index-number">
                {activityIndex}
              </div>

              <div className="index-unit">
                / 100
              </div>

              <div className="index-label">
                {activityLabel}
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            LIVE METRICS
        =================================================== */}

        <section
          id="metrics"
          className="metrics-section"
        >

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                SOLAR ACTIVITY
              </span>

              <h2>
                Live Metrics
              </h2>

            </div>

            <div className="section-period">
              LAST 7 DAYS
            </div>

          </div>

          <div className="metrics-grid">

            <MetricCard
              type="orange"
              label="Solar Flares"
              value={flares.length}
              unit="EVENTS"
              description="Solar flare events detected"
              status={
                sourceStatus.flares ===
                "online"
                  ? "LIVE"
                  : sourceStatus.flares ===
                    "loading"
                  ? "LOADING"
                  : "UNAVAILABLE"
              }
              icon={<SunIcon />}
            />

            <MetricCard
              type="purple"
              label="CME Events"
              value={cmes.length}
              unit="EVENTS"
              description="Coronal mass ejections"
              status={
                sourceStatus.cmes ===
                "online"
                  ? "LIVE"
                  : sourceStatus.cmes ===
                    "loading"
                  ? "LOADING"
                  : "UNAVAILABLE"
              }
              icon={<CMEIcon />}
            />

            <MetricCard
              type="blue"
              label="Geomagnetic Storms"
              value={storms.length}
              unit="EVENTS"
              description="Geomagnetic storm events"
              status={
                sourceStatus.storms ===
                "online"
                  ? "LIVE"
                  : sourceStatus.storms ===
                    "loading"
                  ? "LOADING"
                  : "UNAVAILABLE"
              }
              icon={<StormIcon />}
            />

            <MetricCard
              type="cyan"
              label="Solar Wind"
              value={
                windSpeed ?? "—"
              }
              unit="km/s"
              description="Current proton speed"
              status={
                sourceStatus.solarWind ===
                "online"
                  ? "LIVE"
                  : sourceStatus.solarWind ===
                    "loading"
                  ? "LOADING"
                  : "UNAVAILABLE"
              }
              icon={<WindIcon />}
            />

          </div>

        </section>

        {/* ===================================================
            ACTIVITY + EVENTS
        =================================================== */}

        <section
          id="activity"
          className="activity-layout"
        >

          <div className="activity-chart-panel">

            <div className="section-heading">

              <div>

                <span className="section-eyebrow">
                  02 / ACTIVITY
                </span>

                <h2>
                  Solar Activity Overview
                </h2>

              </div>

              <div className="section-period">
                LAST 7 DAYS
              </div>

            </div>

            <div className="chart-card">

              <div className="native-chart">

                <div className="chart-y-axis">

                  <span>
                    {chartMax}
                  </span>

                  <span>
                    {Math.round(
                      chartMax * 0.75
                    )}
                  </span>

                  <span>
                    {Math.round(
                      chartMax * 0.5
                    )}
                  </span>

                  <span>
                    {Math.round(
                      chartMax * 0.25
                    )}
                  </span>

                  <span>
                    0
                  </span>

                </div>

                <div className="chart-area">

                  <div className="chart-grid">

                    <div className="chart-grid-line" />
                    <div className="chart-grid-line" />
                    <div className="chart-grid-line" />
                    <div className="chart-grid-line" />

                  </div>

                  <div className="bar-chart">

                    {chartData.map(
                      (day) => (
                        <div
                          className="chart-column"
                          key={day.label}
                        >

                          <div className="chart-bars">

                            <div
                              className="chart-bar flare-bar"
                              style={{
                                height: `${Math.max(
                                  3,
                                  (day.flares /
                                    chartMax) *
                                    100
                                )}%`,
                              }}
                            />

                            <div
                              className="chart-bar cme-bar"
                              style={{
                                height: `${Math.max(
                                  3,
                                  (day.cmes /
                                    chartMax) *
                                    100
                                )}%`,
                              }}
                            />

                            <div
                              className="chart-bar storm-bar"
                              style={{
                                height: `${Math.max(
                                  3,
                                  (day.storms /
                                    chartMax) *
                                    100
                                )}%`,
                              }}
                            />

                          </div>

                          <div className="chart-date">
                            {day.label}
                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>

              <div className="chart-legend">

                <span>
                  <i className="legend-dot flare" />
                  Solar Flares
                </span>

                <span>
                  <i className="legend-dot cme" />
                  CME Events
                </span>

                <span>
                  <i className="legend-dot storm" />
                  Geomagnetic Storms
                </span>

              </div>

            </div>

          </div>

          <div
            id="events"
            className="events-panel"
          >

            <div className="section-heading">

              <div>

                <span className="section-eyebrow">
                  03 / LIVE STREAM
                </span>

                <h2>
                  Latest Events
                </h2>

              </div>

            </div>

            <div className="events-card">

              {loading ? (
                <div className="empty-state">

                  <div className="loading-orb" />

                  <strong>
                    Loading data
                  </strong>

                  <span>
                    Connecting to NASA and NOAA.
                  </span>

                </div>
              ) : latestEvents.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-icon">
                    ◌
                  </div>

                  <strong>
                    No recent events
                  </strong>

                  <span>
                    No events returned for
                    the current 7-day window.
                  </span>

                </div>
              ) : (
                latestEvents.map(
                  (event, index) => (
                    <EventItem
                      key={`${event.type}-${event.timestamp}-${index}`}
                      {...event}
                    />
                  )
                )
              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            EARTH IMPACT
        =================================================== */}

        <section
          id="earth"
          className="earth-section"
        >

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                04 / EARTH
              </span>

              <h2>
                Earth Impact
              </h2>

            </div>

          </div>

          <div className="earth-grid">

            <div className="earth-visual-card">

              <div className="earth-orbit" />

              <div className="earth">

                <div className="earth-land land-one" />
                <div className="earth-land land-two" />
                <div className="earth-land land-three" />

                <div className="earth-cloud cloud-one" />
                <div className="earth-cloud cloud-two" />

              </div>

              <div className="earth-label">
                EARTH SYSTEM
              </div>

            </div>

            <div className="impact-list">

              <ImpactItem
                icon={<SatelliteIcon />}
                title="Satellites"
                description="Satellite operations and monitoring"
                status={satelliteStatus}
                statusClass={
                  satelliteStatus ===
                  "Watch"
                    ? "watch"
                    : ""
                }
              />

              <ImpactItem
                icon={<GPSIcon />}
                title="GPS & Navigation"
                description="Navigation signal reliability"
                status={gpsStatus}
                statusClass={
                  gpsStatus ===
                  "Elevated"
                    ? "elevated"
                    : gpsStatus ===
                      "Watch"
                    ? "watch"
                    : ""
                }
              />

              <ImpactItem
                icon={<CommunicationIcon />}
                title="Communication"
                description="Radio and communication systems"
                status={communicationStatus}
                statusClass={
                  communicationStatus ===
                  "Watch"
                    ? "watch"
                    : ""
                }
              />

              <ImpactItem
                icon={<MissionIcon />}
                title="Space Missions"
                description="Mission environment awareness"
                status={missionStatus}
                statusClass={
                  missionStatus ===
                  "Watch"
                    ? "watch"
                    : ""
                }
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            SOURCES
        =================================================== */}

        <section
          id="sources"
          className="sources-section"
        >

          <div className="sources-card">

            <div>

              <span className="section-eyebrow">
                DATA INFRASTRUCTURE
              </span>

              <h3>
                NASA + NOAA
              </h3>

              <p>
                HELIO combines NASA DONKI
                observations with NOAA SWPC
                solar-wind measurements to
                present a unified space-weather
                observatory.
              </p>

            </div>

            <div className="source-badges">

              <div className="source-badge">
                <strong>NASA</strong>
                <span>DONKI</span>
              </div>

              <div className="source-badge">
                <strong>NOAA</strong>
                <span>SWPC</span>
              </div>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <div>
            DATA PROVIDER&nbsp;&nbsp;
            <strong>NASA</strong>
          </div>

          <div>
            DATABASE&nbsp;&nbsp;
            <strong>DONKI</strong>
          </div>

          <div
            className={`footer-status ${overallStatus}`}
          >
            <span className="status-dot" />
            SYSTEM STATUS&nbsp;
            {overallStatusText}
          </div>

          <div>
            HELIO / 2026
          </div>

        </footer>

      </main>
    </div>
  );
}
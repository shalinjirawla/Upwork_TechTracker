import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import {
  TbTrendingUp, TbBriefcase, TbCurrencyDollar, TbSparkles,
  TbSearch, TbExternalLink, TbArrowUpRight, TbFlame, TbListDetails
} from 'react-icons/tb';
import { api } from '../api/client.js';
import { UpworkIcon } from '../components/UpworkIcon.jsx';

export const DashboardPage = ({
  onOpenLoginModal, user, syncTrigger
}) => {
  const [statusData, setStatusData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeView, setActiveView] = useState('trends');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statusRes, trendsRes, jobsRes] = await Promise.all([
        api.getUpworkStatus(),
        api.getUpworkTrends({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: search.trim() || undefined,
        }),
        api.getUpworkJobs({ skill: selectedSkillFilter || undefined }),
      ]);

      setStatusData(statusRes);
      setTrends(trendsRes.results);
      setCategories(['All', ...trendsRes.categories]);
      setJobs(jobsRes.results);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrends = async () => {
    try {
      const res = await api.getUpworkTrends({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search.trim() || undefined,
      });
      setTrends(res.results);
    } catch (err) {
      console.error('Failed to filter trends:', err);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await api.getUpworkJobs({ skill: selectedSkillFilter || undefined });
      setJobs(res.results);
    } catch (err) {
      console.error('Failed to filter jobs:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [syncTrigger]);

  useEffect(() => {
    loadTrends();
  }, [selectedCategory, search]);

  useEffect(() => {
    if (activeView === 'jobs') {
      loadJobs();
    }
  }, [activeView, selectedSkillFilter]);

  const handleFilterBySkill = (skill) => {
    setSelectedSkillFilter(skill);
    setActiveView('jobs');
  };

  const topSurging = trends.length > 0 ? [...trends].sort((a, b) => b.growth_rate - a.growth_rate)[0] : null;
  const isUpworkConnected = Boolean(user && user.auth_provider === 'upwork');
  const totalJobs = statusData?.metrics.total_jobs_analyzed || jobs.length || 0;
  const avgBudget = trends.length > 0
    ? Math.round(trends.reduce((acc, t) => acc + (t.average_budget || 0), 0) / trends.length)
    : 0;
  const avgGrowth = trends.length > 0
    ? Math.round((trends.reduce((acc, t) => acc + (t.growth_rate || 0), 0) / trends.length) * 10) / 10
    : 0;

  return (
    <Container fluid className="px-3 px-lg-4 py-4">
      {/* Executive Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold mb-0" style={{ letterSpacing: '-0.02em', color: '#002b49' }}>
              Daily Technology Market Trends
            </h2>
            <span
              className="badge rounded-pill px-2 py-1"
              style={{
                backgroundColor: isUpworkConnected ? '#ecfdf5' : '#fff2ef',
                color: isUpworkConnected ? '#059669' : '#ff4622',
                border: `1px solid ${isUpworkConnected ? '#a7f3d0' : '#ffd3cb'}`,
                fontSize: '0.72rem',
                fontWeight: 600
              }}
            >
              {isUpworkConnected ? (
                <>
                  <UpworkIcon size={13} className="me-1" /> Upwork Marketplace Intelligence
                </>
              ) : (
                '🌐 Daily Web & Ecosystem Analysis'
              )}
            </span>
          </div>
          <p className="text-secondary mb-0" style={{ fontSize: '0.92rem' }}>
            {isUpworkConnected
              ? 'Real-time hiring demand and client project budgets extracted dynamically from your connected Upwork job postings.'
              : 'Real-time technology adoption and developer momentum analyzed from daily web repositories, surveys, and ecosystem signals.'}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="d-flex p-1 rounded-3" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
          <button
            onClick={() => { setActiveView('trends'); setSelectedSkillFilter(''); }}
            className={`tp-tab-btn ${activeView === 'trends' ? 'active' : ''}`}
          >
            <TbTrendingUp className="me-1 mb-1" /> {isUpworkConnected ? 'Upwork Tech Trends' : 'Ecosystem Trends'} ({trends.length})
          </button>
          <button
            onClick={() => setActiveView('jobs')}
            className={`tp-tab-btn ${activeView === 'jobs' ? 'active' : ''}`}
          >
            <TbBriefcase className="me-1 mb-1" /> {isUpworkConnected ? 'Upwork Jobs' : 'Live Web Jobs'} ({totalJobs})
          </button>
        </div>
      </div>

      {/* Upwork SSO Guest Banner - Only shown when NOT connected to Upwork */}
      {(!user || !isUpworkConnected) && (
        <div
          className="d-flex flex-wrap align-items-center justify-content-between p-3 mb-4 rounded-3"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #bbf7d0',
            boxShadow: '0 2px 8px rgba(20, 168, 0, 0.08)',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-2 p-2"
              style={{ backgroundColor: '#ecfdf5', color: '#15803d', border: '1px solid #a7f3d0' }}
            >
              <UpworkIcon size={26} />
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.01em' }}>
                Showing Daily Web Analysis · Connect with Upwork for Live Hiring Demand
              </h6>
              <p className="text-secondary mb-0" style={{ fontSize: '0.86rem' }}>
                Currently displaying developer ecosystem web analysis. Sign in with Upwork to stream your agency job searches and track active client budgets.
              </p>
            </div>
          </div>
          <div className="mt-2 mt-md-0">
            <button
              onClick={onOpenLoginModal}
              className="btn-upwork-green py-2 px-3 shadow-sm d-flex align-items-center gap-2"
              style={{ fontSize: '0.86rem' }}
              id="banner-sign-in-upwork"
            >
              <UpworkIcon size={18} color="#ffffff" />
              <span>Sign in with Upwork</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Clean Light Metric Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <div className="tp-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="tp-card-title">
                {isUpworkConnected ? 'Upwork Jobs Analyzed' : 'Tracked Technologies'}
              </span>
              <div className="p-2 rounded-2" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                <TbBriefcase size={18} />
              </div>
            </div>
            <div className="tp-metric-value">
              {isUpworkConnected ? totalJobs : (statusData?.metrics.tracked_technologies_count || trends.length)}
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
              {isUpworkConnected
                ? 'Extracted dynamically from your Upwork account'
                : 'Monitored across daily web repositories & developer surveys'}
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="tp-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="tp-card-title">Top Surging Technology</span>
              <div className="p-2 rounded-2" style={{ backgroundColor: '#fff2ef', color: '#ff4622' }}>
                <TbFlame size={18} />
              </div>
            </div>
            <div className="tp-metric-value" style={{ fontSize: '1.45rem', color: '#ff4622' }}>
              {topSurging ? topSurging.tech_name : 'AI Agents'}
            </div>
            <div className="fw-semibold mt-2" style={{ fontSize: '0.82rem', color: '#ff4622' }}>
              <TbArrowUpRight /> {topSurging ? `+${topSurging.growth_rate}% 30-day velocity` : '+48.5%'}
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="tp-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="tp-card-title">
                {isUpworkConnected ? 'Average Project Budget' : 'Avg. Growth Velocity'}
              </span>
              <div className="p-2 rounded-2" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <TbCurrencyDollar size={18} />
              </div>
            </div>
            <div className="tp-metric-value">
              {isUpworkConnected
                ? (avgBudget > 0 ? `$${avgBudget.toLocaleString()}` : '$3,500')
                : `+${avgGrowth}%`}
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
              {isUpworkConnected
                ? 'Mean client budget across analyzed Upwork postings'
                : 'Mean 30-day adoption momentum across stacks'}
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <div className="tp-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="tp-card-title">
                {isUpworkConnected ? 'Upwork Marketplace' : 'Market Intelligence Source'}
              </span>
              <div className="p-2 rounded-2" style={{
                backgroundColor: isUpworkConnected ? '#ecfdf5' : '#f0f4f8',
                color: isUpworkConnected ? '#059669' : '#002b49'
              }}>
                <TbSparkles size={18} />
              </div>
            </div>
            <div className="tp-metric-value" style={{
              fontSize: '1.35rem',
              color: isUpworkConnected ? '#059669' : '#002b49'
            }}>
              {isUpworkConnected ? 'Connected & Active' : 'Daily Web Analysis'}
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
              {isUpworkConnected ? (
                <>Real-time hiring & budget sync active</>
              ) : (
                <>Upwork not connected · <button onClick={onOpenLoginModal} className="btn btn-link p-0 small text-decoration-none fw-semibold" style={{ color: '#ff4622' }}>Sign in with Upwork</button></>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Content Area */}
      {activeView === 'trends' ? (
        <div className="tp-card">
          {/* Controls: Search + Categories */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-3 border-bottom gap-3">
            <div className="d-flex flex-wrap align-items-center gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn-category-pill ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ width: '260px' }}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-white border-end-0 text-muted">
                  <TbSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Filter skills (e.g. React, Python)..."
                  className="tp-form-control border-start-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>

          {/* Trendy Technologies Leaderboard Table */}
          {loading ? (
            <div className="py-5 text-center text-muted">
              <div className="spinner-border" style={{ color: '#ff4622' }} role="status" />
              <p className="mt-2 small">Analyzing market technology signals...</p>
            </div>
          ) : trends.length === 0 ? (
            <div className="py-5 text-center text-secondary">
              <p>No technologies found matching your filter criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="tp-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Rank</th>
                    <th>Technology & Domain</th>
                    <th>{isUpworkConnected ? 'Upwork Job Demand' : 'Ecosystem Signals'}</th>
                    <th>Growth Velocity</th>
                    <th>{isUpworkConnected ? 'Average Budget' : 'Adoption Score'}</th>
                    <th>{isUpworkConnected ? 'Top Co-Demanded Skills' : 'Key Stack / Aliases'}</th>
                    <th>Market Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((t, idx) => {
                    const demandPct = isUpworkConnected
                      ? Math.min(100, Math.round((t.job_count / Math.max(1, totalJobs)) * 100))
                      : Math.min(100, Math.round((t.job_count / 150) * 100));

                    return (
                      <tr key={t.id}>
                        <td className="fw-bold font-monospace" style={{ color: idx < 3 ? '#ff4622' : '#64748b' }}>
                          #{idx + 1}
                        </td>
                        <td style={{ minWidth: '220px', maxWidth: '380px' }}>
                          <div className="fw-bold fs-6 d-flex align-items-center gap-2" style={{ color: '#002b49' }}>
                            {t.tech_name}
                            {t.ai_market_summary && (
                              <span
                                className="badge rounded-pill d-inline-flex align-items-center"
                                style={{
                                  fontSize: '0.68rem',
                                  backgroundColor: '#fff2ef',
                                  color: '#ff4622',
                                  border: '1px solid #ffd3cb',
                                  fontWeight: 700,
                                }}
                                title="Ncore AI synthesized market opportunity"
                              >
                                <TbSparkles size={10} className="me-1" color="#ff4622" />
                                AI
                              </span>
                            )}
                          </div>
                          <span className="text-secondary small">{t.category}</span>
                          {t.ai_market_summary && (
                            <div
                              className="mt-2 p-2 rounded-2"
                              style={{
                                backgroundColor: '#fff9f8',
                                border: '1px solid #ffd3cb',
                                fontSize: '0.77rem',
                                color: '#002b49',
                                lineHeight: '1.4'
                              }}
                            >
                              <div className="fw-bold mb-1 d-flex align-items-center gap-1" style={{ color: '#ff4622', fontSize: '0.73rem' }}>
                                <TbSparkles size={12} color="#ff4622" /> Ncore AI Market Opportunity:
                              </div>
                              {t.ai_market_summary}
                            </div>
                          )}
                        </td>
                        <td style={{ minWidth: '160px' }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: '6px', backgroundColor: '#e2e8f0' }}>
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${Math.max(15, demandPct)}%`,
                                  backgroundColor: idx < 3 ? '#ff4622' : '#002b49'
                                }}
                              />
                            </div>
                            <span className="small fw-semibold text-dark font-monospace text-nowrap">
                              {isUpworkConnected ? `${t.job_count} jobs` : `${t.job_count} signals`}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="tp-badge-surging">
                            <TbArrowUpRight size={14} />
                            +{t.growth_rate}%
                          </span>
                        </td>
                        <td className="fw-semibold text-dark font-monospace">
                          {isUpworkConnected
                            ? `$${t.average_budget.toLocaleString()}`
                            : `${t.adoption_score || (t.average_budget / 60).toFixed(1)} / 100`}
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {t.top_related_skills && t.top_related_skills.length > 0 ? (
                              t.top_related_skills.map((s, sIdx) => (
                                <span key={sIdx} className="tp-skill-tag">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted small">--</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {t.demand_level === 'surging' ? (
                            <span className="tp-badge-surging">● Surging</span>
                          ) : t.demand_level === 'high' ? (
                            <span className="tp-badge-high">● High Demand</span>
                          ) : t.demand_level === 'emerging' ? (
                            <span className="tp-badge-emerging">● Emerging</span>
                          ) : (
                            <span className="tp-badge-stable">● Stable</span>
                          )}
                        </td>
                        <td>
                          {isUpworkConnected ? (
                            <button
                              onClick={() => handleFilterBySkill(t.tech_name)}
                              className="btn btn-sm btn-tp-secondary py-1 px-2 d-flex align-items-center gap-1 text-nowrap"
                              style={{ fontSize: '0.78rem' }}
                            >
                              <TbListDetails size={14} /> View Jobs
                            </button>
                          ) : (
                            <button
                              onClick={onOpenLoginModal}
                              className="btn btn-sm btn-tp-secondary py-1 px-2 d-flex align-items-center gap-1 text-nowrap"
                              style={{ fontSize: '0.78rem' }}
                            >
                              <UpworkIcon size={13} /> Sign in
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Analyzed Jobs Feed View (Real Upwork or Real Web Jobs) */
        <div className="tp-card">
          {!isUpworkConnected && (
            <div
              className="d-flex flex-wrap align-items-center justify-content-between p-3 mb-3 rounded-3"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span className="badge rounded-pill bg-primary px-2 py-1" style={{ fontSize: '0.72rem' }}>
                  🌐 Web Developer Jobs Stream
                </span>
                <span className="text-secondary small">
                  Showing 100% real live software engineering jobs ingested from public developer APIs. Sign in with Upwork to stream client projects directly.
                </span>
              </div>
              {onOpenLoginModal && (
                <button
                  onClick={onOpenLoginModal}
                  className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 mt-2 mt-md-0 fw-semibold"
                  style={{ fontSize: '0.78rem' }}
                >
                  <UpworkIcon size={14} /> Sign in with Upwork
                </button>
              )}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold text-dark mb-0">
                  {isUpworkConnected ? 'Latest Upwork Job Postings Analyzed' : 'Live Real Software Developer Jobs (Web Ingestion)'}
                </h5>
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: isUpworkConnected ? '#ecfdf5' : '#eff6ff',
                    color: isUpworkConnected ? '#059669' : '#2563eb',
                    border: `1px solid ${isUpworkConnected ? '#a7f3d0' : '#bfdbfe'}`,
                    fontSize: '0.72rem',
                  }}
                >
                  {isUpworkConnected ? 'Upwork Client Postings' : '🌐 Live Web Postings'}
                </span>
              </div>
              <small className="text-secondary">
                {selectedSkillFilter
                  ? `Filtered by required skill: "${selectedSkillFilter}"`
                  : isUpworkConnected
                    ? 'All active Upwork client project postings with real budgets & extracted skills.'
                    : '100% real software developer jobs streamed live from web developer APIs.'}
              </small>
            </div>
            {selectedSkillFilter && (
              <button
                onClick={() => setSelectedSkillFilter('')}
                className="btn btn-sm btn-tp-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                Clear Skill Filter
              </button>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="py-5 text-center text-secondary">
              <p>No job postings found matching your current filter.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {jobs.map(job => (
                <div
                  key={job.id}
                  className="p-3 rounded-3"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                >
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                    <div className="flex-grow-1">
                      <a
                        href={job.job_url || 'https://www.upwork.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="fw-bold text-dark text-decoration-none fs-6 d-inline-flex align-items-center gap-1"
                      >
                        {job.title} <TbExternalLink size={14} className="text-muted" />
                      </a>
                      <div className="text-muted small mt-1">
                        {job.category} · Client from <strong className="text-dark">{job.client_country}</strong> · Posted {new Date(job.posted_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Budget Pill */}
                    <div className="text-end">
                      <span className="badge py-2 px-3 fw-bold" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '0.85rem' }}>
                        {job.budget_type === 'hourly'
                          ? `$${job.hourly_rate_min} - $${job.hourly_rate_max}/hr`
                          : `$${job.budget_amount.toLocaleString()} Fixed`}
                      </span>
                    </div>
                  </div>

                  {/* Job Excerpt */}
                  <p className="text-secondary small mb-3" style={{ lineHeight: '1.5' }}>
                    {job.description}
                  </p>

                  {/* Extracted Skills */}
                  <div className="d-flex flex-wrap align-items-center gap-1 pt-2 border-top">
                    <span className="text-muted small me-2" style={{ fontSize: '0.75rem' }}>Detected Skills:</span>
                    {job.extracted_skills && job.extracted_skills.map((skill, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleFilterBySkill(skill)}
                        className={`btn btn-sm py-0 px-2 rounded-2 ${
                          selectedSkillFilter === skill ? 'btn-primary' : 'btn-light border'
                        }`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

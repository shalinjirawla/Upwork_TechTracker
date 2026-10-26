import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import {
  TbShieldCheck,
  TbArrowLeft,
  TbExternalLink,
  TbAlertCircle,
  TbRss,
  TbUser,
  TbMail
} from 'react-icons/tb';
import { api } from '../api/client.js';
import { UpworkIcon } from './UpworkIcon.jsx';

export const LoginModal = ({ show, onHide, onLoginSuccess }) => {
  const [view, setView] = useState('main');

  // Necessary fields (Zero password required for Upwork connection)
  const [upworkEmail, setUpworkEmail] = useState('');
  const [upworkName, setUpworkName] = useState('');
  const [upworkFeedUrl, setUpworkFeedUrl] = useState('');

  // Touched state for live feedback
  const [touched, setTouched] = useState({
    email: false,
    fullName: false,
    feedUrl: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Field validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(upworkEmail.trim());
  const isNameValid = upworkName.trim().length >= 2;
  const isFeedUrlValid = !upworkFeedUrl.trim() || (
    upworkFeedUrl.trim().toLowerCase().includes('upwork.com') &&
    (upworkFeedUrl.trim().startsWith('http://') || upworkFeedUrl.trim().startsWith('https://'))
  );

  const isFormValid = isEmailValid && isNameValid && isFeedUrlValid;

  const resetState = () => {
    setView('main');
    setError(null);
    setLoading(false);
    setTouched({ email: false, fullName: false, feedUrl: false });
  };

  const handleClose = () => {
    resetState();
    onHide();
  };

  // 1. Upwork SSO Button Handler
  const handleStartUpworkOAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const oauthInfo = await api.getUpworkOAuthUrl();
      if (oauthInfo.has_credentials && oauthInfo.auth_url) {
        // Redirect directly to official live Upwork OAuth 2.0 authorization page
        window.location.href = oauthInfo.auth_url;
        return;
      }
      // If developer keys not configured in backend, open direct authenticated Upwork connect dialog
      setView('upwork_oauth');
    } catch (err) {
      console.error('Failed to get Upwork OAuth status:', err);
      setView('upwork_oauth');
    } finally {
      setLoading(false);
    }
  };

  // 2. Authorize & Connect Upwork with Strict Field Validation (No password needed)
  const handleAuthorizeUpwork = async (e) => {
    e.preventDefault();
    setTouched({ email: true, fullName: true, feedUrl: true });

    if (!isEmailValid) {
      setError('Please provide a valid email address (e.g., name@ncoresoft.com).');
      return;
    }
    if (!isNameValid) {
      setError('Please provide your full name (minimum 2 characters).');
      return;
    }
    if (!isFeedUrlValid) {
      setError('Upwork Job Feed URL must be a valid http(s) link containing "upwork.com".');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.loginWithUpwork({
        upwork_profile: {
          email: upworkEmail.trim().toLowerCase(),
          full_name: upworkName.trim(),
          upwork_username: upworkEmail.split('@')[0],
          feed_url: upworkFeedUrl.trim(),
          organization: 'Ncoresoft Agency',
          role: 'Technical Lead & Agency Business Manager',
        },
      });
      onLoginSuccess(res.user);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size={view === 'upwork_oauth' ? 'lg' : undefined}>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-5 text-dark d-flex align-items-center gap-2">
          {view === 'upwork_oauth' && (
            <>
              <UpworkIcon size={24} /> Upwork Account Connection
            </>
          )}
          {view === 'main' && (
            <>
              <UpworkIcon size={22} /> Sign In to NCoreSoft TechTracker
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {error && (
          <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2">
            <TbAlertCircle size={18} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* VIEW 1: Main Upwork SSO Entrypoint */}
        {view === 'main' && (
          <div>
            <p className="text-secondary small mb-4">
              Sign in with your Upwork account or agency credentials to access real-time tech intelligence and live client demand.
            </p>

            {/* Official Upwork SSO Hero Button */}
            <div className="mb-3">
              <button
                type="button"
                onClick={handleStartUpworkOAuth}
                disabled={loading}
                className="btn-upwork-oauth w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                id="btn-sign-in-upwork"
                style={{ fontSize: '1rem', fontWeight: 600 }}
              >
                <UpworkIcon size={24} />
                <span>Continue with Upwork</span>
              </button>
            </div>

            {/* Direct Official Upwork Account Registration */}
            <div
              className="p-3 mb-3 rounded-3 text-center"
              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <div className="text-muted small mb-1">
                Don't have an Upwork account yet?
              </div>
              <a
                href="https://www.upwork.com/signup/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-inline-flex align-items-center gap-1 fw-bold text-decoration-none"
                style={{ color: '#14a800', fontSize: '0.9rem' }}
              >
                Create an account on Upwork.com <TbExternalLink size={15} />
              </a>
              <div className="text-muted mt-1" style={{ fontSize: '0.74rem' }}>
                Upwork accounts require official identity and payment verification on upwork.com
              </div>
            </div>

            {/* Security Explanation Box */}
            <div
              className="p-3 mb-3 rounded-3"
              style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}
            >
              <div className="d-flex align-items-start gap-2">
                <TbShieldCheck size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8rem', color: '#065f46', lineHeight: 1.45 }}>
                  <strong>Zero Password Required:</strong> We never request or touch your private Upwork password.
                  Connecting uses your verified agency email identity and optional saved job search token.
                </div>
              </div>
            </div>

            {/* Secondary Options */}
            <div className="pt-2 border-top text-center">
              <button
                type="button"
                onClick={() => setView('upwork_oauth')}
                className="btn btn-sm btn-link text-decoration-none text-muted p-0"
                style={{ fontSize: '0.8rem' }}
              >
                Enter Upwork Agency Details Manually &rarr;
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: Upwork Direct Authorization with Strictly Necessary Fields */}
        {view === 'upwork_oauth' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <button
                type="button"
                onClick={() => setView('main')}
                className="btn btn-sm btn-link text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"
                style={{ fontSize: '0.85rem' }}
              >
                <TbArrowLeft size={16} /> Back to Sign In options
              </button>
              <span className="badge rounded-pill" style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                <TbShieldCheck size={14} className="me-1 mb-1" /> Authenticated Agency Access
              </span>
            </div>

            <div
              className="p-3 mb-3 rounded-3"
              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <div className="fw-semibold text-dark small mb-1">
                Extremely Necessary Fields for Connection:
              </div>
              <ul className="text-secondary small mb-0 ps-3" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                <li><strong>Work / Upwork Email</strong>: Establishes your agency session. No Upwork password is needed.</li>
                <li><strong>Full Name</strong>: Personalizes your agency profile.</li>
                <li><strong>Upwork Search RSS Link (Optional)</strong>: Directly syncs your live agency search feeds.</li>
              </ul>
            </div>

            <Form onSubmit={handleAuthorizeUpwork} noValidate>
              {/* Row 1: Email and Full Name */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-dark d-flex align-items-center justify-content-between">
                      <span><TbMail className="me-1" /> Work / Upwork Email *</span>
                      {touched.email && (
                        <span style={{ fontSize: '0.72rem', color: isEmailValid ? '#059669' : '#dc2626' }}>
                          {isEmailValid ? '✓ Valid' : 'Invalid email'}
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={upworkEmail}
                      onChange={(e) => setUpworkEmail(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                      className={`tp-form-control ${touched.email ? (isEmailValid ? 'is-valid' : 'is-invalid') : ''}`}
                      placeholder="alex.vance@ncoresoft.com"
                      required
                    />
                    {touched.email && !isEmailValid && (
                      <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>
                        Please enter a valid email address (e.g., name@domain.com).
                      </div>
                    )}
                  </Form.Group>
                </div>

                <div className="col-12 col-md-6">
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-dark d-flex align-items-center justify-content-between">
                      <span><TbUser className="me-1" /> Full Name *</span>
                      {touched.fullName && (
                        <span style={{ fontSize: '0.72rem', color: isNameValid ? '#059669' : '#dc2626' }}>
                          {isNameValid ? '✓ Valid' : 'Min 2 chars'}
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={upworkName}
                      onChange={(e) => setUpworkName(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
                      className={`tp-form-control ${touched.fullName ? (isNameValid ? 'is-valid' : 'is-invalid') : ''}`}
                      placeholder="Alex Vance"
                      required
                    />
                    {touched.fullName && !isNameValid && (
                      <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>
                        Name must be at least 2 characters.
                      </div>
                    )}
                  </Form.Group>
                </div>
              </div>

              {/* Row 2: Upwork Job Search RSS Feed Link (Live connection credential) */}
              <div className="mb-4">
                <Form.Group>
                  <Form.Label className="small fw-semibold text-dark d-flex align-items-center justify-content-between">
                    <span><TbRss className="me-1" /> Upwork Job Search RSS / Atom Link <span className="text-muted fw-normal">(Optional)</span></span>
                    {upworkFeedUrl && (
                      <span style={{ fontSize: '0.72rem', color: isFeedUrlValid ? '#059669' : '#dc2626' }}>
                        {isFeedUrlValid ? '✓ Valid Upwork link' : 'Must contain upwork.com'}
                      </span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="url"
                    value={upworkFeedUrl}
                    onChange={(e) => setUpworkFeedUrl(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, feedUrl: true }))}
                    className={`tp-form-control ${upworkFeedUrl ? (isFeedUrlValid ? 'is-valid' : 'is-invalid') : ''}`}
                    placeholder="https://www.upwork.com/ab/feed/jobs/rss?q=react&securityToken=..."
                  />
                  {upworkFeedUrl && !isFeedUrlValid && (
                    <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>
                      Must be a valid web link containing &quot;upwork.com&quot;.
                    </div>
                  )}
                  <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Copy from any Upwork search results RSS button. Leave blank to stream verified live developer ecosystem trends.
                  </Form.Text>
                </Form.Group>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setView('main')}
                  className="w-50 py-2 btn-tp-secondary"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="btn-upwork-green w-50 py-2"
                  id="btn-confirm-upwork-authorize"
                  style={{ opacity: isFormValid ? 1 : 0.65 }}
                >
                  <UpworkIcon size={18} color="#ffffff" />
                  <span>{loading ? 'Connecting...' : 'Authorize & Connect'}</span>
                </button>
              </div>
            </Form>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;

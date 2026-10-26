import React from 'react';
import { Container, Button } from 'react-bootstrap';
import {
  TbActivityHeartbeat, TbRefresh, TbSparkles
} from 'react-icons/tb';
import { UpworkIcon } from './UpworkIcon.jsx';

import { NCoreSoftLogo } from './NCoreSoftLogo.jsx';

export const AppNavbar = ({
  connection, user, syncing, onSync, onOpenLoginModal, onLogout
}) => {
  const isConnected = Boolean(user && user.auth_provider === 'upwork');

  return (
    <header className="tp-topbar sticky-top py-2 px-3 px-lg-4">
      <Container fluid className="d-flex justify-content-between align-items-center p-0">
        {/* Authentic NCoreSoft Brand Mark & Typography */}
        <NCoreSoftLogo subtitle="TechTracker" />

        {/* Center / Right Actions */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Upwork Connection Status Pill - ONLY shown when actually connected */}
          {isConnected && (
            <span
              className="d-flex align-items-center gap-2 py-1 px-3 rounded-pill"
              style={{
                backgroundColor: '#ecfdf5',
                color: '#047857',
                border: '1px solid #a7f3d0',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: '8px' }}>●</span>
              Upwork Connected
            </span>
          )}

          {/* Ncore AI Status Pill (NCore Coral & Navy Glow) */}
          <span
            className="d-none d-sm-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
            style={{
              backgroundColor: '#fff2ef',
              color: '#ff4622',
              border: '1px solid #ffd3cb',
              fontSize: '0.76rem',
              fontWeight: 700,
            }}
            title="Ncore AI intelligent technology extraction & market synthesis active"
          >
            <TbSparkles size={14} color="#ff4622" />
            Ncore AI Active
          </span>

          {/* Sync Button - ONLY when connected */}
          {isConnected && (
            <Button
              onClick={onSync}
              disabled={syncing}
              className="btn-tp-primary d-flex align-items-center gap-2 py-1 px-3"
              style={{ fontSize: '0.82rem' }}
            >
              <TbRefresh className={syncing ? 'spin-animation' : ''} size={15} />
              {syncing ? 'Sync Upwork Jobs' : 'Sync Upwork Jobs'}
            </Button>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <div className="d-flex align-items-center gap-2 ps-2 border-start">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: user.auth_provider === 'upwork' ? '#ecfdf5' : '#e2e8f0',
                  color: user.auth_provider === 'upwork' ? '#047857' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  border: user.auth_provider === 'upwork' ? '1px solid #a7f3d0' : '1px solid #cbd5e1'
                }}
              >
                {user.auth_provider === 'upwork' ? <UpworkIcon size={16} /> : (user.name ? user.name[0].toUpperCase() : 'U')}
              </div>
              <div className="d-none d-md-block text-start">
                <div className="fw-semibold text-dark leading-none d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                  {user.name}
                  {user.auth_provider === 'upwork' && (
                    <span className="badge rounded-pill" style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.65rem' }}>
                      Upwork
                    </span>
                  )}
                </div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {user.upwork_username ? `@${user.upwork_username}` : user.organization}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-sm btn-link text-muted p-0 ms-1 text-decoration-none"
                style={{ fontSize: '0.75rem' }}
                title="Sign out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={onOpenLoginModal}
                className="btn btn-sm btn-upwork-oauth py-1 px-3 d-flex align-items-center gap-2"
                style={{ fontSize: '0.82rem' }}
                id="navbar-sign-in-upwork"
              >
                <UpworkIcon size={16} />
                <span>Sign in with Upwork</span>
              </button>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

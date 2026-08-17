import React, { Component, ErrorInfo, ReactNode } from 'react';
import { COLORS } from '../../constants';

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Optional fallback component */
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ERROR BOUNDARY — Mr. M Themed Fallback
 *  Catches render errors in child components and shows a tactical-styled
 *  error screen instead of crashing the entire application.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[MR.M] Render error caught by ErrorBoundary:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div
                    role="alert"
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: COLORS.bg,
                        color: COLORS.textPrimary,
                        fontFamily: '"Orbitron", sans-serif',
                        padding: '2rem',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            border: `2px solid ${COLORS.primary}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <span style={{ fontSize: '20px', color: COLORS.primary, fontWeight: 700 }}>!</span>
                    </div>

                    <h1
                        style={{
                            fontSize: '24px',
                            letterSpacing: '0.15em',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            marginBottom: '0.75rem',
                        }}
                    >
                        SYSTEM MALFUNCTION
                    </h1>

                    <p
                        style={{
                            fontFamily: '"Manrope", sans-serif',
                            fontSize: '14px',
                            color: COLORS.textSecondary,
                            maxWidth: '420px',
                            lineHeight: 1.6,
                            marginBottom: '2rem',
                        }}
                    >
                        An unexpected error occurred in the interface. Reload to re-establish secure connection.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            fontFamily: '"Rajdhani", sans-serif',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            padding: '10px 28px',
                            background: COLORS.primary,
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: `0 0 24px ${COLORS.primaryGlow}`,
                        }}
                    >
                        RELOAD SYSTEM
                    </button>

                    {this.state.error && (
                        <pre
                            style={{
                                marginTop: '2rem',
                                fontFamily: 'monospace',
                                fontSize: '10px',
                                color: 'rgba(255,255,255,0.15)',
                                maxWidth: '600px',
                                overflow: 'auto',
                                textAlign: 'left',
                            }}
                        >
                            {this.state.error.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

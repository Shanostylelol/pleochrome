'use client'

import { Component, type ReactNode, type ComponentType } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[CRM ErrorBoundary]', error, errorInfo)
  }

  handleRetry = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      const isDev = process.env.NODE_ENV === 'development'

      return (
        <div className="flex items-center justify-center min-h-[50vh] p-[var(--space-lg)]">
          <div className="neu-raised p-[var(--space-xl)] max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--ruby-bg)]">
                <AlertTriangle className="h-7 w-7 text-[var(--ruby)]" />
              </div>
            </div>

            <h2
              className="text-lg font-semibold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Something went wrong
            </h2>

            <p className="text-sm text-[var(--text-secondary)] mb-6">
              An unexpected error occurred. Please try again.
            </p>

            {isDev && this.state.error && (
              <div className="neu-pressed p-[var(--space-md)] mb-6 text-left overflow-auto max-h-40">
                <p
                  className="text-xs text-[var(--ruby)] break-all"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre
                    className="mt-2 text-[10px] text-[var(--text-muted)] whitespace-pre-wrap break-all"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {this.state.error.stack.split('\n').slice(1, 6).join('\n')}
                  </pre>
                )}
              </div>
            )}

            <button
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[var(--radius-md)] bg-[var(--teal)] text-[var(--bg-body)] text-sm font-medium shadow-[var(--shadow-raised-sm)] hover:opacity-90 transition-all neu-btn-press focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * HOC wrapper for functional components that need error boundary protection.
 *
 * Usage:
 *   const SafePage = withErrorBoundary(MyPage)
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: ReactNode
) {
  function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }

  WithErrorBoundaryWrapper.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return WithErrorBoundaryWrapper
}

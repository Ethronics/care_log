import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui'
import { ROUTES } from '../utils/constants'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
  /** Optional fallback when no custom fallback is rendered (e.g. for root boundary). */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className={styles.wrapper} role="alert">
          <div className={styles.card}>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
              An unexpected error occurred. You can try again or return to the dashboard.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className={styles.detail}>{this.state.error.message}</pre>
            )}
            <div className={styles.actions}>
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary">Go to dashboard</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

import { Link } from 'react-router-dom'
import { Button } from '../components/ui'
import { ROUTES } from '../utils/constants'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="primary">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

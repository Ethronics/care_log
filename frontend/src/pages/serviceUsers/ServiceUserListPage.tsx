import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_SERVICE_USERS } from '../../utils/constants'
import { Button, Card, Input } from '../../components/ui'
import styles from './ServiceUserListPage.module.css'

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export function ServiceUserListPage() {
  const { setItems } = useBreadcrumbs()
  const { getServiceUserList, searchServiceUsers } = useDemoStore()
  const [searchQuery, setSearchQuery] = useState('')

  const allUsers = getServiceUserList()
  const users = searchQuery.trim() ? searchServiceUsers(searchQuery) : allUsers

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Service users', to: ROUTES.SERVICE_USERS },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className="page-title">Service users</h1>
        <Link to={ROUTES_SERVICE_USERS.NEW}>
          <Button variant="primary">Add service user</Button>
        </Link>
      </div>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-4)' }}>
        People receiving care – profiles, medical info and emergency contacts.
      </p>

      {allUsers.length > 0 && (
        <div className={styles.searchWrap}>
          <Input
            placeholder="Search by name, medical info or preferences…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search service users"
          />
        </div>
      )}

      {allUsers.length === 0 ? (
        <Card className={styles.emptyCard}>
          <div className={styles.emptyContent}>
            <p className={styles.emptyTitle}>No service users yet</p>
            <p className="text-muted text-sm">
              Add the first person receiving care to get started.
            </p>
            <Link to={ROUTES_SERVICE_USERS.NEW}>
              <Button variant="primary" className={styles.emptyButton}>
                Add service user
              </Button>
            </Link>
          </div>
        </Card>
      ) : users.length === 0 ? (
        <Card className={styles.emptyCard}>
          <p className="text-muted">No matches for &quot;{searchQuery}&quot;.</p>
        </Card>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of birth</th>
                  <th>Medical info</th>
                  <th className={styles.actionsCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <Link to={ROUTES_SERVICE_USERS.DETAIL(u.id)} className={styles.nameLink}>
                        {u.name}
                      </Link>
                    </td>
                    <td>{formatDate(u.dateOfBirth)}</td>
                    <td className={styles.medicalCell}>
                      {u.medicalInfo ? `${u.medicalInfo.slice(0, 60)}${u.medicalInfo.length > 60 ? '…' : ''}` : '—'}
                    </td>
                    <td className={styles.actionsCell}>
                      <Link to={ROUTES_SERVICE_USERS.DETAIL(u.id)} className={styles.link}>
                        View
                      </Link>
                      <Link to={ROUTES_SERVICE_USERS.EDIT(u.id)} className={styles.link}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.cardList}>
            {users.map((u) => (
              <Card key={u.id} padding="md" className={styles.userCard}>
                <Link to={ROUTES_SERVICE_USERS.DETAIL(u.id)} className={styles.cardName}>
                  {u.name}
                </Link>
                <div className="text-sm text-muted">{formatDate(u.dateOfBirth)}</div>
                {u.medicalInfo && (
                  <div className="text-sm text-muted" style={{ marginTop: 'var(--space-1)' }}>
                    {u.medicalInfo.slice(0, 80)}
                    {u.medicalInfo.length > 80 ? '…' : ''}
                  </div>
                )}
                <div className={styles.cardActions}>
                  <Link to={ROUTES_SERVICE_USERS.DETAIL(u.id)}>
                    <Button variant="primary" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link to={ROUTES_SERVICE_USERS.EDIT(u.id)}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

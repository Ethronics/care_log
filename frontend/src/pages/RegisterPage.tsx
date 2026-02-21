import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui'
import { ROUTES } from '../utils/constants'

export function RegisterPage() {
  return (
    <div className="login-wrapper">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="body-text text-muted" style={{ marginBottom: 'var(--space-4)' }}>
            Accounts are created by your administrator. They will add you as staff and assign your role (Admin or Staff). Use the sign-in page with the credentials they provide.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="primary" fullWidth>
              Back to sign in
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

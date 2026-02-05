import React, { useState } from 'react'
import { Input, Button, Badge } from '../../../components/ui'
import { useStaffList } from '../hooks'
import { StaffCard } from './StaffCard'
import { StaffRole } from '../types'
import './StaffList.css'

export const StaffList: React.FC = () => {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<StaffRole | ''>('')
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined)

  const { data, loading, error, updateParams } = useStaffList({
    search: search || undefined,
    role: roleFilter || undefined,
    isActive: activeFilter,
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    updateParams({ search: e.target.value || undefined, page: 1 })
  }

  const handleRoleFilter = (role: StaffRole | '') => {
    setRoleFilter(role)
    updateParams({ role: role || undefined, page: 1 })
  }

  const handleActiveFilter = (active: boolean | undefined) => {
    setActiveFilter(active)
    updateParams({ isActive: active, page: 1 })
  }

  if (loading && !data) {
    return (
      <div className="staff-list-loading">
        <div className="loading"></div>
        <p>Loading staff members...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="staff-list-error">
        <p>Error: {error}</p>
        <Button onClick={() => updateParams({})}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="staff-list">
      <div className="staff-list-header">
        <h2>Staff Members</h2>
      </div>

      <div className="staff-list-filters">
        <Input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={handleSearchChange}
          className="staff-list-search"
        />

        <div className="staff-list-filter-buttons">
          <div className="filter-group">
            <span className="filter-label">Role:</span>
            <Button
              variant={roleFilter === '' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleRoleFilter('')}
            >
              All
            </Button>
            <Button
              variant={roleFilter === 'manager' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleRoleFilter('manager')}
            >
              Manager
            </Button>
            <Button
              variant={roleFilter === 'senior_carer' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleRoleFilter('senior_carer')}
            >
              Senior Carer
            </Button>
            <Button
              variant={roleFilter === 'carer' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleRoleFilter('carer')}
            >
              Carer
            </Button>
          </div>

          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <Button
              variant={activeFilter === undefined ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleActiveFilter(undefined)}
            >
              All
            </Button>
            <Button
              variant={activeFilter === true ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleActiveFilter(true)}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === false ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleActiveFilter(false)}
            >
              Inactive
            </Button>
          </div>
        </div>
      </div>

      {data && data.items.length === 0 ? (
        <div className="staff-list-empty">
          <p>No staff members found.</p>
        </div>
      ) : (
        <>
          <div className="staff-list-results">
            {data?.items.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="staff-list-pagination">
              <Button
                variant="outline"
                disabled={data.page === 1}
                onClick={() => updateParams({ page: data.page - 1 })}
              >
                Previous
              </Button>
              <span>
                Page {data.page} of {data.totalPages} ({data.total} total)
              </span>
              <Button
                variant="outline"
                disabled={data.page === data.totalPages}
                onClick={() => updateParams({ page: data.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

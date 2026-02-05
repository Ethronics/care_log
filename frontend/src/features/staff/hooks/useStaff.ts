import { useState, useEffect, useCallback } from 'react'
import { Staff } from '../types'
import { staffService } from '../services'

export const useStaff = (id: string | null) => {
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStaff = useCallback(async () => {
    if (!id) {
      setStaff(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await staffService.getStaffById(id)
      setStaff(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load staff member')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const refetch = useCallback(() => {
    fetchStaff()
  }, [fetchStaff])

  return { staff, loading, error, refetch }
}

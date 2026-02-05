import { useState, useEffect, useCallback } from 'react'
import { StaffListParams, StaffListResponse } from '../types'
import { staffService } from '../services'

export const useStaffList = (initialParams: StaffListParams = {}) => {
  const [data, setData] = useState<StaffListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<StaffListParams>(initialParams)

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await staffService.getStaffList(params)
      setData(response)
    } catch (err: any) {
      setError(err.message || 'Failed to load staff list')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const refetch = useCallback(() => {
    fetchStaff()
  }, [fetchStaff])

  const updateParams = useCallback((newParams: Partial<StaffListParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }))
  }, [])

  return {
    data,
    loading,
    error,
    refetch,
    params,
    updateParams,
  }
}

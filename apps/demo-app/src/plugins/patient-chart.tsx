'use client'

import { Box } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import type { Plugin } from '../types/plugin'

import PatientChart from '@xcaliber/patient-chart/PatientChartComponent'
import PatientDetails from '@xcaliber/patient-chart/PatientDetails'

/**
 * Main component for your plugin
 * This will be the default view when users navigate to your plugin
 */
const PatientChartComponent = () => {
  const router = useRouter()

  useEffect(() => {
    const handlePatientSelect = (event: CustomEvent) => {
      const { patientId } = event.detail
      router.push(`/patient-chart/${patientId}`)
    }

    window.addEventListener('patientSelected', handlePatientSelect as EventListener)
    return () => {
      window.removeEventListener('patientSelected', handlePatientSelect as EventListener)
    }
  }, [router])

  return <PatientChart />
}

const PatientDetailsComponent = () => {
  const params = useParams()
  const id = params?.id as string

  return <PatientDetails id={id} />
}

/**
 * Main Plugin Definition
 * This is where you configure your plugin's properties and behavior
 */
const PatientChartPlugin: Plugin = {
  // Basic plugin metadata
  name: 'patient-chart', // Unique identifier for your plugin
  version: '1.0.0',
  description: 'A plugin for patient chart demo',
  author: 'Xcaliber',

  // Lifecycle Methods
  async initialize() {
    console.log('Patient Chart plugin initialized')
  },

  async cleanup() {
    console.log('Patient Chart plugin cleaned up')
  },

  // Define the routes for your plugin
  routes: [
    {
      path: '/patient-chart',
      component: PatientChartComponent,
      icon: Box,
      label: 'Patient Chart',
      group: 'Patient Chart Group',
      showInSidebar: true
    },
    {
      path: '/patient-chart/[id]',
      component: PatientDetailsComponent,
      label: 'Patient Details',
      showInSidebar: false
    }
  ]
}

export default PatientChartPlugin

'use client'

import { Box } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import type { Plugin } from '../types/plugin'

import LabOrderDetails from '@xcaliber/lab-order'

/**
 * Main component for your plugin
 * This will be the default view when users navigate to your plugin
 */
const LabOrderComponent = () => {
  // const router = useRouter()
  // const params = useParams()

  // useEffect(() => {
  //   const handlePatientSelect = (event: CustomEvent) => {
  //     const { patientId } = event.detail
  //     router.push(`/lab-order/${patientId}`)
  //   }

  //   window.addEventListener('patientSelected', handlePatientSelect as EventListener)
  //   return () => {
  //     window.removeEventListener('patientSelected', handlePatientSelect as EventListener)
  //   }
  // }, [router])

  return <LabOrderDetails />
}

/**
 * Main Plugin Definition
 * This is where you configure your plugin's properties and behavior
 */
const LabOrderPlugin: Plugin = {
  // Basic plugin metadata
  name: 'xc-fhir-on-app', // Unique identifier for your plugin
  version: '1.0.0',
  description: 'A plugin for lab order management',
  author: 'Xcaliber',

  // Lifecycle Methods
  async initialize() {
    console.log('Lab Order plugin initialized')
  },

  async cleanup() {
    console.log('Lab Order plugin cleaned up')
  },

  // Define the routes for your plugin
  routes: [
    {
      path: '/xc-fhir-on-app',
      component: LabOrderComponent,
      icon: Box,
      label: 'Lab Order',
      group: 'Lab Order Group',
      showInSidebar: true
    }
  ]
}

export default LabOrderPlugin

import { DashboardHeader } from '@/components/layout/dashboard-header'
import { BillingPage } from '@/components/dashboard/billing-page'

export default function Billing() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Billing & Plans" />
      <div className="flex-1 overflow-y-auto p-6">
        <BillingPage />
      </div>
    </div>
  )
}

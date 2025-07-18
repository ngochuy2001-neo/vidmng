import { redirect } from "next/navigation"

export default function AdminAnalyticsPage() {
  // Redirect to admin dashboard since we removed analytics
  redirect("/admin")
}

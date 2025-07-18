import { redirect } from "next/navigation"

export default function AdminSettingsPage() {
  // Redirect to admin dashboard since we removed settings
  redirect("/admin")
}

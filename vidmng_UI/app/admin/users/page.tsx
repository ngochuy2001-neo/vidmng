import { redirect } from "next/navigation"

export default function AdminUsersPage() {
  // Redirect to admin dashboard since we removed user management
  redirect("/admin")
}

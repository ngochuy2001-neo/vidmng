import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-2xl">VideoShare</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Quên mật khẩu?</h1>
          <p className="text-muted-foreground">Nhập email để nhận link đặt lại mật khẩu</p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Nhớ lại mật khẩu?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

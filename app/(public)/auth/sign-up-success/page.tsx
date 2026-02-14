import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Thankyou for signing up!</CardTitle>
          <CardDescription>Welcome to Math4Code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Please check that your email address is correct. If the email is incorrect, you will not receive any emails. In that case, please sign up again. Otherwise, you can log in.
            </p>
            <Link href="/student/dashboard">
              <Button className="w-full">go to dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

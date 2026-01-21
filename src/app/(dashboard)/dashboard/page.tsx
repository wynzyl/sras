import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Student Registration and Accounts System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage student records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/students"
              className="text-sm text-primary hover:underline font-medium"
            >
              View Students →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollments</CardTitle>
            <CardDescription>Create new enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/enrollments/new"
              className="text-sm text-primary hover:underline font-medium"
            >
              New Enrollment →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>Manage chart of accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/accounts"
              className="text-sm text-primary hover:underline font-medium"
            >
              View Accounts →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Items</CardTitle>
            <CardDescription>Manage fee items</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/fee-items"
              className="text-sm text-primary hover:underline font-medium"
            >
              View Fee Items →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Schedules</CardTitle>
            <CardDescription>Manage fee schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/fee-schedules"
              className="text-sm text-primary hover:underline font-medium"
            >
              View Fee Schedules →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Manage subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/subjects"
              className="text-sm text-primary hover:underline font-medium"
            >
              View Subjects →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

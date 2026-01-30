"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalConfirm } from "@/components/GlobalConfirm";

export default function UserAdminActions({
  user,
  reports,
  onBanUser,
  onUnBanUser,
}) {
  const confirm = useGlobalConfirm();

  const handleBan = async () => {
    const ok = await confirm({
      title: "Ban account",
      description: `Permanently ban ${user?.name ?? "this user"}?`,
      confirmLabel: "Ban",
      cancelLabel: "Cancel",
      destructive: true,
    });

    if (ok) {
      onBanUser(user.id);
    }
  };

  const handleUnBan = async () => {
    const ok = await confirm({
      title: "Unban account",
      description: `Permanently unban ${user?.name ?? "this user"}?`,
      confirmLabel: "Unban",
      cancelLabel: "Cancel",
      destructive: true,
    });

    if (ok) {
      onUnBanUser(user.id);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex justify-between gap-2">
          <h2 className="text-lg font-semibold">Admin Actions</h2>
          <div className="flex gap-2">
            {/* <Button variant="destructive" onClick={handleSuspend}>
              Suspend Account
            </Button> */}
            {user.accountStatus === "BLOCKED" ? (
              <Button variant="outline" onClick={handleUnBan}>
                Unban User
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleBan}>
                Ban Account
              </Button>
            )}
          </div>
          {/* <Button onClick={() => alert("Add admin note")}>
            Add Admin Note
          </Button> */}
        </div>

        {reports.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-medium mb-1">Reports Filed Against User</h3>
            <ul className="list-disc list-inside text-sm">
              {reports.map((r, i) => (
                <li key={i}>
                  {r.type} - {r.date}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="font-medium mb-1">No Reports Against User</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

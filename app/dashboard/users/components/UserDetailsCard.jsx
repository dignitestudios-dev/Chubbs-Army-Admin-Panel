import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserDetailsCard({ user }) {
  return (
    <Card className="w-[50%] border">
      <CardContent>
        <div className="flex justify-between items-center w-full ">
          <h2 className="text-lg font-semibold mb-2">Account Details</h2>
        </div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
        {/* <p>
          <strong>Rank:</strong> {user.rank}
        </p> */}
      </CardContent>
    </Card>
  );
}

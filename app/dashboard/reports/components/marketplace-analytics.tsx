import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MarketplaceAnalytics = ({ marketplaceAnalytics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketplace Analytics Overview</CardTitle>
        <CardDescription>
          Track vendors, products, and marketplace performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="text-sm text-gray-600 mb-1">
              Total Vendors Count
            </div>
            <div className="text-3xl font-bold text-amber-600">
              {marketplaceAnalytics.totalVendors}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="text-sm text-gray-600 mb-1">
              Total Products/Services Count
            </div>
            <div className="text-3xl font-bold text-rose-600">
              {marketplaceAnalytics.totalProducts}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-lg">Orders</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {marketplaceAnalytics.orders.pending}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {marketplaceAnalytics.orders.completed}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Cancelled</div>
              <div className="text-2xl font-bold text-red-600">
                {marketplaceAnalytics.orders.cancelled}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-lg">Revenue</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">By Product</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketplaceAnalytics.revenue.byProduct.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">By Service</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketplaceAnalytics.revenue.byService.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Marketplace</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketplaceAnalytics.revenue.marketplace.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Subscriptions</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketplaceAnalytics.revenue.subscriptions.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-lg">Vendor Ratings</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Average Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketplaceAnalytics.vendorRatings.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell>{vendor.vendorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">
                        {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceAnalytics;

import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminOverview from "./AdminOverview";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminDocuments from "./AdminDocuments";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
            <p className="text-sm text-muted-foreground">Manage orders, products & downloads</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back to store</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><AdminOverview /></TabsContent>
          <TabsContent value="orders"><AdminOrders /></TabsContent>
          <TabsContent value="products"><AdminProducts /></TabsContent>
          <TabsContent value="documents"><AdminDocuments /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

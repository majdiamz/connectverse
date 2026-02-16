
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  getBusinessInfo, updateBusinessInfo,
  getOrganizations, createOrganization, updateOrganization, deleteOrganization,
  getOrgUsers, createOrgUser, updateOrgUser, deleteOrgUser,
} from "@/lib/data";
import type { BusinessInfo, Organization, OrgUser } from "@/lib/data";
import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address.").optional(),
});

function BusinessProfileTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { companyName: "", address: "", phone: "", email: "" },
  });

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const info = await getBusinessInfo();
        form.reset(info);
      } catch {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load business information.' });
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateBusinessInfo(values as BusinessInfo);
      toast({ title: "Settings saved!", description: "Your business information has been updated." });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save business information.' });
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>Update your company&apos;s information here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl><Input placeholder="Your Company Name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input placeholder="Company Address" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input placeholder="Company Phone" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl><Input placeholder="Company Email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function OrganizationsTab() {
  const { toast } = useToast();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgName, setOrgName] = useState("");

  const fetchOrgs = useCallback(async () => {
    setLoading(true);
    try {
      setOrgs(await getOrganizations());
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load organizations.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchOrgs(); }, [fetchOrgs]);

  const openCreate = () => {
    setEditingOrg(null);
    setOrgName("");
    setDialogOpen(true);
  };

  const openEdit = (org: Organization) => {
    setEditingOrg(org);
    setOrgName(org.name);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!orgName.trim()) return;
    try {
      if (editingOrg) {
        await updateOrganization(editingOrg.id, orgName.trim());
        toast({ title: "Organization updated" });
      } else {
        await createOrganization(orgName.trim());
        toast({ title: "Organization created" });
      }
      setDialogOpen(false);
      fetchOrgs();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    }
  };

  const handleDelete = async (org: Organization) => {
    if (!confirm(`Delete "${org.name}"? This will remove all its data.`)) return;
    try {
      await deleteOrganization(org.id);
      toast({ title: "Organization deleted" });
      fetchOrgs();
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete organization.' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Manage all organizations on the platform.</CardDescription>
        </div>
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> New Organization</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>{org.slug}</TableCell>
                <TableCell>{org.userCount}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(org)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(org)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orgs.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No organizations yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOrg ? "Edit Organization" : "New Organization"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Name</label>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Organization name" className="mt-1" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingOrg ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function UsersTab() {
  const { toast } = useToast();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<OrgUser | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<string>("admin");

  useEffect(() => {
    getOrganizations().then(setOrgs).catch(() => {});
  }, []);

  const fetchUsers = useCallback(async (orgId: string) => {
    if (!orgId) return;
    setLoading(true);
    try {
      setUsers(await getOrgUsers(orgId));
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load users.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (selectedOrgId) fetchUsers(selectedOrgId);
  }, [selectedOrgId, fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setUserName("");
    setUserEmail("");
    setUserRole("admin");
    setDialogOpen(true);
  };

  const openEdit = (u: OrgUser) => {
    setEditingUser(u);
    setUserName(u.name);
    setUserEmail(u.email);
    setUserRole(u.role);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!userName.trim() || !userEmail.trim()) return;
    try {
      if (editingUser) {
        await updateOrgUser(editingUser.id, { name: userName.trim(), email: userEmail.trim(), role: userRole });
        toast({ title: "User updated" });
      } else {
        await createOrgUser(selectedOrgId, { name: userName.trim(), email: userEmail.trim(), role: userRole });
        toast({ title: "User created", description: "Default password: password123" });
      }
      setDialogOpen(false);
      fetchUsers(selectedOrgId);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    }
  };

  const handleDelete = async (u: OrgUser) => {
    if (!confirm(`Delete user "${u.name}"?`)) return;
    try {
      await deleteOrgUser(u.id);
      toast({ title: "User deleted" });
      fetchUsers(selectedOrgId);
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete user.' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage users within an organization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {orgs.map((org) => (
                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedOrgId && (
            <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> New User</Button>
          )}
        </div>

        {selectedOrgId && !loading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(u)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No users in this organization.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {loading && <div>Loading users...</div>}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Full name" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email address" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingUser ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="space-y-6">
      {isSuperAdmin ? (
        <Tabs defaultValue="organizations">
          <TabsList>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="organizations"><OrganizationsTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
        </Tabs>
      ) : (
        <BusinessProfileTab />
      )}
    </div>
  );
}

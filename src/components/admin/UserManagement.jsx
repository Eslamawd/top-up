
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { toast } from "sonner";
import { 
  Search, 
  Trash2, 
  Ban, 
  User as UserIcon,
  Mail,
  AlertTriangle,
  Wallet,
  Plus,
  Minus
} from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/Dialog";
import { Label } from "../ui/Label";
import { changeRole, deleteUser, loadAllUsers } from "../../lib/adminApi";
import { depositBalance } from "../../lib/walletApi";


const UserManagement = () => {
 const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [balanceAction, setBalanceAction] = useState("deposit"); // "add" or "remove"

  // Fetch users from Laravel API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await loadAllUsers()
        setUsers(response?.users || []);
        setFilteredUsers(response?.users || []);
        if (response.users.length === 0) {
          toast.info("No users found");
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  // Delete user
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowDeleteDialog(false);
      toast.success(`User ${userToDelete.email} deleted successfully`);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  };

  // Toggle user active status
  const toggleUserRole = async (userId, newRole) => {
  try {
    const response = await changeRole(userId, { role: newRole });

    const updatedUser = response.user;
    const updatedUsers = users.map((u) => (u.id === userId ? updatedUser : u));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    

    toast.success(`Role updated to ${newRole}`);
  } catch (error) {
    console.error("Failed to update role", error);
    toast.error("Failed to update role");
  }
};


  // Update balance
  const handleBalanceUpdate = async () => {
    if (!selectedUser) return;

    if (balanceAmount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    if (balanceAction === "withdraw" && balanceAmount > selectedUser.balance) {
      toast.error("Cannot remove more than the current balance");
      return;
    }

    try {
      const response = await depositBalance(selectedUser.id,  {amount: balanceAmount} ,balanceAction)
      
      const updatedUser = response.user;
      const updatedUsers = users.map((u) => (u.id === selectedUser.id ? updatedUser : u));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      toast.success(`Balance updated for ${selectedUser.email}`);
      setShowBalanceDialog(false);
      setSelectedUser(null);
      setBalanceAmount(0);
    } catch (error) {
      console.error("Failed to update balance", error);
      toast.error("Failed to update balance");
    }
  };

  // Open Balance Dialog
  const openBalanceDialog = (user, action) => {
    setSelectedUser(user);
    setBalanceAction(action);
    setBalanceAmount(0);
    setShowBalanceDialog(true);
  };

  // Open Delete Dialog
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">User Management</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">
                {searchQuery ? 'Try adjusting your search query' : 'No users have registered yet'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>phone</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        {user.name}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {user?.phone}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">${user?.balance || 0.00}</span>
                      </TableCell>
                      <TableCell>
                       <span
  className={`px-2 py-1 rounded-full text-xs font-medium ${
    user.role === 'admin'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : user.role === 'seals'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }`}
>
  {user.role}
</span>

                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openBalanceDialog(user, "deposit")}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Deposit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openBalanceDialog(user, "withdraw")}
                            disabled={user.balance <= 0}
                          >
                            <Minus className="h-4 w-4 mr-1" />
                            Withdraw
                          </Button>
                         <Select
  defaultValue={user.role}
  onValueChange={(val) => toggleUserRole(user.id, val)}
>
  <SelectTrigger className="w-[110px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-black text-white">
    <SelectItem value="user">User</SelectItem>
    <SelectItem value="seals">seller</SelectItem>
    <SelectItem value="admin">Admin</SelectItem>
  </SelectContent>
</Select>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='bg-black text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              {userToDelete && ` for ${userToDelete.email}`} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction  onClick={confirmDelete} className="bg-red-300 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Balance Management Dialog */}
      <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <DialogContent className='bg-black text-white max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {balanceAction === "deposit" ? "deposit" : "withdraw"}
            </DialogTitle>
            <DialogDescription>
              {balanceAction === "deposit" 
                ? "Add funds to the user's account balance" 
                : "Remove funds from the user's account balance"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Current Balance:</div>
                <div className="font-medium">${selectedUser.balance || 0.00}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={balanceAmount || ''}
                  onChange={(e) => setBalanceAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                />
                
                {balanceAction === "remove" && balanceAmount > selectedUser.balance && (
                  <p className="text-sm text-red-500">
                    Cannot remove more than the current balance (${ selectedUser.balance || 0.00})
                  </p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBalanceDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBalanceUpdate}
              disabled={!balanceAmount || balanceAmount <= 0 || (balanceAction === "withdraw" && selectedUser && balanceAmount > selectedUser.balance)}
            >
              {balanceAction === "deposit" ? "Add Funds" : "Remove Funds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;

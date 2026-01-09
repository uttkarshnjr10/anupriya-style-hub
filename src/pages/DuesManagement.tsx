import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    AlertCircle, 
    CheckCircle, 
    Clock, 
    Phone, 
    Calendar, 
    Search, 
    Filter,
    ChevronDown,
    Edit2,
    Save,
    X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface DuesRecord {
    _id: string;
    type: "DUES";
    amount: number;
    status: "PENDING" | "PAID" | "PARTIAL";
    duesDetails: {
        name: string;
        phoneNumber: string;
        dueDate?: string;
    };
    transaction: {
        _id: string;
        type: string;
        amount: number;
        productSnapshot: {
            name: string;
            category: string;
        };
        createdAt: string;
        staffId: {
            name: string;
            staffId: string;
        };
    };
    product: {
        name: string;
        category: string;
        subCategory: string;
    };
    createdAt: string;
}

interface DuesStats {
    totalDuesRecords: number;
    totalDuesAmount: number;
    pendingAmount: number;
    paidAmount: number;
    partialAmount: number;
    statusBreakdown: {
        PENDING: { count: number; amount: number };
        PARTIAL: { count: number; amount: number };
        PAID: { count: number; amount: number };
    };
}

const DuesManagement = () => {
    const [dues, setDues] = useState<DuesRecord[]>([]);
    const [stats, setStats] = useState<DuesStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showOverdue, setShowOverdue] = useState(false);

    useEffect(() => {
        fetchDues();
        fetchStats();
    }, [page, statusFilter, searchTerm, showOverdue]);

    const fetchDues = async () => {
        setIsLoading(true);
        try {
            const endpoint = showOverdue ? "/dues/overdue" : "/dues";
          console.log(endpoint);
          
            const response = await api.get(endpoint, {
                params: {
                    page,
                    limit,
                    status: statusFilter,
                    searchTerm
                }
            });

            if (response.data.success) {
                setDues(response.data.data.dues);
                setTotalPages(response.data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Error fetching dues:", error);
            toast.error("Failed to fetch dues");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get("/dues/statistics");
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    const updateDuesStatus = async (duesId: string, newStatus: string) => {
        try {
            const response = await api.patch(`/dues/${duesId}/status`, {
                status: newStatus
            });

            if (response.data.success) {
                setDues(dues.map(d => 
                    d._id === duesId ? { ...d, status: newStatus as any } : d
                ));
                toast.success(`Status updated to ${newStatus}`);
                fetchStats();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PAID":
                return <CheckCircle className="w-5 h-5 text-success" />;
            case "PARTIAL":
                return <Clock className="w-5 h-5 text-warning" />;
            case "PENDING":
                return <AlertCircle className="w-5 h-5 text-destructive" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-success/10 text-success border-success/20";
            case "PARTIAL":
                return "bg-warning/10 text-warning border-warning/20";
            case "PENDING":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "";
        }
    };

    const isOverdue = (dueDate?: string) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-warning" />
                </div>
                <div>
                    <h2 className="font-display text-2xl font-semibold">Dues Management</h2>
                    <p className="text-sm text-muted-foreground">Track and manage all pending dues</p>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-xs text-muted-foreground mb-1">Total Dues</p>
                        <p className="text-2xl font-bold">₹{stats.totalDuesAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">{stats.totalDuesRecords} records</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-destructive/20 bg-destructive/5"
                    >
                        <p className="text-xs text-muted-foreground mb-1">Pending</p>
                        <p className="text-2xl font-bold text-destructive">₹{stats.pendingAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">{stats.statusBreakdown.PENDING.count} records</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-warning/20 bg-warning/5"
                    >
                        <p className="text-xs text-muted-foreground mb-1">Partial</p>
                        <p className="text-2xl font-bold text-warning">₹{stats.partialAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">{stats.statusBreakdown.PARTIAL.count} records</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-success/20 bg-success/5"
                    >
                        <p className="text-xs text-muted-foreground mb-1">Paid</p>
                        <p className="text-2xl font-bold text-success">₹{stats.paidAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">{stats.statusBreakdown.PAID.count} records</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-xs text-muted-foreground mb-1">Collection %</p>
                        <p className="text-2xl font-bold">
                            {stats.totalDuesAmount > 0 
                                ? ((stats.paidAmount / stats.totalDuesAmount) * 100).toFixed(1)
                                : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">Collected</p>
                    </motion.div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                        >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PARTIAL">Partial</option>
                            <option value="PAID">Paid</option>
                        </select>

                        <Button
                            variant={showOverdue ? "default" : "outline"}
                            onClick={() => {
                                setShowOverdue(!showOverdue);
                                setPage(1);
                            }}
                            className="gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {showOverdue ? "All" : "Overdue"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dues Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                    </div>
                ) : dues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-2">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No dues found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Due Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Sale Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Staff</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dues.map((due) => (
                                    <motion.tr
                                        key={due._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-border hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{due.duesDetails.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`tel:${due.duesDetails.phoneNumber}`}
                                                className="flex items-center gap-2 text-primary hover:underline"
                                            >
                                                <Phone className="w-4 h-4" />
                                                {due.duesDetails.phoneNumber}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 font-semibold">₹{due.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(due.status)}
                                                <select
                                                    value={due.status}
                                                    onChange={(e) => updateDuesStatus(due._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${getStatusColor(due.status)}`}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PARTIAL">Partial</option>
                                                    <option value="PAID">Paid</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                {due.duesDetails.dueDate
                                                    ? new Date(due.duesDetails.dueDate).toLocaleDateString()
                                                    : "N/A"}
                                                {isOverdue(due.duesDetails.dueDate) && (
                                                    <span className="text-xs text-destructive font-semibold">OVERDUE</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(due.transaction.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{due.transaction.staffId.name}</td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingId(due._id === editingId ? null : due._id)}
                                            >
                                                {editingId === due._id ? (
                                                    <X className="w-4 h-4" />
                                                ) : (
                                                    <Edit2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DuesManagement;
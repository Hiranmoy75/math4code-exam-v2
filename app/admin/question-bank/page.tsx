"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

import { pageBg, cardGlass } from "@/components/question-bank/ui";
import EmptyState from "@/components/question-bank/EmptyState";
import { QuestionTable } from "@/components/question-bank/table/QuestionTable";
import { columns as makeColumns } from "@/components/question-bank/table/columns";
import { ImportQuestionsDialog } from "./ImportQuestions";

import { useCurrentAdmin } from "@/hooks/admin/question-bank/useCurrentAdmin";
import { useQuestions } from "@/hooks/admin/question-bank/useQuestions";
import { useDeleteQuestion } from "@/hooks/admin/question-bank/useDeleteQuestion";
import { useBulkDeleteQuestions } from "@/hooks/admin/question-bank/useBulkDeleteQuestions";

// New components
import { QuestionBankHeader } from "./components/QuestionBankHeader";
import { SearchBar } from "./components/SearchBar";
import { ActiveFilters } from "./components/ActiveFilters";
import { FilterDropdown } from "./components/FilterDropdown";

const QuestionForm = dynamic(
  () => import("@/components/question-bank/QuestionForm"),
  { ssr: false }
);

export default function QuestionBankPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Local filter state
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    subject: "all",
    difficulty: "all",
    qtype: "all",
  });

  const { data: adminId } = useCurrentAdmin();
  const { mutateAsync: deleteQuestion } = useDeleteQuestion();
  const { mutateAsync: bulkDeleteQuestions, isPending: isBulkDeleting } = useBulkDeleteQuestions();

  // Fetch questions with current filters
  const { data, isLoading, refetch } = useQuestions(filters);

  // Handlers
  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const clearFilter = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        key === "search"
          ? ""
          : key === "page"
            ? 1
            : key === "pageSize"
              ? 10
              : "all",
    }));
  };

  const onPageChange = (p: number) => {
    setFilters((prev) => ({ ...prev, page: p }));
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteQuestions(selectedIds);
      setSelectedIds([]);
      setDeleteConfirmOpen(false);
      refetch(); // ✅ Refresh the list
    } catch (error) {
      console.error('Bulk delete failed:', error);
      setDeleteConfirmOpen(false);
    }
  };

  const columns = makeColumns(
    async (id: string) => {
      await deleteQuestion(id);
    },
    selectedIds,
    setSelectedIds
  );

  return (
    <div className={`min-h-screen space-y-6 p-4 md:p-6 ${pageBg}`}>
      {/* Premium Header */}
      <QuestionBankHeader
        onCreateClick={() => setCreateOpen(true)}
        onImportClick={() => setImportOpen(true)}
        totalQuestions={data?.total ?? 0}
      />

      {/* Toolbar Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className={`${cardGlass} border-slate-200 dark:border-slate-800`}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Bulk Actions Bar */}
              {selectedIds.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    {selectedIds.length} question{selectedIds.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedIds([])}
                      className="px-3 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-md transition-colors"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      disabled={isBulkDeleting}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
                    </button>
                  </div>
                </div>
              )}
              {/* Search and Filters Row */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SearchBar
                  value={filters.search}
                  onChange={handleSearchChange}
                  onSearch={refetch}
                  placeholder="Search question text..."
                />

                <FilterDropdown
                  currentFilters={{
                    subject: filters.subject,
                    difficulty: filters.difficulty,
                    qtype: filters.qtype,
                  }}
                  onFilterChange={setFilter}
                  onRefresh={refetch}
                />
              </div>

              {/* Active Filters Chips */}
              <ActiveFilters filters={filters} onClearFilter={clearFilter} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <QuestionTable
          columns={columns}
          data={data?.rows ?? []}
          page={filters.page}
          pages={data?.pages ?? 1}
          onPageChange={onPageChange}
          loading={isLoading}
          empty={<EmptyState onCreate={() => setCreateOpen(true)} />}
        />
      </motion.div>

      {/* Create Question Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Create a New Question</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <QuestionForm
              onSuccess={() => {
                setCreateOpen(false);
                refetch();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Import Questions Dialog */}
      {adminId && (
        <ImportQuestionsDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          adminId={adminId}
          onSuccess={refetch}
        />
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} Question{selectedIds.length > 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected questions and their options from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isBulkDeleting ? 'Deleting...' : 'Yes, Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

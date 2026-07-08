import { View, Text, ScrollView } from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, Spinner, useThemeColor } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import FlowpayScreenHeader from "@/components/base/flowpay-screen-header";
import FlowpaySearchbar from "@/components/base/flowpay-searchbar";
import { useInvoices, useDeleteInvoice } from "@/hooks/use-invoice";
import { DashboardInvoiceItem, InvoiceStatus } from "@/types/invoice";
import { format } from "date-fns";
import FlowpaySectionHeader from "@/components/base/flowpay-section-header";
import { router } from "expo-router";
import FlowpayInvoiceListingCard from "@/components/containers/flowpay-invoice-listing-card";
import { FlowpayButton } from "@/components/ui/flowpay-button";

const mapServerStatusToType = (status: string): InvoiceStatus => {
  switch (status.toLowerCase()) {
    case "paid":
      return "Paid";
    case "overdue":
      return "Overdue";
    case "cancelled":
      return "Cancel";
    case "sent":
    case "draft":
    default:
      return "Due";
  }
};

export default function Invoices() {
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor("default-foreground");

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "draft" | "sent" | "paid" | "overdue" | "cancelled" | undefined
  >();

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  const {
    data: invoicesResponse,
    isLoading,
    error,
  } = useInvoices({
    limit: 50,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const deleteInvoice = useDeleteInvoice();

  const groupedInvoices = useMemo(() => {
    const list = invoicesResponse?.data ?? [];

    // Create an object keyed by "Month Year" string
    const groups: Record<string, DashboardInvoiceItem[]> = {};

    list.forEach((inv: any) => {
      const date = new Date(inv.createdAt);
      const monthYear = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      const pItem: DashboardInvoiceItem = {
        id: inv.id,
        title: inv.clientName || inv.invoiceNumber,
        datetime: format(new Date(inv.createdAt), "yyyy-MM-dd HH:mm"),
        amount: inv.total,
        status: mapServerStatusToType(inv.status),
      };

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(pItem);
    });

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [invoicesResponse?.data]);

  const handleDelete = (id: string | number) => {
    setDeleteInvoiceId(String(id));
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteInvoiceId) {
      deleteInvoice.mutate(deleteInvoiceId);
      setDeleteModalVisible(false);
      setDeleteInvoiceId(null);
    }
  };

  return (
    <View
      className="flex-1 bg-brand-white dark:bg-brand-green-900"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 w-full">
        <FlowpayScreenHeader
          title="Invoice"
          rightElement={
            <Button
              onPress={() => router.push("/invoice/add")}
              isIconOnly
              variant="secondary"
              className="rounded-[40px] w-12.5 h-12.5"
            >
              <Ionicons name="add" size={24} color={iconColor} />
            </Button>
          }
        />
      </View>

      <ScrollView
        className="flex-1 w-full px-4"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <FlowpaySearchbar
          onSearchPress={() => {}}
          onFilterPress={() => setIsFilterModalVisible(true)}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <Spinner size="lg" color="success" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center py-10 px-6">
            <Text className="text-brand-red-500 font-bold text-center mb-2">
              Error loading invoices
            </Text>
            <Text className="text-brand-black dark:text-brand-white text-center text-sm">
              {error.message}
            </Text>
          </View>
        ) : groupedInvoices.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-brand-black dark:text-brand-white">
              No invoices found.
            </Text>
          </View>
        ) : (
          groupedInvoices.map(([monthYear, items]) => {
            const isCurrentMonth =
              monthYear ===
              new Date().toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              });
            const title = isCurrentMonth
              ? "On this Month"
              : `Invoice ${monthYear.split(" ")[0]}`;

            return (
              <View key={monthYear} className="flex-col w-full mb-8">
                <FlowpaySectionHeader
                  title={title}
                  rightTitle={`${items.length} Service`}
                  rightTitleClassName="text-brand-white"
                />

                <FlowpayInvoiceListingCard
                  invoices={items}
                  onLoadMore={() => console.log(`Load more ${monthYear}`)}
                  onPressItem={(item) => router.push(`/invoice/${item.id}`)}
                  onDeleteItem={handleDelete}
                  initialRenderCount={2}
                />
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomSheet isOpen={isFilterModalVisible} onOpenChange={setIsFilterModalVisible}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Close />
            <BottomSheet.Title>Filter by Status</BottomSheet.Title>
            <View className="flex-col gap-2 mt-2">
              {(
                [
                  { label: "All", value: undefined },
                  { label: "Draft", value: "draft" },
                  { label: "Sent", value: "sent" },
                  { label: "Paid", value: "paid" },
                  { label: "Overdue", value: "overdue" },
                  { label: "Cancelled", value: "cancelled" },
                ] as const
              ).map((option) => {
                const isSelected = statusFilter === option.value;
                return (
                  <Button
                    key={option.label}
                    variant={isSelected ? "primary" : "ghost"}
                    size="sm"
                    onPress={() => {
                      setStatusFilter(option.value);
                      setIsFilterModalVisible(false);
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>

      <Dialog isOpen={isDeleteModalVisible} onOpenChange={setDeleteModalVisible}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Delete Invoice</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this invoice? This action cannot be
              undone.
            </Dialog.Description>
            <View className="flex-row items-center justify-end gap-3 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeleteInvoiceId(null);
                }}
              >
                Cancel
              </Button>
              <FlowpayButton
                variant="solid"
                color="danger"
                size="sm"
                onPress={confirmDelete}
                isLoading={deleteInvoice.isPending}
              >
                Delete
              </FlowpayButton>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  );
}

import React, { useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Button, useThemeColor } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";

import {
  useInvoice,
  useUpdateInvoiceStatus,
  useDeleteInvoice,
} from "@/hooks/use-invoice";
import { api } from "@/lib/api-client";
import { InvoiceStatus } from "@/types/invoice";
import FlowpayScreenHeader from "@/components/base/flowpay-screen-header";
import ActionButton from "@/components/ui/action-button";
import { Container } from "@/components/container";

import { InvoiceHeaderCard } from "../containers/invoice/invoice-header-card";
import { InvoiceItemsCard } from "../containers/invoice/invoice-items-card";
import { InvoiceNoteCard } from "../containers/invoice/invoice-note-card";
import {
  InvoiceStatusCard,
  ServerStatus,
} from "../containers/invoice/invoice-status-card";

const mapToDisplayStatus = (status: ServerStatus): InvoiceStatus => {
  switch (status) {
    case "paid":
      return "Paid";
    case "overdue":
      return "Overdue";
    case "cancelled":
      return "Cancel";
    default:
      return "Due";
  }
};

interface InvoiceDetailTemplateProps {
  id: string;
}

export default function InvoiceDetailTemplate({ id }: InvoiceDetailTemplateProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dangerColor = useThemeColor("danger");

  const { data: invoiceResponse, isLoading } = useInvoice(id);
  const updateStatus = useUpdateInvoiceStatus();
  const deleteInvoice = useDeleteInvoice();

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const invoice = (invoiceResponse as any)?.data;

  // ── Helpers ──────────────────────────────────────────────────

  const formatDate = (d: string | Date | null) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ── Status Update ───────────────────────────────────────────

  const handleStatusUpdate = (newStatus: ServerStatus) => {
    if (!invoice) return;
    Alert.alert("Update Status", `Change status to "${newStatus}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            await updateStatus.mutateAsync({ id, status: newStatus });
            Alert.alert("Success", "Invoice status updated.");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to update status");
          }
        },
      },
    ]);
  };

  // ── Delete ──────────────────────────────────────────────────

  const handleDelete = () => {
    Alert.alert(
      "Delete Invoice",
      "Are you sure you want to delete this invoice? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteInvoice.mutateAsync(id);
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete invoice");
            }
          },
        },
      ],
    );
  };

  // ── PDF Download ────────────────────────────────────────────

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    setIsPdfLoading(true);
    try {
      // Fetch HTML from server
      const res = await api.api.invoice[":id"].html.$get({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to fetch invoice HTML");
      const { html } = (await res.json()) as { html: string };

      // Print to PDF locally
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `Invoice ${invoice.invoiceNumber}`,
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Saved", `PDF saved to: ${uri}`);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to generate PDF");
    } finally {
      setIsPdfLoading(false);
    }
  };

  // ── Loading State ───────────────────────────────────────────

  if (isLoading || !invoice) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-flashwhite dark:bg-brand-green-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const displayStatus = mapToDisplayStatus(invoice.status);

  return (
    <View
      className="flex-1 bg-brand-flashwhite dark:bg-dark-green"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="px-5 w-full">
        <FlowpayScreenHeader
          title="Invoice Details"
          showBack={true}
          onBack={() => router.back()}
          rightElement={
            <Button
              onPress={handleDelete}
              isIconOnly
              variant="ghost"
              className="rounded-[40px] w-12.5 h-12.5"
            >
              <Ionicons name="trash-outline" size={24} color={dangerColor} />
            </Button>
          }
        />
      </View>

      <Container
        className="px-5 pt-6 flex-1 bg-transparent"
        isScrollable={true}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
      >
        <View style={{ paddingBottom: 120 }}>
          <InvoiceHeaderCard
            invoice={invoice}
            displayStatus={displayStatus}
            formatDate={formatDate}
          />

          <InvoiceItemsCard invoice={invoice} />

          <InvoiceNoteCard note={invoice.note} />

          <InvoiceStatusCard
            currentStatus={invoice.status}
            isPending={updateStatus.isPending}
            onStatusUpdate={handleStatusUpdate}
          />
        </View>
      </Container>

      {/* Bottom Download Button */}
      <View className="absolute bottom-6 left-0 right-0 px-8">
        <ActionButton
          label={isPdfLoading ? "Generating PDF..." : "Download PDF"}
          onPress={handleDownloadPdf}
          className="w-full"
          disabled={isPdfLoading}
        />
      </View>
    </View>
  );
}

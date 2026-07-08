import React from "react";
import { useLocalSearchParams } from "expo-router";
import InvoiceDetailTemplate from "@/components/templates/invoice-detail-template";

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <InvoiceDetailTemplate id={id} />;
}

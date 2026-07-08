import { View, Text, Alert, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCreateInvoice } from "@/hooks/use-invoice";
import { createInvoiceSchema } from "@flowpay/schema";
import { InvoiceItemForm } from "@/types/invoice";
import { formatDateTime } from "@/lib/format";
import FlowpayScreenHeader from "@/components/base/flowpay-screen-header";
import ActionButton from "@/components/ui/action-button";
import FlowpayInput from "@/components/ui/flowpay-input";
import { FormDateField } from "@/components/ui/form-date-field";
import { FormNoteInput } from "@/components/ui/form-note-input";
import { FlowpayDateTimePicker } from "@/components/containers/flowpay-date-time-picker";

export default function AddInvoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createInvoice = useCreateInvoice();

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${Date.now().toString().slice(-6)}`,
  );
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [note, setNote] = useState("");

  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  // Dynamic invoice items
  const [items, setItems] = useState<InvoiceItemForm[]>([
    {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      description: "",
      quantity: "1",
      unitPrice: "",
    },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        description: "",
        quantity: "1",
        unitPrice: "",
      },
    ]);
  };

  const handleUpdateItem = (
    id: string,
    field: keyof InvoiceItemForm,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce(
      (acc, item) =>
        acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * ((Number(taxRate) || 0) / 100);
  const total = subtotal + taxAmount;

  const handleSave = async () => {
    // 1. Prepare raw data exactly as the server schema expects
    const rawData = {
      invoiceNumber,
      clientName,
      clientEmail: clientEmail.trim() || undefined,
      taxRate: taxRate ? Number(taxRate) : undefined,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      note: note || undefined,
      items: items.map((item) => ({
        description: item.description.trim(),
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
      })),
    };

    // 2. Validate against Zod schema to generate proper UI error strings locally
    const parseResult = createInvoiceSchema.safeParse(rawData);
    if (!parseResult.success) {
      // Pick the first error to show to the user smoothly
      const firstError = parseResult.error.issues[0];
      let fieldPath = firstError.path.join(".");

      // Make array item errors user-friendly
      if (
        firstError.path[0] === "items" &&
        typeof firstError.path[1] === "number"
      ) {
        fieldPath = `Item ${Number(firstError.path[1]) + 1} ${String(firstError.path[2])}`;
      }

      Alert.alert("Validation Error", `${fieldPath}: ${firstError.message}`);
      return;
    }

    // 3. We are good to go, mutate!
    try {
      await createInvoice.mutateAsync(parseResult.data);

      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create invoice");
    }
  };

  return (
    <View
      className="flex-1 bg-brand-flashwhite dark:bg-brand-green-900"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="px-4 mt-2.5 w-full">
        <FlowpayScreenHeader
          title="Create Invoice"
          showBack={true}
          onBack={() => router.back()}
        />
      </View>

      <ScrollView
        className="flex-1 px-4 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-col gap-y-4">
          <FlowpayInput
            label="Invoice Number *"
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="INV-XXXXXX"
          />

          <FlowpayInput
            label="Client Name *"
            value={clientName}
            onChangeText={setClientName}
            placeholder="Name or company"
          />

          <FlowpayInput
            label="Client Email"
            value={clientEmail}
            onChangeText={setClientEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View className="flex-col gap-y-4">
            <FormDateField
              label="Issue Date"
              value={formatDateTime(issueDate)}
              onPress={() => setShowIssueDatePicker(true)}
            />
            <FormDateField
              label="Due Date"
              value={formatDateTime(dueDate)}
              onPress={() => setShowDueDatePicker(true)}
            />
          </View>

          <View className="mt-4 mb-2">
            <Text className="text-[16px] font-bold text-brand-black dark:text-brand-white mb-2">
              Items
            </Text>
            {items.map((item, index) => (
              <View
                key={item.id}
                className="p-4 bg-white dark:bg-dark-green rounded-[15px] mb-3 border border-gray-200 dark:border-transparent"
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-[14px] font-bold text-brand-black dark:text-brand-white">
                    Item {index + 1}
                  </Text>
                  {items.length > 1 && (
                    <Pressable
                      onPress={() => handleRemoveItem(item.id)}
                      className="p-1"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#E9383E"
                      />
                    </Pressable>
                  )}
                </View>

                <View className="flex-col gap-y-3">
                  <FlowpayInput
                    label="Description"
                    value={item.description}
                    onChangeText={(val) =>
                      handleUpdateItem(item.id, "description", val)
                    }
                    placeholder="E.g., Website Design"
                  />

                  <View className="flex-row gap-x-3">
                    <View className="flex-1">
                      <FlowpayInput
                        label="Quantity"
                        value={item.quantity}
                        onChangeText={(val) =>
                          handleUpdateItem(item.id, "quantity", val)
                        }
                        keyboardType="numeric"
                        placeholder="1"
                      />
                    </View>
                    <View className="flex-1">
                      <FlowpayInput
                        label="Unit Price"
                        value={item.unitPrice}
                        onChangeText={(val) =>
                          handleUpdateItem(item.id, "unitPrice", val)
                        }
                        keyboardType="numeric"
                        placeholder="0.00"
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <Pressable
              onPress={handleAddItem}
              className="py-3 items-center justify-center border-2 border-dashed border-brand-green-500 rounded-[15px]"
            >
              <Text className="text-brand-green-500 font-bold">+ Add Item</Text>
            </Pressable>
          </View>

          <View className="flex-row gap-x-4 mt-2">
            <View className="flex-1">
              <FlowpayInput
                label="Tax Rate (%)"
                value={taxRate}
                onChangeText={setTaxRate}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View className="flex-col flex-1 justify-center items-end px-2 pt-4">
              <Text className="text-body-sm text-brand-grey dark:text-gray-400">
                Subtotal: ${subtotal.toFixed(2)}
              </Text>
              <Text className="text-body-sm text-brand-grey dark:text-gray-400">
                Tax: ${taxAmount.toFixed(2)}
              </Text>
              <Text className="text-[16px] font-bold text-brand-black dark:text-brand-white mt-1">
                Total: ${total.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="mt-2">
            <FormNoteInput value={note} onChangeText={setNote} />
          </View>
        </View>
      </ScrollView>

      {/* Action Button pinned to bottom */}
      <View className="absolute bottom-6 left-0 right-0 px-20.5">
        <ActionButton
          label={createInvoice.isPending ? "Saving..." : "Create Invoice"}
          onPress={handleSave}
          className="w-full"
          disabled={createInvoice.isPending}
        />
      </View>

      {/* Date & Time Pickers */}
      <FlowpayDateTimePicker
        visible={showIssueDatePicker}
        value={issueDate}
        onDateChange={setIssueDate}
        onConfirm={() => setShowIssueDatePicker(false)}
        onCancel={() => setShowIssueDatePicker(false)}
      />

      <FlowpayDateTimePicker
        visible={showDueDatePicker}
        value={dueDate}
        onDateChange={setDueDate}
        onConfirm={() => setShowDueDatePicker(false)}
        onCancel={() => setShowDueDatePicker(false)}
      />
    </View>
  );
}

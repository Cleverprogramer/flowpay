import React from "react";
import { Text } from "react-native";
import { Card } from "heroui-native";

interface InvoiceNoteCardProps {
  note: string;
}

export function InvoiceNoteCard({ note }: InvoiceNoteCardProps) {
  if (!note) return null;

  return (
    <Card
      variant="secondary"
      className="mb-4 rounded-[30px] p-0 overflow-hidden"
    >
      <Card.Body className="p-5 bg-brand-white dark:bg-brand-green-500">
        <Text
          className="text-body-xs text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          Note
        </Text>
        <Text
          className="text-body-md text-brand-black dark:text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          {note}
        </Text>
      </Card.Body>
    </Card>
  );
}

import {
  View,
  LayoutAnimation,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { DashboardInvoiceItem } from "@/types/invoice";
import { Button, Card, Surface, useThemeColor, Chip } from "heroui-native";
import { GeneralWallet } from "../ui/icons/GeneralWallet";
import { GeneralChevronDo } from "../ui/icons/GeneralChevronDo";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface FlowpayInvoiceListingCardProps {
  invoices: DashboardInvoiceItem[];
  onLoadMore?: () => void;
  onPressItem?: (item: DashboardInvoiceItem) => void;
  onDeleteItem?: (id: string | number) => void;
  className?: string;
  loadMoreText?: string;
  initialRenderCount?: number;
}

export default function FlowpayInvoiceListingCard({
  invoices,
  onLoadMore,
  onPressItem,
  onDeleteItem,
  className,
  loadMoreText,
  initialRenderCount,
}: FlowpayInvoiceListingCardProps) {
  const iconColor = useThemeColor("default-foreground");
  const dangerColor = useThemeColor("danger");
  const [visibleCount, setVisibleCount] = useState(initialRenderCount);

  const visibleInvoices = invoices.slice(0, visibleCount);
  const isAllVisible = visibleCount! >= invoices.length;
  const currentLoadMoreText = isAllVisible ? "Show Less" : loadMoreText;

  const handleLoadMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!isAllVisible) {
      setVisibleCount(invoices.length);
      onLoadMore?.();
    } else {
      setVisibleCount(initialRenderCount);
    }
  };

  return (
    <Card
      variant="secondary"
      className={`rounded-[20px] p-0 overflow-hidden ${className}`}
    >
      <Card.Body className="p-4 bg-brand-flashwhite dark:bg-brand-green-500">
        <View className="flex-col gap-y-3 w-full">
          {visibleInvoices.map((invoice, index) => {
            return (
              <View key={invoice.id} className="flex-col gap-y-3">
                <Pressable
                  onPress={() => onPressItem?.(invoice)}
                  className="flex-row items-center justify-between w-full h-12.5"
                >
                  <View className="flex-row items-center gap-x-3.5 flex-1 pr-2">
                    <Surface
                      variant="tertiary"
                      className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-white dark:bg-dark-charcoal-green"
                    >
                      {invoice.icon ? (
                        invoice.icon
                      ) : (
                        <GeneralWallet
                          color={iconColor}
                          width={23}
                          height={23}
                        />
                      )}
                    </Surface>

                    <View className="flex-col items-start h-11.5 justify-between flex-1 overflow-hidden">
                      <Card.Title
                        className="text-[16px] leading-5 text-brand-black dark:text-brand-white"
                        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                        numberOfLines={1}
                      >
                        {invoice.title}
                      </Card.Title>
                      <Card.Description
                        className="text-body-xs leading-3.75 text-brand-black dark:text-brand-white"
                        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                        numberOfLines={1}
                      >
                        {invoice.datetime}
                      </Card.Description>
                    </View>
                  </View>

                  <View className="flex-col items-end h-12.5 justify-between">
                    <View className="flex-row items-center gap-x-1">
                      <Card.Title
                        className="text-[16px] leading-5 text-brand-black dark:text-brand-white text-right"
                        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                        numberOfLines={1}
                      >
                        {typeof invoice.amount === "number"
                          ? `$${invoice.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : invoice.amount}
                      </Card.Title>

                      {onDeleteItem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          isIconOnly
                          onPress={() => onDeleteItem(invoice.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color={dangerColor}
                          />
                        </Button>
                      )}
                    </View>

                    <Chip
                      size="sm"
                      variant="primary"
                      color={
                        invoice.status === "Paid"
                          ? "success"
                          : invoice.status === "Due"
                            ? "warning"
                            : "danger"
                      }
                      className="min-w-15 items-center justify-center"
                    >
                      <Chip.Label
                        className="text-body-sm leading-3.75"
                        style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
                      >
                        {invoice.status}
                      </Chip.Label>
                    </Chip>
                  </View>
                </Pressable>

                {/* Separator as displayed in Figma */}
                {index < visibleInvoices.length - 1 && (
                  <View className="w-full h-px bg-[#D9D9D9] opacity-30" />
                )}
              </View>
            );
          })}
        </View>

        {/* Load More Trigger */}
        {invoices.length > initialRenderCount! && (
          <Pressable
            onPress={handleLoadMore}
            className="flex-col items-center justify-center w-full mt-2 h-13.25 gap-y-2.5"
          >
            <Card.Title
              className="text-[16px] leading-5 text-brand-green-500 dark:text-[#E8ECEB] text-center"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {currentLoadMoreText}
            </Card.Title>
            <View
              style={isAllVisible ? { transform: [{ rotate: "180deg" }] } : {}}
            >
              <GeneralChevronDo
                color={iconColor}
                width={23}
                height={23}
              />
            </View>
          </Pressable>
        )}
      </Card.Body>
    </Card>
  );
}

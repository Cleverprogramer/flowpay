import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Dialog, Spinner, useThemeColor } from "heroui-native";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import FlowpayScreenHeader from "../base/flowpay-screen-header";
import { FlowpayButton } from "../ui/flowpay-button";
import { Ionicons } from "@expo/vector-icons";
import { Container } from "../container";
import CategoryItem from "../containers/category/category-item";
import AddCategoryDialog from "../containers/category/add-category-dialog";

export default function CategoryTemplate() {
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor("default-foreground");

  const { data: categoriesData, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData || [];

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteCategoryId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteCategoryId) {
      deleteCategory.mutate(deleteCategoryId);
      setDeleteModalVisible(false);
      setDeleteCategoryId(null);
    }
  };

  return (
    <View
      className="flex-1 bg-brand-white dark:bg-brand-green-900"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-5 w-full">
        <FlowpayScreenHeader
          title="Categories"
          showBack={true}
          rightElement={
            <Button
              onPress={() => setAddModalVisible(true)}
              isIconOnly
              variant="secondary"
              className="rounded-[40px] w-12.5 h-12.5"
            >
              <Ionicons name="add" size={24} color={iconColor} />
            </Button>
          }
        />
      </View>

      <Container className="px-5 pt-2 flex-1" isScrollable={false}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="lg" color="success" />
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryItem item={item} onDelete={handleDelete} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <Text
                className="text-center text-brand-silver mt-10"
                style={{ fontFamily: "PlusJakartaSans_500Medium" }}
              >
                No categories found. Start by adding one.
              </Text>
            }
          />
        )}
      </Container>

      <AddCategoryDialog
        isOpen={isAddModalVisible}
        onOpenChange={setAddModalVisible}
      />

      <Dialog
        isOpen={isDeleteModalVisible}
        onOpenChange={setDeleteModalVisible}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Delete Category</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </Dialog.Description>
            <View className="flex-row items-center justify-end gap-3 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeleteCategoryId(null);
                }}
              >
                Cancel
              </Button>
              <FlowpayButton
                variant="solid"
                color="danger"
                size="sm"
                onPress={confirmDelete}
                isLoading={deleteCategory.isPending}
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

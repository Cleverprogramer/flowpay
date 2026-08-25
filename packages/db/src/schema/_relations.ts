import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { category } from "./category";
import { wallet } from "./wallet";
import { transaction } from "./transaction";
import { budget } from "./budget";
import { notification } from "./notification";
import { invoice, invoiceItem } from "./invoice";
import { goal } from "./goal";
import { recurringRule } from "./recurring-rule";
import { client } from "./client";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
  user: one(user, {
    fields: [category.userId],
    references: [user.id],
  }),
  transactions: many(transaction),
  budgets: many(budget),
}));

export const walletRelations = relations(wallet, ({ one, many }) => ({
  user: one(user, {
    fields: [wallet.userId],
    references: [user.id],
  }),
  transactions: many(transaction),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
  }),
  wallet: one(wallet, {
    fields: [transaction.walletId],
    references: [wallet.id],
  }),
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
  }),
}));

export const budgetRelations = relations(budget, ({ one }) => ({
  user: one(user, {
    fields: [budget.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [budget.categoryId],
    references: [category.id],
  }),
}));

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
  user: one(user, {
    fields: [invoice.userId],
    references: [user.id],
  }),
  client: one(client, {
    fields: [invoice.clientId],
    references: [client.id],
  }),
  items: many(invoiceItem),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userId],
    references: [user.id],
  }),
}));

export const goalRelations = relations(goal, ({ one }) => ({
  user: one(user, {
    fields: [goal.userId],
    references: [user.id],
  }),
  wallet: one(wallet, {
    fields: [goal.walletId],
    references: [wallet.id],
  }),
}));

export const recurringRuleRelations = relations(recurringRule, ({ one }) => ({
  user: one(user, {
    fields: [recurringRule.userId],
    references: [user.id],
  }),
  wallet: one(wallet, {
    fields: [recurringRule.walletId],
    references: [wallet.id],
  }),
  category: one(category, {
    fields: [recurringRule.categoryId],
    references: [category.id],
  }),
}));

export const clientRelations = relations(client, ({ one, many }) => ({
  user: one(user, {
    fields: [client.userId],
    references: [user.id],
  }),
  invoices: many(invoice),
}));

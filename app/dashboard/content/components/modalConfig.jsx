export const MODERATION_CONFIG = {
  approve: {
    title: "Approve Content",
    description:
      "This content will be approved and removed from the report queue.",
    confirmText: "Approve",
    confirmVariant: "default",
    onConfirm: (item) => console.log("Approved:", item.id),
  },
  remove: {
    title: "Remove Content",
    description: "This content will be permanently removed from the platform.",
    confirmText: "Remove",
    confirmVariant: "destructive",
    onConfirm: (item) => console.log("Removed:", item.id),
  },
  warn: {
    title: "Issue Warning",
    description: "A warning will be sent to the content owner.",
    confirmText: "Send Warning",
    confirmVariant: "outline",
    onConfirm: (item) => console.log("Warned:", item.owner),
  },
  suspend: {
    title: "Suspend or Ban User",
    description: "This action will restrict the user’s account.",
    confirmText: "Confirm Action",
    confirmVariant: "destructive",
    onConfirm: (item) => console.log("Suspended:", item.owner),
  },
  reject: {
    title: "Reject this report",
    description:
      "The flagged content does not violate our guidelines, and the report will be closed.",
    confirmText: "Confirm Action",
    confirmVariant: "destructive",
    onConfirm: (item) => console.log("Rejected:", item.owner),
  },
};

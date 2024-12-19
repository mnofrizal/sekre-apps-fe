import React from "react";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { FRONTEND_BASE_URL } from "@/lib/constant";

const PENDING_STATUSES = [
  "PENDING_SUPERVISOR",
  "PENDING_GA",
  "PENDING_KITCHEN",
];

const getApproveButtonText = (role, status) => {
  if (role !== "ADMIN") return "Approve";

  const statusToText = {
    PENDING_SUPERVISOR: "Approve as Supervisor",
    PENDING_KITCHEN: "Approve as Kitchen",
    PENDING_GA: "Approve",
  };

  return statusToText[status] || "Approve";
};

export const OrderApprovalFooter = ({
  isSecretary,
  order,
  session,
  onApprove,
  onReject,
}) => {
  if (isSecretary || !PENDING_STATUSES.includes(order.status)) {
    return null;
  }

  const findLink = (status, type) =>
    order.status === status
      ? order.approvalLinks.find((link) => link.type === type && !link.isUsed)
      : null;

  const getApprovalToken = () => {
    if (session.user.role === "ADMIN") {
      return order.approvalLinks.find((link) => !link.isUsed)?.token;
    } else {
      switch (session.user.role) {
        case "SUPERVISOR":
          return findLink("PENDING_SUPERVISOR", "SUPERVISOR")?.token;
        case "KITCHEN":
          return findLink("PENDING_KITCHEN", "KITCHEN")?.token;
        default:
          return null;
      }
    }
  };

  const approvalToken = getApprovalToken();

  const copyLink = () => {
    if (approvalToken) {
      navigator.clipboard.writeText(
        `${FRONTEND_BASE_URL}/requests/approval/${approvalToken}`
      );
    }
  };

  return (
    <CardFooter className="bg-muted p-4">
      <div className="flex w-full justify-end space-x-2">
        {approvalToken && (
          <Button variant="secondary" onClick={copyLink}>
            Copy Approval Link
          </Button>
        )}
        <Button variant="outline" onClick={() => onReject(approvalToken)}>
          Reject
        </Button>
        <Button onClick={() => onApprove(approvalToken)}>
          {getApproveButtonText(session.user.role, order.status)}
        </Button>
      </div>
    </CardFooter>
  );
};

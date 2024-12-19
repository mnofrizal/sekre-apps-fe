import React from "react";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";

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

  // Find approval link when status is PENDING_SUPERVISOR
  const supervisorLink =
    order.status === "PENDING_SUPERVISOR"
      ? order.approvalLinks.find(
          (link) => link.type === "SUPERVISOR" && !link.isUsed
        )
      : null;

  // Find approval link when status is PENDING_GA
  const gaLink =
    order.status === "PENDING_GA"
      ? order.approvalLinks.find((link) => link.type === "GA" && !link.isUsed)
      : null;

  // Find approval link when status is PENDING_KITCHEN
  const kitchenLink =
    order.status === "PENDING_KITCHEN"
      ? order.approvalLinks.find(
          (link) => link.type === "KITCHEN" && !link.isUsed
        )
      : null;

  return (
    <CardFooter className="bg-muted p-4">
      <div className="flex w-full justify-end space-x-2">
        {supervisorLink && (
          <Button
            variant="secondary"
            onClick={() => {
              // You can copy the link or handle it as needed
              navigator.clipboard.writeText(`/approve/${supervisorLink.token}`);
            }}
          >
            Copy Supervisor Link
          </Button>
        )}
        {gaLink && (
          <Button
            variant="secondary"
            onClick={() => {
              // You can copy the link or handle it as needed
              navigator.clipboard.writeText(`/approve/${gaLink.token}`);
            }}
          >
            Copy GA Link
          </Button>
        )}
        {kitchenLink && (
          <Button
            variant="secondary"
            onClick={() => {
              // You can copy the link or handle it as needed
              navigator.clipboard.writeText(`/approve/${kitchenLink.token}`);
            }}
          >
            Copy Kitchen Link
          </Button>
        )}
        <Button variant="outline" onClick={() => onReject(order.id)}>
          Reject
        </Button>
        <Button onClick={() => onApprove(order.id)}>
          {getApproveButtonText(session.user.role, order.status)}
        </Button>
      </div>
    </CardFooter>
  );
};

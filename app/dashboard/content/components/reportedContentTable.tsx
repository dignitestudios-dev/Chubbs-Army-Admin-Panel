"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ModerationActionModal from "./ModerationActionModal";
import { MODERATION_CONFIG } from "./modalConfig";

export default function ReportedContentTable({ data }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openApprove = (item) => {
    setSelectedItem(item);
    setModalType("reject");
  };

  // const openWarn = (item) => {
  //   setSelectedItem(item);
  //   setModalType("warn");
  // };

  const openSuspend = (item) => {
    setSelectedItem(item);
    setModalType("suspend");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Content</TableHead> */}
            <TableHead>Reported Pet</TableHead>
            <TableHead>Report Reason</TableHead>
            <TableHead>Reported By</TableHead>
            {/* <TableHead>Reports</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {/* Content Preview */}
              {/* <TableCell className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-md overflow-hidden border">
                  <Image
                    src={item.thumbnail}
                    alt="content"
                    fill
                    className="object-cover"
                  />
                </div>
                <Badge variant="secondary" className="capitalize">
                  {item.type}
                </Badge>
              </TableCell> */}

              {/* Owner */}
              <TableCell className="font-medium">
                @{item?.pet?.petName}
              </TableCell>

              {/* Report Reason */}
              <TableCell>
                <Badge variant="outline">{item?.reason}</Badge>
              </TableCell>

              {/* Reported By */}
              <TableCell>@{item?.id}</TableCell>

              {/* Report Count */}
              {/* <TableCell>
                <Badge variant="destructive">{item.reportCount}</Badge>
              </TableCell> */}

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => openApprove(item)}>
                    Reject
                  </Button>

                  {/* <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openRemove(item)}
                  >
                    Remove
                  </Button> */}

                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openWarn(item)}
                  >
                    Warn
                  </Button> */}

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openSuspend(item)}
                  >
                    Ban
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {modalType && (
        <ModerationActionModal
          isOpen={!!modalType}
          onClose={closeModal}
          title={MODERATION_CONFIG[modalType].title}
          description={MODERATION_CONFIG[modalType].description}
          confirmText={MODERATION_CONFIG[modalType].confirmText}
          confirmVariant={MODERATION_CONFIG[modalType].confirmVariant}
          onConfirm={() => {
            MODERATION_CONFIG[modalType].onConfirm(selectedItem);
            closeModal();
          }}
        />
      )}
    </>
  );
}

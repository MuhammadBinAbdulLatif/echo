"use client";

import React, { useState } from "react";
import { Dialog } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { useAction } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: () => void;
};

export const UploadDialog = ({ onOpenChange, open, onFileUploaded }: Props) => {
  const addFile = useAction(api.private.files.addFile);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUpload, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    category: "",
    filename: "",
  });
  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
    }
  };
  return <div>UploadDialog</div>;
};

export default UploadDialog;

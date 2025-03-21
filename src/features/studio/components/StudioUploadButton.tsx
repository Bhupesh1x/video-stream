import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StudioUploadButton() {
  return (
    <Button variant="secondary">
      <PlusIcon />
      <span>Create</span>
    </Button>
  );
}

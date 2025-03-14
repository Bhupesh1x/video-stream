import { UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AuthButton() {
  return (
    <Button
      variant="outline"
      className="rounded-full px-4 py-2 font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 transition shadow-none [&_svg:size-5]"
    >
      <UserCircle />
      Sign in
    </Button>
  );
}

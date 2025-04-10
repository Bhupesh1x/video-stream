import { Loader2 } from "lucide-react";

function loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default loading;

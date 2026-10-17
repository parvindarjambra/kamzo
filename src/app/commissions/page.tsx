import { redirect } from "next/navigation";

export default function CommissionsPage() {
  redirect("/payments?tab=commissions");
}
